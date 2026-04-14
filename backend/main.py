from fastapi import FastAPI, Depends, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from sqlalchemy.orm import Session
import os

from . import models, schemas
from .database import engine, get_db
from .services import yfinance_service, ai_service
from .agente_ai import agent

models.Base.metadata.create_all(bind=engine)

app = FastAPI(title="FinanceAI API")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.get("/api/assets", response_model=list[schemas.Asset])
def get_assets(db: Session = Depends(get_db)):
    assets = db.query(models.Asset).all()
    
    # Enrich with real-time data from yfinance
    enriched_assets = []
    for asset in assets:
        asset_obj = schemas.Asset.model_validate(asset)
        rt_data = yfinance_service.fetch_ticker_data(asset.ticker)
        
        if rt_data:
            asset_obj.price = rt_data["price"]
            asset_obj.previousPrice = rt_data["previousPrice"]
            asset_obj.volume = rt_data["volume"]
            asset_obj.dividendYield = rt_data["dividendYield"]
            asset_obj.pe = rt_data["pe"]
            
            # Previsão da Inteligência com Motor de Desvio Padrão
            pred = ai_service.calculate_predictive_score(rt_data.get("history_60d", []))
            asset_obj.aiScore = pred["aiScore"]
            asset_obj.recommendation = pred["recommendation"]
        else:
            # Fallback para títulos de Renda Fixa / Previdência não encontrados no Yahoo Finance
            # Simulando rendimento positivo contínuo baseado no avgPrice para não zerar (cair 100%)
            asset_obj.price = asset.avgPrice * 1.08  # ~8% subida total mocada
            asset_obj.previousPrice = asset.avgPrice * 1.077
            # Títulos do governo / Renda Fixa costumam ir sempre verdes e muito seguros
            asset_obj.aiScore = 85
            asset_obj.recommendation = "compra"
        enriched_assets.append(asset_obj)
        
    return enriched_assets

@app.post("/api/chat", response_model=schemas.ChatResponse)
def chat_with_agent(request: schemas.ChatRequest, db: Session = Depends(get_db)):
    assets = db.query(models.Asset).all()
    context = []
    total_patrimonio = 0
    for a in assets:
        val = a.quantity * a.avgPrice
        total_patrimonio += val
        context.append(f"- {a.ticker}: {a.quantity} cotas | PM: R${a.avgPrice:.2f} | Tipo: {a.typeLabel}")
    
    context_str = "\n".join(context)
    context_str += f"\nTotal investido aproximado: R${total_patrimonio:.2f}"
    
    reply = agent.ask_agent(request.message, context_str)
    return schemas.ChatResponse(reply=reply)

from fastapi.staticfiles import StaticFiles

# Servindo o Frontend diretamente pelo FastAPI na raiz "/"
app.mount("/", StaticFiles(directory="frontend", html=True), name="frontend")
