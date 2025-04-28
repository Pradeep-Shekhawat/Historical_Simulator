import React from 'react';

export default function ResourcePanel({ resources }) {
  return (
    <div className="resource-panel">
      {['treasury','military','stability'].map(key => (
        <div className="resource-item" key={key}>
          <div className="resource-header">
            <span className="resource-label">{key.charAt(0).toUpperCase()+key.slice(1)}</span>
            <span className="resource-value">{resources[key]}</span>
          </div>
          <div className={`resource-bar resource-${key}`}>
            <span style={{ width: `${resources[key]}%` }} />
          </div>
        </div>
      ))}
    </div>
  );
}