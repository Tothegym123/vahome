'use client';

import { useState, useCallback, useEffect, useRef } from 'react';
import Image from 'next/image';

interface PhotoGalleryProps {
  photos: string[];
  address: string;
}

export default function PhotoGallery({ photos, address }: PhotoGalleryProps) {
  const [lightboxOpen, setLightboxOpen] = useState(false);
  const [activeIndex, setActiveIndex] = useState(0);
  const [showAllThumbs, setShowAllThumbs] = useState(false);
  const thumbContainerRef = useRef<HTMLDivElement>(null);

  const displayPhotos = photos.length > 0 ? photos : ['/placeholder-home.svg'];
  const totalPhotos = displayPhotos.length;
  const visibleThumbs = showAllThumbs ? displayPhotos : displayPhotos.slice(0, 8);

  // Keyboard navigation for lightbox
  useEffect(() => {
    if (!lightboxOpen) return;
    const handleKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setLightboxOpen(false);
      if (e.key === 'ArrowRight') setActiveIndex(i => (i + 1) % totalPhotos);
      if (e.key === 'ArrowLeft') setActiveIndex(i => (i - 1 + totalPhotos) % totalPhotos);
    };
    document.body.style.overflow = 'hidden';
    window.addEventListener('keydown', handleKey);
    return () => {
      document.body.style.overflow = '';
      window.removeEventListener('keydown', handleKey);
    };
  }, [lightboxOpen, totalPhotos]);

  const openLightbox = useCallback((idx: number) => {
    setActiveIndex(idx);
    setLightboxOpen(true);
  }, []);

  const placeholderSvg = 'data:image/svg+xml,%3Csvg xmlns=%22http://www.w3.org/2000/svg%22 width=%22800%22 height=%22600%22%3E%3Crect fill=%22%23e2e8f0%22 width=%22800%22 height=%22600%22/%3E%3Ctext x=%22400%22 y=%22300%22 text-anchor=%22middle%22 fill=%22%2394a3b8%22 font-size=%2220%22%3EPhoto unavailable%3C/text%3E%3C/svg%3E';

  return (
    <>
      {/* Main Gallery Grid */}
      <div className="grid grid-cols-4 grid-rows-2 gap-1 rounded-lg overflow-hidden h-[280px] lg:h-[400px]">

        {/* Hero image - spans 2 cols, 2 rows */}
        <div
          className="col-span-2 row-span-2 relative cursor-pointer group"
          onClick={() => openLightbox(0)}
        >
          <Image
            src={displayPhotos[0]}
            alt={`${address} - Main photo`}
            fill
            className="object-cover group-hover:scale-105 transition-transform duration-300"
            sizes="(max-width: 768px) 100vw, 50vw"
            priority
            onError={(e) => { (e.target as HTMLImageElement).src = placeholderSvg; }}
          />
          <div className="absolute bottom-2 left-2 bg-black/60 text-white text-xs px-2 py-1 rounded">
            {totalPhotos} Photos
          </div>
        </div>

        {/* 4 smaller thumbnails in right half */}
        {[1, 2, 3, 4].map((idx) => (
          <div
            key={idx}
            className="relative cursor-pointer group"
            onClick={() => displayPhotos[idx] && openLightbox(idx)}
          >
            {displayPhotos[idx] ? (
              <Image
                src={displayPhotos[idx]}
                alt={`${address} - Photo ${idx + 1}`}
                fill
                className="object-cover group-hover:scale-105 transition-transform duration-300"
                sizes="(max-width: 768px) 25vw, 15vw"
                loading="lazy"
                onError={(e) => { (e.target as HTMLImageElement).src = placeholderSvg; }}
              />
            ) : (
              <div className="w-full h-full bg-gray-100" />
            )}
            {idx === 4 && totalPhotos > 5 && (
              <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
                <span className="text-white font-semibold text-lg">+{totalPhotos - 5} more</span>
              </div>
            )}
          </div>
        ))}
      </div>

      {/* Thumbnail strip */}
      {totalPhotos > 5 && (
        <div className="mt-2">
          <div ref={thumbContainerRef} className="flex gap-1 overflow-x-auto pb-1 scrollbar-thin">
            {visibleThumbs.map((photo, idx) => (
              <button
                key={idx}
                onClick={() => openLightbox(idx)}
                className="flex-shrink-0 relative w-16 h-12 rounded overflow-hidden border-2 border-transparent hover:border-blue-500 transition-colors"
              >
                <Image
                  src={photo}
                  alt={`${address} thumb ${idx + 1}`}
                  fill
                  className="object-cover"
                  sizes="64px"
                  loading="lazy"
                  onError={(e) => { (e.target as HTMLImageElement).src = placeholderSvg; }}
                />
              </button>
            ))}
            {!showAllThumbs && totalPhotos > 8 && (
              <button
                onClick={() => setShowAllThumbs(true)}
                className="flex-shrink-0 w-16 h-12 rounded bg-gray-100 flex items-center justify-center text-xs text-gray-600 hover:bg-gray-200"
              >
                +{totalPhotos - 8}
              </button>
            )}
          </div>
        </div>
      )}

      {/* Fullscreen Lightbox */}
      {lightboxOpen && (
        <div className="fixed inset-0 z-50 bg-black/95 flex flex-col">

          {/* Top bar */}
          <div className="flex items-center justify-between px-4 py-3 text-white">
            <span className="text-sm">{activeIndex + 1} / {totalPhotos}</span>
            <span className="text-sm font-medium truncate mx-4">{address}</span>
            <button
              onClick={() => setLightboxOpen(false)}
              className="w-10 h-10 flex items-center justify-center rounded-full hover:bg-white/10 text-2xl"
              aria-label="Close lightbox"
            >
              &times;
            </button>
          </div>

          {/* Main image area with nav arrows */}
          <div className="flex-1 relative flex items-center justify-center px-12">

            {/* Left arrow */}
            <button
              onClick={() => setActiveIndex(i => (i - 1 + totalPhotos) % totalPhotos)}
              className="absolute left-2 z-10 w-12 h-12 flex items-center justify-center rounded-full bg-black/40 hover:bg-black/60 text-white text-2xl"
              aria-label="Previous photo"
            >
              &#8249;
            </button>

            {/* Photo */}
            <div className="relative w-full h-full max-w-5xl max-h-[calc(100vh-140px)]">
              <Image
                src={displayPhotos[activeIndex]}
                alt={`${address} - Photo ${activeIndex + 1}`}
                fill
                className="object-contain"
                sizes="100vw"
                priority
                quality={85}
                onError={(e) => { (e.target as HTMLImageElement).src = placeholderSvg; }}
              />
            </div>

            {/* Right arrow */}
            <button
              onClick={() => setActiveIndex(i => (i + 1) % totalPhotos)}
              className="absolute right-2 z-10 w-12 h-12 flex items-center justify-center rounded-full bg-black/40 hover:bg-black/60 text-white text-2xl"
              aria-label="Next photo"
            >
              &#8250;
            </button>
          </div>

          {/* Bottom thumbnail strip */}
          <div className="px-4 py-2 flex gap-1 overflow-x-auto justify-center">
            {displayPhotos.map((photo, idx) => (
              <button
                key={idx}
                onClick={() => setActiveIndex(idx)}
                className={`flex-shrink-0 relative w-14 h-10 rounded overflow-hidden border-2 transition-colors ${activeIndex === idx ? 'border-blue-500 opacity-100' : 'border-transparent opacity-60 hover:opacity-100'}`}
              >
                <Image
                  src={photo}
                  alt={`Thumb ${idx + 1}`}
                  fill
                  className="object-cover"
                  sizes="56px"
                  loading="lazy"
                  onError={(e) => { (e.target as HTMLImageElement).src = placeholderSvg; }}
                />
              </button>
            ))}
          </div>

        </div>
      )}
    </>
  );
}