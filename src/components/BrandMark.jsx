import React from 'react';

export default function BrandMark({ className = '' }) {
  return (
    <img
      src={`${process.env.PUBLIC_URL}/examprepp-mark.svg`}
      alt=""
      aria-hidden="true"
      className={className}
    />
  );
}
