import { gsap } from "gsap";
import { useCallback, useEffect, useRef, useState } from "react";
import "./Gallery.css";

// If images are in `src/images`, import them:
import pic1 from "../images/pic1.jpg";
import pic2 from "../images/pic2.jpg";
import pic3 from "../images/pic3.jpg";
import pic4 from "../images/pic4.jpg";
import pic5 from "../images/pic5.jpg";
import pic6 from "../images/pic6.jpg";

function Gallery({ isActive }) {
  const [lightboxOpen, setLightboxOpen] = useState(false);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [photosRevealed, setPhotosRevealed] = useState(false);

  const photosRef = useRef([]);
  const lightboxImgRef = useRef(null);

  // Use this array for images in `src/images` (imported)
  const photos = [
    { src: pic1, alt: "Memory 1" },
    { src: pic2, alt: "Memory 2" },
    { src: pic3, alt: "Memory 3" },
    { src: pic4, alt: "Memory 4" },
    { src: pic5, alt: "Memory 5" },
    { src: pic6, alt: "Memory 6" },
  ];

  // If you prefer images in `public/images`, comment out the above array and use:
  /*
  const photos = [
    { src: "/images/pic1.jpg", alt: "Memory 1" },
    { src: "/images/pic2.jpg", alt: "Memory 2" },
    { src: "/images/pic3.jpg", alt: "Memory 3" },
    { src: "/images/pic4.jpg", alt: "Memory 4" },
    { src: "/images/pic5.jpg", alt: "Memory 5" },
    { src: "/images/pic6.jpg", alt: "Memory 6" },
  ];
  */

  // Reveal photos with GSAP when page becomes active
  useEffect(() => {
    if (isActive && !photosRevealed) {
      setTimeout(() => setPhotosRevealed(true), 10);

      gsap.fromTo(
        photosRef.current,
        { opacity: 0, y: 50, scale: 0.8 },
        {
          opacity: 1,
          y: 0,
          scale: 1,
          duration: 0.6,
          stagger: 0.12,
          ease: "back.out(1.4)",
          delay: 0.2,
        }
      );
    }
  }, [isActive, photosRevealed]);

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

  const closeLightbox = useCallback(() => {
    setLightboxOpen(false);
  }, []);

  useEffect(() => {
    document.body.style.overflow = lightboxOpen ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [lightboxOpen]);

  const showNext = useCallback(() => {
    const newIndex = (currentIndex + 1) % photos.length;

    if (lightboxImgRef.current) {
      gsap.to(lightboxImgRef.current, {
        x: -100,
        opacity: 0,
        duration: 0.2,
        ease: "power2.in",
        onComplete: () => {
          setCurrentIndex(newIndex);
          gsap.fromTo(
            lightboxImgRef.current,
            { x: 100, opacity: 0 },
            { x: 0, opacity: 1, duration: 0.3, ease: "power2.out" }
          );
        },
      });
    }
  }, [currentIndex, photos.length]);

  const showPrev = useCallback(() => {
    const newIndex = (currentIndex - 1 + photos.length) % photos.length;

    if (lightboxImgRef.current) {
      gsap.to(lightboxImgRef.current, {
        x: 100,
        opacity: 0,
        duration: 0.2,
        ease: "power2.in",
        onComplete: () => {
          setCurrentIndex(newIndex);
          gsap.fromTo(
            lightboxImgRef.current,
            { x: -100, opacity: 0 },
            { x: 0, opacity: 1, duration: 0.3, ease: "power2.out" }
          );
        },
      });
    }
  }, [currentIndex, photos.length]);

  useEffect(() => {
    const handleKeyDown = (e) => {
      if (!lightboxOpen) return;
      if (e.key === "Escape") closeLightbox();
      else if (e.key === "ArrowLeft") showPrev();
      else if (e.key === "ArrowRight") showNext();
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [lightboxOpen, showNext, showPrev, closeLightbox]);

  return (
    <section className="gallery">
      <h2>📸 Our Beautiful Memories</h2>
      <div className="photos">
        {photos.map((photo, index) => (
          <img
            key={index}
            ref={(el) => (photosRef.current[index] = el)}
            src={photo.src}
            alt={photo.alt}
            onClick={() => openLightbox(index)}
            loading="lazy"
          />
        ))}
      </div>

      {lightboxOpen && (
        <div className="lightbox" onClick={closeLightbox}>
          <img
            ref={lightboxImgRef}
            src={photos[currentIndex].src}
            alt={photos[currentIndex].alt}
            onClick={(e) => e.stopPropagation()}
          />
          <button
            className="lightbox-close"
            onClick={closeLightbox}
            aria-label="Close lightbox"
          >
            ✖
          </button>
          <button
            className="nav-btn nav-prev"
            onClick={(e) => {
              e.stopPropagation();
              showPrev();
            }}
            aria-label="Previous photo"
          >
            ‹
          </button>
          <button
            className="nav-btn nav-next"
            onClick={(e) => {
              e.stopPropagation();
              showNext();
            }}
            aria-label="Next photo"
          >
            ›
          </button>
        </div>
      )}
    </section>
  );
}

export default Gallery;
