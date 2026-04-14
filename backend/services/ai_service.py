import math

def calculate_predictive_score(historical_prices: list[float]) -> dict:
    if not historical_prices or len(historical_prices) < 5:
        # Not enough data
        return {"aiScore": 50, "recommendation": "manter"}

    current_price = historical_prices[-1]
    
    # Calculate moving average
    mean_price = sum(historical_prices) / len(historical_prices)
    
    # Calculate standard deviation (volatility)
    variance = sum((x - mean_price) ** 2 for x in historical_prices) / len(historical_prices)
    std_dev = math.sqrt(variance)
    
    # Calculate Z-Score (how far is the current price from the mean)
    # A negative Z-Score means the price is below the mean (historically cheap / discounted)
    # A positive Z-Score means the price is above the mean (expensive)
    z_score = (current_price - mean_price) / std_dev if std_dev > 0 else 0
    
    # Base score is 50.
    # If Z-Score is highly negative (-2.0), the asset is heavily oversold -> high score -> "compra"
    # If Z-Score is highly positive (+2.0), the asset is heavily overbought -> low score -> "venda"
    
    # Map Z-score from [-3.0, +3.0] to an AI score from roughly [0 to 100]
    # We invert it: negative Z -> higher score
    ai_score_raw = 50 + (z_score * -20)
    
    # Let's add momentum (short term vs long term)
    short_term_mean = sum(historical_prices[-5:]) / min(5, len(historical_prices))
    momentum_bonus = (short_term_mean - current_price) / current_price * 100
    
    ai_score = int(max(10, min(99, ai_score_raw + momentum_bonus)))
    
    # Recommendation bands
    if ai_score >= 70:
        recommendation = "compra"
    elif ai_score <= 40:
        recommendation = "venda"
    else:
        recommendation = "manter"
        
    return {
        "aiScore": ai_score,
        "recommendation": recommendation
    }
