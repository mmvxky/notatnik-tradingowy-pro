import React, { useState, useEffect, useRef } from 'react';

// Funkcje i dane wklejone bezpośrednio do pliku
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

const setMaxDate = (dateInputElement) => {
    const now = new Date();
    now.setMinutes(now.getMinutes() - now.getTimezoneOffset() + 2);
    if(dateInputElement) dateInputElement.max = now.toISOString().slice(0, 16);
};

const exchanges = ['Binance', 'Bybit', 'KuCoin', 'OKX', 'Gate.io', 'MEXC', 'Bitget'];
const popularInstruments = ['BTCUSDT', 'ETHUSDT', 'SOLUSDT', 'XRPUSDT', 'DOGEUSDT', 'ADAUSDT'];
const fullInstrumentList = popularInstruments.flatMap(instrument => exchanges.map(exchange => `${instrument} - ${exchange}`));

function TradeForm({ onAddTrade }) {
  const [fullInstrument, setFullInstrument] = useState('');
  const [date, setDate] = useState('');
  const [type, setType] = useState('Long');
  const [entry, setEntry] = useState('');
  const [investedAmount, setInvestedAmount] = useState('');
  const [leverage, setLeverage] = useState('1');
  const [exit, setExit] = useState('');
  const [notes, setNotes] = useState('');
  const [suggestions, setSuggestions] = useState([]);
  const [isSuggestionsVisible, setIsSuggestionsVisible] = useState(false);
  const formRef = useRef(null);
  const dateInputRef = useRef(null);

  useEffect(() => { setMaxDate(dateInputRef.current); }, []);

  useEffect(() => {
    function handleClickOutside(event) {
      if (formRef.current && !formRef.current.contains(event.target)) setIsSuggestionsVisible(false);
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [formRef]);

  const handleInstrumentChange = (e) => {
    const value = e.target.value;
    setFullInstrument(value);
    if (value) {
      const filtered = fullInstrumentList.filter(item => item.toLowerCase().includes(value.toLowerCase()));
      setSuggestions(filtered.slice(0, 10));
      setIsSuggestionsVisible(true);
    } else {
      setIsSuggestionsVisible(false);
    }
  };

  const handleSuggestionClick = (suggestion) => { setFullInstrument(suggestion); setIsSuggestionsVisible(false); };
  
  const handleFetchPriceClick = async () => {
    const [instrument, exchange] = fullInstrument.split(' - ');
    if (instrument && exchange) {
        const price = await getPriceFromExchange(instrument.trim(), exchange.trim());
        if (price) setEntry(price);
        else alert('Nie udało się pobrać ceny dla tej pary/giełdy.');
    }
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    onAddTrade({ id: Date.now(), fullInstrument, date, type, entry, investedAmount, leverage, exit, notes });
    setFullInstrument(''); setDate(''); setType('Long'); setEntry(''); 
    setInvestedAmount(''); setLeverage('1'); setExit(''); setNotes('');
  };

  return (
    <form id="trade-form" ref={formRef} onSubmit={handleSubmit}>
      <div className="form-group">
        <label htmlFor="instrument">Instrument i Giełda</label>
        <input type="text" id="instrument" className="glass-input" required autoComplete="off" value={fullInstrument} onChange={handleInstrumentChange} onFocus={() => fullInstrument && setIsSuggestionsVisible(true)} />
        {isSuggestionsVisible && suggestions.length > 0 && ( <div className="suggestions-list"> {suggestions.map(s => (<div key={s} className="suggestion-item" onClick={() => handleSuggestionClick(s)}>{s}</div>))} </div> )}
      </div>
      <div className="form-group">
        <label htmlFor="date">Data Wejścia</label>
        <input ref={dateInputRef} value={date} onChange={(e) => setDate(e.target.value)} type="datetime-local" id="date" className="glass-input" required />
      </div>
      <div className="form-group">
        <label htmlFor="type">Rodzaj (Long/Short)</label>
        <select value={type} onChange={(e) => setType(e.target.value)} id="type" className="glass-input" required>
          <option value="Long">Long</option><option value="Short">Short</option>
        </select>
      </div>
      <div className="form-group">
        <div className="label-with-action">
          <label htmlFor="entry">Cena wejścia</label>
          {fullInstrument.includes(' - ') && <button type="button" className="btn-link" onClick={handleFetchPriceClick} style={{display: 'inline'}}>Użyj ceny rynkowej</button>}
        </div>
        <input value={entry} onChange={(e) => setEntry(e.target.value)} type="number" step="any" id="entry" className="glass-input" required />
      </div>
      <div className="form-group">
        <label htmlFor="investedAmount">Zainwestowana kwota (w USDT)</label>
        <input value={investedAmount} onChange={(e) => setInvestedAmount(e.target.value)} type="number" step="any" id="investedAmount" className="glass-input" required />
      </div>
      <div className="form-group">
        <label htmlFor="leverage">Dźwignia (np. 10x)</label>
        <input value={leverage} onChange={(e) => setLeverage(e.target.value)} type="number" step="any" id="leverage" className="glass-input" required />
      </div>
      <div className="form-group">
        <label htmlFor="exit">Cena wyjścia (zostaw puste)</label>
        <input value={exit} onChange={(e) => setExit(e.target.value)} type="number" step="any" id="exit" className="glass-input" />
      </div>
      <div className="form-group">
        <label htmlFor="notes">Notatki / Analiza</label>
        <textarea value={notes} onChange={(e) => setNotes(e.target.value)} id="notes" className="glass-input"></textarea>
      </div>
      <button type="submit" className="btn btn-primary">Dodaj transakcję</button>
    </form>
  );
}
export default TradeForm;