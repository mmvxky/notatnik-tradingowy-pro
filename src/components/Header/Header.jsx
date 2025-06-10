import React from 'react';
import Ticker from './Ticker';
import UserControls from './UserControls';

function Header(props) {
    return (
        <header className="header-bar">
            <Ticker tickerData={props.tickerData} />
            <UserControls 
                theme={props.theme}
                currency={props.currency}
                onThemeChange={props.onThemeChange}
                onCurrencyChange={props.onCurrencyChange}
                user={props.user}
            />
        </header>
    );
}

export default Header;