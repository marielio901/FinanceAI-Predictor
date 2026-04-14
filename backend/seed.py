from sqlalchemy import text
from backend.database import SessionLocal, engine
from backend import models

# RAW_ASSETS focado em ações conservadoras e muita Renda Fixa
RAW_ASSETS = [
    { "name": "Itau Unibanco", "ticker": "ITUB4", "type": "acao_br", "typeLabel": "Ação BR", "quantity": 1500, "avgPrice": 28.9, "sector": "Financeiro", "risk": "Moderado" },
    { "name": "Banco do Brasil", "ticker": "BBAS3", "type": "acao_br", "typeLabel": "Ação BR", "quantity": 1200, "avgPrice": 42, "sector": "Financeiro", "risk": "Moderado" },
    { "name": "WEG", "ticker": "WEGE3", "type": "acao_br", "typeLabel": "Ação BR", "quantity": 500, "avgPrice": 35, "sector": "Industrial", "risk": "Moderado" },
    { "name": "B3 S.A.", "ticker": "B3SA3", "type": "acao_br", "typeLabel": "Ação BR", "quantity": 1000, "avgPrice": 12.5, "sector": "Financeiro", "risk": "Moderado" },
    { "name": "Engie Brasil", "ticker": "EGIE3", "type": "acao_br", "typeLabel": "Ação BR", "quantity": 600, "avgPrice": 40.2, "sector": "Energia", "risk": "Baixo" },
    { "name": "KNRI11", "ticker": "KNRI11", "type": "fii", "typeLabel": "FII", "quantity": 250, "avgPrice": 120, "sector": "Lajes Corporativas", "risk": "Baixo" },
    { "name": "HGLG11", "ticker": "HGLG11", "type": "fii", "typeLabel": "FII", "quantity": 300, "avgPrice": 145, "sector": "Logística", "risk": "Baixo" },
    { "name": "Apple", "ticker": "AAPL", "type": "acao_int", "typeLabel": "Ação INT", "quantity": 50, "avgPrice": 155, "sector": "Tecnologia", "risk": "Moderado" },
    { "name": "Microsoft", "ticker": "MSFT", "type": "acao_int", "typeLabel": "Ação INT", "quantity": 40, "avgPrice": 340, "sector": "Tecnologia", "risk": "Moderado" },
    { "name": "Tesouro Selic 2029", "ticker": "SELIC29", "type": "renda_fixa", "typeLabel": "Renda Fixa", "quantity": 15, "avgPrice": 13800, "sector": "Governo", "risk": "Baixo" },
    { "name": "Tesouro IPCA+ 2035", "ticker": "IPCA35", "type": "renda_fixa", "typeLabel": "Renda Fixa", "quantity": 25, "avgPrice": 3100, "sector": "Governo", "risk": "Baixo" },
    { "name": "CDB Banco Inter 120%", "ticker": "CDB-INT", "type": "renda_fixa", "typeLabel": "Renda Fixa", "quantity": 20, "avgPrice": 10000, "sector": "Bancario", "risk": "Baixo" },
    { "name": "CDB LCI Itau 95%", "ticker": "LCI-ITAU", "type": "renda_fixa", "typeLabel": "Renda Fixa", "quantity": 25, "avgPrice": 5000, "sector": "Bancario", "risk": "Baixo" },
    { "name": "Brasilprev Top", "ticker": "PREV-TOP", "type": "previdencia", "typeLabel": "Previdência", "quantity": 3000, "avgPrice": 38, "sector": "Multimercado", "risk": "Moderado" },
    { "name": "Icatu Vanguarda", "ticker": "PREV-ICA", "type": "previdencia", "typeLabel": "Previdência", "quantity": 2000, "avgPrice": 48, "sector": "Renda Fixa", "risk": "Baixo" }
]

def seed_db():
    # Hard drop existing tables to clear previous crypto/risky assets
    models.Base.metadata.drop_all(bind=engine)
    
    # Recreate tables 
    models.Base.metadata.create_all(bind=engine)
    
    db = SessionLocal()
    try:
        if not db.query(models.Asset).first():
            for item in RAW_ASSETS:
                asset = models.Asset(**item)
                db.add(asset)
            db.commit()
            print("Database dropado e re-semeado com os novos ativos seguros com sucesso.")
        else:
            print("Erro ou Banco de dados ja contem dados.")
    finally:
        db.close()

if __name__ == "__main__":
    seed_db()
