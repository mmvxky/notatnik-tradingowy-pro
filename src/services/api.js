// Ta funkcja zostaje do obsługi przycisków "Użyj ceny rynkowej"
export async function getPriceFromExchange(instrument, exchange) {
    try {
        const instrumentClean = instrument.trim();
        const exchangeClean = (exchange || 'Binance').trim();
        let url;

        // Upraszczamy do jednego, niezawodnego źródła (Binance) dla tej funkcji
        url = `https://api.binance.com/api/v3/ticker/price?symbol=${instrumentClean}`;
        
        const response = await fetch(url);
        if (!response.ok) return null;
        const data = await response.json();
        return data.price;

    } catch (error) {
        console.error(`Błąd pobierania ceny z ${exchange} dla ${instrument}:`, error);
        return null;
    }
}

export async function fetchExchangeRates() {
    try {
        const response = await fetch('https://api.frankfurter.app/latest?from=USD');
        const data = await response.json();
        return data.rates;
    } catch (error) {
        console.error("Failed to fetch exchange rates:", error);
        return null;
    }
}

// NOWA-STARA, POPRAWIONA FUNKCJA DO OBSŁUGI POŁĄCZENIA WEBSOCKET
export function setupPriceWebSocket(onPriceUpdate) {
    const socket = new WebSocket('wss://stream.binance.com:9443/ws/!miniTicker@arr');

    socket.onmessage = (event) => {
        try {
            const tickers = JSON.parse(event.data);
            // Przekazujemy wszystkie otrzymane dane do funkcji zwrotnej w komponencie App
            onPriceUpdate(tickers);
        } catch (error) {
            console.error("Błąd parsowania danych z WebSocket:", error);
        }
    };

    socket.onerror = (error) => {
        console.error("Błąd WebSocket:", error);
    };

    socket.onopen = () => {
        console.log("Połączenie WebSocket nawiązane.");
    };

    socket.onclose = () => {
        console.log("Połączenie WebSocket zamknięte.");
    };
    
    // Zwracamy funkcję `cleanup`, którą można wywołać, aby zamknąć połączenie
    return () => {
        if (socket.readyState === 1) { // Sprawdź, czy połączenie jest otwarte przed zamknięciem
            socket.close();
        }
    };
}