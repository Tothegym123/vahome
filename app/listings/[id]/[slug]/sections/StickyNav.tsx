'use client';

import { useEffect, useRef, useState } from 'react';

interface NavAnchor {
  id: string;
  label: string;
}

interface StickyNavProps {
  anchors: NavAnchor[];
}

// Sticky horizontal anchor nav with IntersectionObserver-based scroll-spy.
// Activates the link whose section crosses the upper third of the viewport.
export default function StickyNav({ anchors }: StickyNavProps) {
  const [activeId, setActiveId] = useState<string>(anchors[0]?.id || '');
  const navRef = useRef<HTMLElement | null>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        // Pick the entry that's most prominently visible.
        const visible = entries.filter((e) => e.isIntersecting);
        if (visible.length === 0) return;
        // Prefer the first visible (highest in document order).
        const top = visible.sort((a, b) => a.boundingClientRect.top - b.boundingClientRect.top)[0];
        if (top?.target?.id) setActiveId(top.target.id);
      },
      {
        // Activate when section enters the upper third of viewport.
        rootMargin: '-20% 0px -65% 0px',
        threshold: 0,
      }
    );
    anchors.forEach((a) => {
      const el = document.getElementById(a.id);
      if (el) observer.observe(el);
    });
    return () => observer.disconnect();
  }, [anchors]);

  // Auto-scroll the active link into view inside the nav strip.
  useEffect(() => {
    if (!navRef.current) return;
    const link = navRef.current.querySelector<HTMLAnchorElement>(`a[href="#${activeId}"]`);
    if (link) {
      link.scrollIntoView({ behavior: 'smooth', block: 'nearest', inline: 'center' });
    }
  }, [activeId]);

  return (
    <nav
      ref={navRef}
      aria-label="Listing sections"
      className="sticky top-0 z-30 -mx-4 sm:-mx-6 lg:-mx-8 mb-4 bg-white/95 backdrop-blur border-b border-gray-200 overflow-x-auto no-scrollbar"
    >
      <div className="flex items-center gap-1 px-4 sm:px-6 lg:px-8 py-2 min-w-max">
        {anchors.map((a) => {
          const isActive = a.id === activeId;
          return (
            <a
              key={a.id}
              href={`#${a.id}`}
              className={`whitespace-nowrap px-3 py-1.5 rounded-full text-sm font-medium transition-colors ${
                isActive
                  ? 'bg-blue-600 text-white'
                  : 'text-gray-600 hover:bg-gray-100 hover:text-gray-900'
              }`}
            >
              {a.label}
            </a>
          );
        })}
      </div>
    </nav>
  );
}
