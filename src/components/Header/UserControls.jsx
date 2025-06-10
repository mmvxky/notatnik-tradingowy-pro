import React from 'react';
import CustomSelect from './CustomSelect'; // Importujemy nowy komponent

function UserControls({ theme, currency, onThemeChange, onCurrencyChange, user }) {
  const currencyOptions = [
    { value: 'USD', label: 'USD' },
    { value: 'EUR', label: 'EUR' },
    { value: 'PLN', label: 'PLN' },
  ];

  return (
    <div className="user-controls">
      <label className="theme-slider" htmlFor="theme-slider-checkbox" title="Zmień motyw">
        <input 
          type="checkbox" 
          id="theme-slider-checkbox" 
          onChange={onThemeChange}
          checked={theme === 'light'}
        />
        <div className="slider-track">
          <span className="slider-icon sun">☀️</span>
          <span className="slider-icon moon">🌙</span>
          <span className="slider-thumb"></span>
        </div>
      </label>
      
      {/* Używamy naszego nowego komponentu zamiast <select> */}
      <CustomSelect
        options={currencyOptions}
        value={currency}
        onChange={onCurrencyChange}
      />

      <div className="profile-area">
        <div id="profile-button" className="profile-button">
          <img id="profile-pic" src={user?.profilePic || 'https://i.pravatar.cc/150'} alt="User"/>
          <span id="profile-name">{user?.name || '...'}</span>
        </div>
        {/* Logikę menu profilu dodamy później */}
      </div>
    </div>
  );
}

export default UserControls;