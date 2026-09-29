"use client";

import { GALLERY_SECTIONS } from "../_data/galleryData";

interface GalleryFiltersProps {
  activeFilter: string;
  onSelect: (sectionId: string) => void;
}

const extraFilters = [
  { id: "ecell-team", label: "ECell Team" },
  { id: "team-photo", label: "Team Photo" },
];

export default function GalleryFilters({ activeFilter, onSelect }: GalleryFiltersProps) {
  const filters = [
    { id: "all", label: "All" },
    extraFilters[0],
    ...GALLERY_SECTIONS.map(({ id, title }) => ({ id, label: title })),
    extraFilters[1],
  ];

  return (
    <nav className="gallery-filters" aria-label="Gallery Categories">
      <div className="gallery-filters__inner">
        {filters.map(({ id, label }) => (
          <button
            key={id}
            type="button"
            className={`gallery-filter-btn ${activeFilter === id ? "is-active" : ""}`}
            onClick={() => onSelect(id)}
          >
            {label}
          </button>
        ))}
      </div>
    </nav>
  );
}
