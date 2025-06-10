import React from 'react';
import StatCard from './StatCard.jsx';

// Funkcje pomocnicze są teraz tutaj, lokalnie
const calculateRoe = (entry, exit, type, leverage) => {
    if (!entry || !exit || !leverage || parseFloat(entry) === 0) return 0;
    const pEntry = parseFloat(entry), pExit = parseFloat(exit), pLeverage = parseFloat(leverage);
    return (type === 'Long' ? ((pExit - pEntry) / pEntry) * pLeverage : ((pEntry - pExit) / pEntry) * pLeverage) * 100;
};
const convertCurrency = (amountInUsd, toCurrency, exchangeRates) => {
    if (toCurrency === 'USD' || !exchangeRates || !exchangeRates[toCurrency]) return amountInUsd;
    return amountInUsd * exchangeRates[toCurrency];
};

function Analytics({ trades, currency, exchangeRates }) {
  const closedTrades = trades.filter(t => t.exit && t.exit !== '');
  if (closedTrades.length === 0) {
    return (
      <div className="analytics-grid">
        <StatCard label="Zamknięte" value="--" /><StatCard label="Zyskowne" value="--" /><StatCard label="Stratne" value="--" /><StatCard label="Skuteczność" value="--%" /><StatCard label={`Łączny P/L (${currency})`} value="--.--" />
      </div>
    );
  }
  let winningTrades = 0, losingTrades = 0, totalPnlUsd = 0;
  closedTrades.forEach(t => {
      const roe = calculateRoe(t.entry, t.exit, t.type, t.leverage);
      if (roe > 0) winningTrades++; else if (roe < 0) losingTrades++;
      totalPnlUsd += (roe / 100) * parseFloat(t.investedAmount || 0);
  });
  const winRate = closedTrades.length > 0 ? (winningTrades / closedTrades.length * 100) : 0;
  const totalPnlConverted = convertCurrency(totalPnlUsd, currency, exchangeRates);
  return (
    <div className="analytics-grid">
      <StatCard label="Zamknięte" value={closedTrades.length} /><StatCard label="Zyskowne" value={winningTrades} className="profit" /><StatCard label="Stratne" value={losingTrades} className="loss" /><StatCard label="Skuteczność" value={`${winRate.toFixed(1)}%`} /><StatCard label={`Łączny P/L (${currency})`} value={totalPnlConverted.toFixed(2)} className={totalPnlConverted >= 0 ? 'profit' : 'loss'} />
    </div>
  );
}
export default Analytics;