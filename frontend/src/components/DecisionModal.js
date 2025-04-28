import React from 'react';

export default function DecisionModal({ options, onSelect }) {
  return (
    <div className="decision-modal">
      {options.map(o => (
        <button
          key={o.id}
          className="decision-btn"
          onClick={() => onSelect(o)}
        >
          <div className="decision-btn-title">{o.text}</div>
          <div className="decision-btn-description">
            {`(Treasury ${o.impacts.treasury >= 0 ? '+' : ''}${o.impacts.treasury}, Military ${o.impacts.military >= 0 ? '+' : ''}${o.impacts.military}, Stability ${o.impacts.stability >= 0 ? '+' : ''}${o.impacts.stability})`}
          </div>
        </button>
      ))}
    </div>
  );
}