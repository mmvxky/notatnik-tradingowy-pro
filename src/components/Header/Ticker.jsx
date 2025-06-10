import React from 'react';
import TickerItem from './TickerItem'; // Importujemy nowy komponent

function Ticker({ tickerData }) {
  return (
    <div className="price-ticker">
      {tickerData.map(ticker => (
        // Dla każdego obiektu w `tickerData` renderujemy osobny komponent TickerItem
        <TickerItem key={ticker.symbol} ticker={ticker} />
      ))}
    </div>
  );
}

export default Ticker;