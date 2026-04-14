from sqlalchemy import Column, Integer, String, Float
from .database import Base

class Asset(Base):
    __tablename__ = "assets"

    id = Column(Integer, primary_key=True, index=True)
    name = Column(String, index=True)
    ticker = Column(String, unique=True, index=True)
    type = Column(String)
    typeLabel = Column(String)
    quantity = Column(Float, default=0)
    avgPrice = Column(Float, default=0)
    sector = Column(String)
    risk = Column(String)
