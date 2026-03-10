from pydantic import BaseModel


class Settings(BaseModel):
    tick_interval_seconds: float = 2.0
    war_room_threshold: int = 80
    default_cash_reserve: float = 50000.0
    low_cash_threshold: float = 15000.0


settings = Settings()
