import { gsap } from "gsap";
import { useEffect, useRef, useState, useCallback } from "react";
import "./Gallery.css";

export default function Gallery({ isActive }) {
  const [lightboxOpen, setLightboxOpen] = useState(false);
  const [currentIndex, setCurrentIndex] = useState(0);

  const photosRef = useRef([]);
  const lightboxImgRef = useRef(null);

  const photos = [
    { src: "/images/pic1.jpg", alt: "Memory 1" },
    { src: "/images/pic2.jpg", alt: "Memory 2" },
    { src: "/images/pic3.jpg", alt: "Memory 3" },
    { src: "/images/pic4.jpg", alt: "Memory 4" },
    { src: "/images/pic5.jpg", alt: "Memory 5" },
    { src: "/images/pic6.jpg", alt: "Memory 6" },
  ];

  // Animate photos on mount or when active
  useEffect(() => {
    if (!isActive) return;
    gsap.fromTo(
      photosRef.current,
      { opacity: 0, y: 50, scale: 0.8 },
      { opacity: 1, y: 0, scale: 1, duration: 0.6, stagger: 0.12, ease: "back.out(1.4)" }
    );
  }, [isActive]);

  const openLightbox = (index) => {
    setCurrentIndex(index);
    setLightboxOpen(true);
    if (lightboxImgRef.current) {
      gsap.fromTo(
        lightboxImgRef.current,
        { scale: 0.8, opacity: 0 },
        { scale: 1, opacity: 1, duration: 0.4, ease: "back.out(1.4)" }
      );
    }
  };

  const closeLightbox = useCallback(() => setLightboxOpen(false), []);

  useEffect(() => {
    document.body.style.overflow = lightboxOpen ? "hidden" : "";
    return () => { document.body.style.overflow = ""; };
  }, [lightboxOpen]);

  const showNext = useCallback(() => {
    const next = (currentIndex + 1) % photos.length;
    if (lightboxImgRef.current) {
      gsap.to(lightboxImgRef.current, {
        x: -100,
        opacity: 0,
        duration: 0.2,
        onComplete: () => setCurrentIndex(next),
      });
    } else setCurrentIndex(next);
  }, [currentIndex, photos.length]);

  const showPrev = useCallback(() => {
    const prev = (currentIndex - 1 + photos.length) % photos.length;
    if (lightboxImgRef.current) {
      gsap.to(lightboxImgRef.current, {
        x: 100,
        opacity: 0,
        duration: 0.2,
        onComplete: () => setCurrentIndex(prev),
      });
    } else setCurrentIndex(prev);
  }, [currentIndex, photos.length]);

  useEffect(() => {
    const handleKey = (e) => {
      if (!lightboxOpen) return;
      if (e.key === "Escape") closeLightbox();
      if (e.key === "ArrowRight") showNext();
      if (e.key === "ArrowLeft") showPrev();
    };
    window.addEventListener("keydown", handleKey);
    return () => window.removeEventListener("keydown", handleKey);
  }, [lightboxOpen, showNext, showPrev, closeLightbox]);

  return (
    <section className="gallery">
      <h2>📸 Our Beautiful Memories</h2>
      <div className="photos">
        {photos.map((p, i) => (
          <img
            key={i}
            ref={el => (photosRef.current[i] = el)}
            src={p.src}
            alt={p.alt}
            onClick={() => openLightbox(i)}
          />
        ))}
      </div>

      {lightboxOpen && (
        <div className="lightbox" onClick={closeLightbox}>
          <img ref={lightboxImgRef} src={photos[currentIndex].src} alt={photos[currentIndex].alt} onClick={e => e.stopPropagation()} />
          <button className="lightbox-close" onClick={closeLightbox}>✖</button>
          <button className="nav-btn nav-prev" onClick={e => { e.stopPropagation(); showPrev(); }}>‹</button>
          <button className="nav-btn nav-next" onClick={e => { e.stopPropagation(); showNext(); }}>›</button>
        </div>
      )}
    </section>
  );
}
