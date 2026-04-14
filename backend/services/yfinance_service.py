import yfinance as yf
from cachetools import cached, TTLCache

cache = TTLCache(maxsize=100, ttl=900)  # 15 minutes cache

@cached(cache)
def fetch_ticker_data(ticker_symbol: str):
    if not ticker_symbol or "-" in ticker_symbol or ticker_symbol.startswith("PREV"):
        # Skipping yfinance for mock specific FIIS or fake previdencia funds
        # and returning dummy data that the frontend usually handles.
        return None
    
    try:
        if ticker_symbol.endswith("11") or len(ticker_symbol) in [5, 6]:
            query_symbol = f"{ticker_symbol}.SA"
        else:
            query_symbol = ticker_symbol
            
        ticker = yf.Ticker(query_symbol)
        history = ticker.history(period="60d")
        
        if history.empty:
            return None
            
        current_price = history['Close'].iloc[-1]
        previous_price = history['Close'].iloc[-2] if len(history) > 1 else current_price
        
        info = ticker.info
        
        return {
            "price": current_price,
            "previousPrice": previous_price,
            "volume": int(history['Volume'].iloc[-1]) if 'Volume' in history else 0,
            "dividendYield": info.get("dividendYield", 0) * 100 if info.get("dividendYield") else 0,
            "pe": info.get("trailingPE", 0),
            "history_60d": history['Close'].tolist()
        }
    except Exception as e:
        print(f"Error fetching data for {ticker_symbol}: {e}")
        return None

