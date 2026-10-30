import React from 'react';

const photos = [
  {
    label: 'Our venue',
    alt: 'Wedding venue',
    src: '/venue.png',
    className: 'lg:col-span-2 lg:row-span-2',
    imageClassName: 'object-contain',
  },
  {
    label: 'A moment together',
    alt: 'Neh and Fenny',
    src: '/couple-photo-second.png',
    className: '',
    imageClassName: 'object-cover',
  },
  {
    label: 'Engagement',
    alt: 'Engagement',
    src: '/couple-photo.png',
    className: '',
    imageClassName: 'object-cover',
  },
];

export const PhotoGallerySection: React.FC = () => (
  <section
    aria-labelledby="photo-gallery-title"
    className="bg-[#FFFDF7] px-4 py-16 sm:px-6 sm:py-20 lg:px-8"
  >
    <div className="mx-auto max-w-7xl">
      <div className="mb-8 text-center sm:mb-10">
        <p className="mb-2 text-[10px] font-bold uppercase tracking-[0.25em] text-[#A52A3A]">
          A little preview
        </p>
        <h2
          id="photo-gallery-title"
          className="font-serif-display text-4xl font-bold tracking-tight text-[#493A36] sm:text-5xl"
        >
          The celebration
        </h2>
      </div>

      <div className="grid gap-4 lg:min-h-[40rem] lg:grid-cols-3 lg:grid-rows-2">
        {photos.map((photo) => (
          <figure
            key={photo.label}
            className={`group relative min-h-64 overflow-hidden rounded-2xl bg-[#A52A3A] shadow-sm sm:min-h-80 lg:min-h-0 ${photo.className}`}
          >
            <img
              src={photo.src}
              alt={photo.alt}
              loading="lazy"
              className={`absolute inset-0 h-full w-full transition-transform duration-700 group-hover:scale-[1.03] ${photo.imageClassName}`}
            />
            <figcaption className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/60 to-transparent px-5 pb-5 pt-12 text-sm font-semibold text-white">
              {photo.label}
            </figcaption>
          </figure>
        ))}
      </div>
    </div>
  </section>
);
