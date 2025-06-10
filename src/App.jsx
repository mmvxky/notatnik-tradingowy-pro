import React, { useState, useEffect } from 'react';
import './App.css'
import TradeForm from './components/TradeForm/TradeForm.jsx';
import TradeList from './components/TradeList/TradeList.jsx';
import Analytics from './components/Analytics/Analytics.jsx';
import Header from './components/Header/Header.jsx';
import { fetchExchangeRates, setupPriceWebSocket } from './services/api.js';

const TICKER_PAIRS = ['BTCUSDT', 'ETHUSDT', 'SOLUSDT', 'XRPUSDT', 'DOGEUSDT', 'ADAUSDT', 'AVAXUSDT', 'LINKUSDT', 'DOTUSDT', 'BNBUSDT', 'LTCUSDT'];

function App() {
  const [trades, setTrades] = useState(() => {
    try {
      const savedTrades = localStorage.getItem('react-trading-journal-trades');
      return savedTrades ? JSON.parse(savedTrades) : [];
    } catch { return []; }
  });

  const [theme, setTheme] = useState('dark');
  const [currency, setCurrency] = useState('USD');
  const [user, setUser] = useState({ name: 'Anabol', profilePic: 'https://i.pravatar.cc/150' });
  
  const [tickerData, setTickerData] = useState(() => TICKER_PAIRS.map(symbol => ({ symbol, price: '...' })));
  const [livePriceData, setLivePriceData] = useState(new Map());
  const [exchangeRates, setExchangeRates] = useState(null);

  useEffect(() => {
    localStorage.setItem('react-trading-journal-trades', JSON.stringify(trades));
  }, [trades]);

  useEffect(() => {
    document.body.className = theme === 'light' ? 'light-mode' : '';
  }, [theme]);

  useEffect(() => {
    fetchExchangeRates().then(rates => {
      if (rates) setExchangeRates({ ...rates, USD: 1 });
    });
    
    const handlePriceUpdate = (tickers) => {
        const priceUpdateMap = new Map(tickers.map(t => [t.s, parseFloat(t.c)]));
        setLivePriceData(prevPrices => {
            const newPrices = new Map(prevPrices);
            priceUpdateMap.forEach((price, symbol) => { newPrices.set(symbol, price); });
            return newPrices;
        });
        setTickerData(prevTickerData => {
            return prevTickerData.map(oldTickerItem => {
                if (priceUpdateMap.has(oldTickerItem.symbol)) {
                    const newPrice = priceUpdateMap.get(oldTickerItem.symbol);
                    const oldPrice = typeof oldTickerItem.price === 'number' ? oldTickerItem.price : 0;
                    let changeDirection = null;
                    if (oldPrice !== 0) {
                        if (newPrice > oldPrice) changeDirection = 'up';
                        else if (newPrice < oldPrice) changeDirection = 'down';
                    }
                    return { ...oldTickerItem, price: newPrice, changeDirection: changeDirection };
                }
                return { ...oldTickerItem, changeDirection: null };
            });
        });
    };

    const cleanupWebSocket = setupPriceWebSocket(handlePriceUpdate);
    return () => cleanupWebSocket();
  }, []); 

  const handleAddTrade = (newTrade) => { setTrades(prevTrades => [...prevTrades, newTrade]); };
  const handleDeleteTrade = (tradeId) => { setTrades(prevTrades => prevTrades.filter(trade => trade.id !== tradeId)); };
  const handleUpdateTrade = (tradeId, updatedData) => { setTrades(prevTrades => prevTrades.map(trade => trade.id === tradeId ? { ...trade, ...updatedData } : trade)); };
  const handleThemeChange = () => { setTheme(currentTheme => (currentTheme === 'dark' ? 'light' : 'dark')); };
  const handleCurrencyChange = (newCurrency) => { setCurrency(newCurrency); };

  return (
    <>
      <div className="background-effects"></div>
      <div className="app-container">
        <Header 
          tickerData={tickerData}
          theme={theme}
          currency={currency}
          onThemeChange={handleThemeChange}
          onCurrencyChange={handleCurrencyChange}
          user={user}
        />
        <div className="form-column">
          <div className="panel">
            <h2>Dodaj transakcję</h2>
            <TradeForm onAddTrade={handleAddTrade} />
          </div>
        </div>
        <div className="data-column">
          <div className="panel">
            <h2>Analiza i Statystyki</h2>
            <Analytics trades={trades} currency={currency} exchangeRates={exchangeRates} />
          </div>
          <div className="panel trades-history-panel">
            <h2>Historia transakcji</h2>
            <TradeList 
              trades={trades} 
              onDeleteTrade={handleDeleteTrade}
              onUpdateTrade={handleUpdateTrade}
              livePriceData={livePriceData}
              currency={currency} 
              exchangeRates={exchangeRates} 
            />
          </div>
        </div>
      </div>
    </>
  )
}
export default App;