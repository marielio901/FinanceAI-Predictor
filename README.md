# FinanceAI Predictor

Aplicacao full-stack para monitoramento de carteira de investimentos, com:

- API em FastAPI
- frontend em HTML/CSS/JavaScript servido pelo proprio backend
- dados de mercado via Yahoo Finance (`yfinance`)
- chat financeiro com LangChain (usando Together via endpoint compativel OpenAI)

## Requisitos

- Python 3.11+
- `pip`

## Setup local

```bash
python3 -m venv venv
source venv/bin/activate
pip install -r requirements.txt
cp .env.example .env
```

Depois, edite o arquivo `.env` e preencha:

- `TOGETHER_API_KEY`: sua chave da Together AI
- `TOGETHER_MODEL` (opcional): modelo de chat, com default `meta-llama/Llama-3-8b-chat-hf`
- `TOGETHER_BASE_URL` (opcional): default `https://api.together.xyz/v1`

## Inicializar dados

```bash
python3 -m backend.seed
```

Esse comando recria as tabelas do SQLite e popula ativos de exemplo.

## Rodar aplicacao

```bash
uvicorn backend.main:app --reload --host 0.0.0.0 --port 8000 --env-file .env
```

Acesse: `http://localhost:8000`

## Endpoints principais

- `GET /api/assets`: lista ativos com enriquecimento de dados de mercado
- `POST /api/chat`: chat com contexto da carteira

## Estrutura

- `backend/`: API, modelos, servicos de mercado e IA
- `frontend/`: interface web estatica
- `generate_notebook.py`: utilitario para geracao de notebook

