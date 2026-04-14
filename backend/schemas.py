from pydantic import BaseModel
from typing import Optional

class AssetBase(BaseModel):
    name: str
    ticker: str
    type: str
    typeLabel: str
    quantity: float = 0
    avgPrice: float = 0
    sector: str
    risk: str

class AssetCreate(AssetBase):
    pass

class Asset(AssetBase):
    id: int
    price: float = 0
    previousPrice: float = 0
    dividendYield: Optional[float] = 0
    pe: Optional[float] = 0
    beta: Optional[float] = 0
    volume: Optional[int] = 0
    recommendation: Optional[str] = "manter"
    aiScore: Optional[int] = 50

    class Config:
        from_attributes = True

class ChatRequest(BaseModel):
    message: str

class ChatResponse(BaseModel):
    reply: str
