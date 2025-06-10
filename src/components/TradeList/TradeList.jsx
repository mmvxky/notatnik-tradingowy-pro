import React from 'react';
import TradeItem from './TradeItem';

function TradeList({ trades, onDeleteTrade, onUpdateTrade, livePriceData, currency, exchangeRates }) {
  return (
    <table>
      <thead>
        <tr>
          <th>Instrument</th><th>Data</th><th>Rodzaj</th><th>Wejście</th><th>Wyjście</th>
          <th>ROE (%)</th><th id="pnl-fiat-header">P/L ({currency})</th><th>Akcja</th>
        </tr>
      </thead>
      <tbody>
        {trades.length === 0 ? (
          <tr><td colSpan="8" style={{ textAlign: 'center' }}>Brak transakcji do wyświetlenia.</td></tr>
        ) : (
          trades.map(trade => 
            <TradeItem 
              key={trade.id} 
              trade={trade} 
              onDelete={onDeleteTrade}
              onUpdate={onUpdateTrade} // Przekazujemy funkcję
              livePriceData={livePriceData}
              currency={currency}
              exchangeRates={exchangeRates}
            />
          )
        )}
      </tbody>
    </table>
  );
}

export default TradeList;