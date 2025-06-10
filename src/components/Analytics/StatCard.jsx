import React from 'react';

function StatCard({ label, value, className = '' }) {
  return (
    <div className="stat-card">
      <div className="label">{label}</div>
      <div className={`value ${className}`}>{value}</div>
    </div>
  );
}

export default StatCard;