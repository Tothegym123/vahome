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
        const visible = entries.filter((e) => e.isIntersecting);
        if (visible.length === 0) return;
        const top = visible.sort((a, b) => a.boundingClientRect.top - b.boundingClientRect.top)[0];
        if (top?.target?.id) setActiveId(top.target.id);
      },
      {
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

  // Center the active link inside the nav strip's HORIZONTAL scroll only.
  // We deliberately avoid Element.scrollIntoView() because it can hijack the
  // window's vertical scroll (block: 'nearest' on a sticky child causes the
  // viewport to scroll back to where the nav sits in document flow).
  useEffect(() => {
    const nav = navRef.current;
    if (!nav) return;
    const link = nav.querySelector<HTMLAnchorElement>(`a[href="#${activeId}"]`);
    if (!link) return;
    const navRect = nav.getBoundingClientRect();
    const linkRect = link.getBoundingClientRect();
    // Distance from link center to nav center (in viewport coords).
    const offset =
      linkRect.left - navRect.left - nav.clientWidth / 2 + link.clientWidth / 2;
    const target = nav.scrollLeft + offset;
    if (Math.abs(target - nav.scrollLeft) > 4) {
      nav.scrollTo({ left: target, behavior: 'smooth' });
    }
  }, [activeId]);

  const handleClick = (e: React.MouseEvent<HTMLAnchorElement>, id: string) => {
    // Custom anchor scroll so we control the offset (account for sticky nav height)
    const target = document.getElementById(id);
    if (!target) return;
    e.preventDefault();
    const navHeight = navRef.current?.offsetHeight ?? 0;
    const y = target.getBoundingClientRect().top + window.scrollY - navHeight - 8;
    window.scrollTo({ top: y, behavior: 'smooth' });
    if (history.replaceState) history.replaceState(null, '', `#${id}`);
  };

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
              onClick={(e) => handleClick(e, a.id)}
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
