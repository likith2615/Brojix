import React from 'react';

// Minimal ambient background — one restrained gradient layer, not multiple neons.
// Handled mostly in CSS (.ambient-bg), this component exists for future canvas work.
export default function GlobalBackground() {
  return (
    <div className="ambient-bg" aria-hidden="true" role="presentation" />
  );
}
