"use client";

import { useState } from "react";

type Size = "sm" | "md" | "lg";

const SIZE_PX: Record<Size, number> = { sm: 12, md: 16, lg: 24 };

interface ReadOnlyProps {
  value: number;
  readOnly: true;
  size?: Size;
}

interface EditableProps {
  value: number;
  onChange: (v: number) => void;
  readOnly?: false;
  size?: Size;
}

type Props = ReadOnlyProps | EditableProps;

function StarIcon({ filled, size }: { filled: boolean; size: number }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 16 16"
      fill={filled ? "currentColor" : "none"}
      stroke="currentColor"
      strokeWidth="1.5"
      aria-hidden
    >
      <path d="M8 1.5l1.8 3.6 4 .6-2.9 2.8.7 4L8 10.4 4.4 12.5l.7-4L2.2 5.7l4-.6L8 1.5z" />
    </svg>
  );
}

export function StarRating(props: Props) {
  const { value, readOnly = false, size = "md" } = props;
  const px = SIZE_PX[size];
  const [hovered, setHovered] = useState(0);

  if (readOnly) {
    const full = Math.floor(value);
    const half = value - full >= 0.5;
    return (
      <span className="inline-flex items-center text-terra">
        {Array.from({ length: 5 }, (_, i) => (
          <StarIcon key={i} filled={i < full || (i === full && half)} size={px} />
        ))}
      </span>
    );
  }

  const display = hovered || value;
  return (
    <span
      className="inline-flex items-center text-terra"
      onMouseLeave={() => setHovered(0)}
    >
      {Array.from({ length: 5 }, (_, i) => (
        <button
          key={i}
          type="button"
          onMouseEnter={() => setHovered(i + 1)}
          onClick={() => (props as EditableProps).onChange(i + 1)}
          className="focus:outline-none"
          aria-label={`${i + 1} estrelas`}
        >
          <StarIcon filled={i < display} size={px} />
        </button>
      ))}
    </span>
  );
}
