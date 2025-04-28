import React from 'react';

export default function AchievementBadge({ label, icon }) {
  return (
    <div className="achievement-badge">
      <span className="badge-icon">{icon || '🏅'}</span>
      <span className="badge-label">{label}</span>
    </div>
  );
}