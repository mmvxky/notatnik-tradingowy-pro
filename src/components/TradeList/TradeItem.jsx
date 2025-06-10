import React, { useState } from 'react';

// --- FUNKCJE POMOCNICZE WKLEJONE BEZPOŚREDNIO TUTAJ ---
const calculateRoe = (entry, exit, type, leverage) => {
    if (!entry || !exit || !leverage || parseFloat(entry) === 0) return 0;
    const pEntry = parseFloat(entry), pExit = parseFloat(exit), pLeverage = parseFloat(leverage);
    return (type === 'Long' ? ((pExit - pEntry) / pEntry) * pLeverage : ((pEntry - pExit) / pEntry) * pLeverage) * 100;
};
const convertCurrency = (amountInUsd, toCurrency, exchangeRates) => {
    if (toCurrency === 'USD' || !exchangeRates || !exchangeRates[toCurrency]) return amountInUsd;
    return amountInUsd * exchangeRates[toCurrency];
};
const getPriceFromExchange = async (instrument, exchange) => {
    try {
        const url = `https://api.binance.com/api/v3/ticker/price?symbol=${instrument}`;
        const response = await fetch(url);
        if (!response.ok) return null;
        const data = await response.json();
        return data.price;
    } catch (error) {
        console.error(`Błąd pobierania ceny z ${exchange} dla ${instrument}:`, error);
        return null;
    }
};
// --- KONIEC FUNKCJI POMOCNICZYCH ---

function TradeItem({ trade, onDelete, onUpdate, livePriceData, currency, exchangeRates }) {
  const [showConfirm, setShowConfirm] = useState(false);
  const [exitPrice, setExitPrice] = useState('');
  const [instrument, exchange] = (trade.fullInstrument || 'B/D - B/D').split(' - ');
  const isClosed = trade.exit && trade.exit !== '';
  let pnlConverted, roeCellHtml;

  if (isClosed) {
    const roe = calculateRoe(trade.entry, trade.exit, trade.type, trade.leverage);
    const pnlUsd = (roe / 100) * parseFloat(trade.investedAmount || 0);
    pnlConverted = convertCurrency(pnlUsd, currency, exchangeRates);
    const roeClass = roe >= 0 ? 'profit' : 'loss';
    roeCellHtml = <span className={roeClass}>{roe.toFixed(2)}%</span>;
  } else {
    const currentPrice = livePriceData.get(instrument);
    if (currentPrice) {
      const liveRoe = calculateRoe(trade.entry, currentPrice, trade.type, trade.leverage);
      const liveRoeClass = liveRoe >= 0 ? 'profit' : 'loss';
      roeCellHtml = <span className="open">Otwarta (<span className={liveRoeClass}>{liveRoe.toFixed(2)}%</span>)</span>;
    } else { roeCellHtml = <span className="open">Otwarta (...)</span>; }
  }
  
  const handleDeleteClick = (e) => { e.stopPropagation(); setShowConfirm(true); };
  const handleConfirmDelete = (e) => { e.stopPropagation(); onDelete(trade.id); };
  const handleCancelDelete = (e) => { e.stopPropagation(); setShowConfirm(false); };
  const handleCloseTrade = (e) => { e.preventDefault(); if (exitPrice > 0) { onUpdate(trade.id, { exit: exitPrice }); } };
  const handleFetchMarketPrice = async () => { const price = await getPriceFromExchange(instrument, exchange); if(price) setExitPrice(price); };

  return (
    <tr>
      <td><b>{instrument || 'Brak'}</b><br/><span className="exchange-tag">{exchange || 'danych'}</span></td>
      <td>{trade.date ? new Date(trade.date).toLocaleString('pl-PL') : 'Brak daty'}</td>
      <td>{trade.type}</td>
      <td>{trade.entry}</td>
      <td>
        {isClosed ? trade.exit : (
            <form className="edit-exit-form" onSubmit={handleCloseTrade}>
                <input type="number" step="any" placeholder="Cena..." className="glass-input edit-exit-input" value={exitPrice} onChange={(e) => setExitPrice(e.target.value)} required />
                <div className="button-group">
                    <button type="button" className="btn-icon btn-market-price-exit" title="Użyj ceny rynkowej" onClick={handleFetchMarketPrice}>⚡️</button>
                    <button type="submit" className="btn-icon save-exit-btn" title="Zapisz">✔️</button>
                </div>
            </form>
        )}
      </td>
      <td>{roeCellHtml}</td>
      <td className={isClosed ? (pnlConverted >= 0 ? 'profit' : 'loss') : ''}>{isClosed ? pnlConverted.toFixed(2) : '---'}</td>
      <td className="action-cell">
        <button onClick={handleDeleteClick} className="delete-btn" title="Usuń transakcję">🗑️</button>
        {showConfirm && (
          <div className="confirm-popover"><p>Na pewno?</p><div className="popover-buttons"><button onClick={handleConfirmDelete} className="popover-btn confirm">Tak</button><button onClick={handleCancelDelete} className="popover-btn cancel">Nie</button></div></div>
        )}
      </td>
    </tr>
  );
}
export default TradeItem;