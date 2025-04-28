import React from 'react';

export default function Timeline({ events }) {
  return (
    <div className="timeline">
      {events.map((ev, idx) => (
        <div className="timeline-item" key={idx}>
          <div className="timeline-point" />
          <div className="timeline-content">
            <div className="timeline-date">{ev.date}</div>
            <h4 className="timeline-title">{ev.title}</h4>
            <p className="timeline-description">{ev.description}</p>
          </div>
        </div>
      ))}
    </div>
  );
}