import React from 'react';

function TickerItem({ ticker }) {
  return (
    <div className="ticker-item">
      <span className="symbol">{ticker.symbol.replace('USDT', '')}</span>
      <span className="price">
        {typeof ticker.price === 'number'
          ? `$${ticker.price.toLocaleString(undefined, { 
              minimumFractionDigits: 2, 
              maximumFractionDigits: 2 
            })}`
          : '...'
        }
      </span>
    </div>
  );
}

export default TickerItem;