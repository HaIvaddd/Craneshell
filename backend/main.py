from fastapi import FastAPI, Depends, HTTPException, status, Query, Header
from fastapi.middleware.cors import CORSMiddleware
from sqlalchemy import Column, Integer, String, Float, DateTime, ForeignKey, UniqueConstraint
from sqlalchemy.ext.asyncio import AsyncSession, create_async_engine, async_sessionmaker
from sqlalchemy.orm import declarative_base, relationship
from pydantic import BaseModel, EmailStr, validator
from datetime import datetime, timedelta
import jwt
import bcrypt
import os
from dotenv import load_dotenv

load_dotenv()

# ===== CONFIG =====
DATABASE_URL = os.getenv("DATABASE_URL", "postgresql+asyncpg://user:password@localhost:5432/craneshell")
JWT_SECRET = os.getenv("JWT_SECRET", "your-secret-key-change-in-production")
JWT_ALGORITHM = os.getenv("JWT_ALGORITHM", "HS256")
JWT_EXPIRATION_HOURS = int(os.getenv("JWT_EXPIRATION_HOURS", "24"))
DEBUG = os.getenv("DEBUG", "True").lower() == "true"

# ===== DATABASE SETUP =====
engine = create_async_engine(DATABASE_URL, echo=DEBUG)
AsyncSessionLocal = async_sessionmaker(engine, class_=AsyncSession, expire_on_commit=False)
Base = declarative_base()

# ===== MODELS =====
class User(Base):
    __tablename__ = "users"
    
    id = Column(Integer, primary_key=True, index=True)
    username = Column(String(50), unique=True, index=True, nullable=False)
    email = Column(String(100), unique=True, index=True, nullable=False)
    password_hash = Column(String(255), nullable=False)
    created_at = Column(DateTime, default=datetime.utcnow)
    
    configs = relationship("Config", back_populates="owner", cascade="all, delete-orphan")

class Config(Base):
    __tablename__ = "configs"
    
    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id", ondelete="CASCADE"), nullable=False)
    name = Column(String(255), nullable=False)
    
    # Colors 0-15
    color0 = Column(String(7), default="#000000")
    color1 = Column(String(7), default="#cc0000")
    color2 = Column(String(7), default="#4e9a06")
    color3 = Column(String(7), default="#c4a000")
    color4 = Column(String(7), default="#3465a4")
    color5 = Column(String(7), default="#75507b")
    color6 = Column(String(7), default="#06989a")
    color7 = Column(String(7), default="#d3d7cf")
    color8 = Column(String(7), default="#555753")
    color9 = Column(String(7), default="#ff5555")
    color10 = Column(String(7), default="#55ff55")
    color11 = Column(String(7), default="#ffff55")
    color12 = Column(String(7), default="#5555ff")
    color13 = Column(String(7), default="#ff55ff")
    color14 = Column(String(7), default="#55ffff")
    color15 = Column(String(7), default="#ffffff")
    
    # Opacity and special colors
    opacity = Column(Float, default=0.9)
    foreground = Column(String(7), default="#d3d7cf")
    background = Column(String(7), default="#000000")
    selection_background = Column(String(7), default="#3465a4")
    
    created_at = Column(DateTime, default=datetime.utcnow)
    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)
    
    owner = relationship("User", back_populates="configs")
    __table_args__ = (UniqueConstraint('user_id', 'name', name='_user_config_uc'),)

# ===== PYDANTIC SCHEMAS =====
class UserRegister(BaseModel):
    username: str
    email: EmailStr
    password: str
    
    @validator('username')
    def username_alphanumeric(cls, v):
        assert v.isalnum(), 'must be alphanumeric'
        assert 3 <= len(v) <= 50, 'must be 3-50 characters'
        return v
    
    @validator('password')
    def password_strength(cls, v):
        assert len(v) >= 8, 'must be at least 8 characters'
        return v

class UserLogin(BaseModel):
    email: EmailStr
    password: str

class UserResponse(BaseModel):
    id: int
    username: str
    email: str
    created_at: datetime
    
    class Config:
        from_attributes = True

class TokenResponse(BaseModel):
    access_token: str
    token_type: str = "bearer"
    expires_in: int
    user: UserResponse

class ConfigCreate(BaseModel):
    name: str
    color0: str = "#000000"
    color1: str = "#cc0000"
    color2: str = "#4e9a06"
    color3: str = "#c4a000"
    color4: str = "#3465a4"
    color5: str = "#75507b"
    color6: str = "#06989a"
    color7: str = "#d3d7cf"
    color8: str = "#555753"
    color9: str = "#ff5555"
    color10: str = "#55ff55"
    color11: str = "#ffff55"
    color12: str = "#5555ff"
    color13: str = "#ff55ff"
    color14: str = "#55ffff"
    color15: str = "#ffffff"
    opacity: float = 0.9
    foreground: str = "#d3d7cf"
    background: str = "#000000"
    selection_background: str = "#3465a4"

class ConfigResponse(ConfigCreate):
    id: int
    user_id: int
    created_at: datetime
    updated_at: datetime
    
    class Config:
        from_attributes = True

class ConfigPublicResponse(BaseModel):
    id: int
    name: str
    color0: str
    color1: str
    color2: str
    color3: str
    color4: str
    color5: str
    color6: str
    color7: str
    opacity: float
    created_at: datetime
    
    class Config:
        from_attributes = True

# ===== FASTAPI APP =====
app = FastAPI(
    title="Craneshell API",
    description="Terminal configuration generator",
    version="1.0.0"
)

# ===== CORS =====
origins = os.getenv("CORS_ORIGINS", "*").split(",")
app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# ===== DEPENDENCY: GET SESSION =====
async def get_session() -> AsyncSession:
    async with AsyncSessionLocal() as session:
        yield session

# ===== DEPENDENCY: GET CURRENT USER =====
async def get_current_user(
    authorization: str = None,
    session: AsyncSession = Depends(get_session)
) -> User:
    if not authorization:
        raise HTTPException(status_code=401, detail="Not authenticated")
    
    try:
        scheme, token = authorization.split()
        if scheme.lower() != "bearer":
            raise HTTPException(status_code=401, detail="Invalid auth scheme")
        
        payload = jwt.decode(token, JWT_SECRET, algorithms=[JWT_ALGORITHM])
        user_id: int = payload.get("sub")
        
        if user_id is None:
            raise HTTPException(status_code=401, detail="Invalid token")
    except jwt.ExpiredSignatureError:
        raise HTTPException(status_code=401, detail="Token expired")
    except jwt.InvalidTokenError:
        raise HTTPException(status_code=401, detail="Invalid token")
    
    # Получи пользователя из БД
    from sqlalchemy import select
    result = await session.execute(select(User).where(User.id == user_id))
    user = result.scalar_one_or_none()
    
    if user is None:
        raise HTTPException(status_code=401, detail="User not found")
    
    return user

# ===== UTILITY FUNCTIONS =====
def hash_password(password: str) -> str:
    return bcrypt.hashpw(password.encode(), bcrypt.gensalt()).decode()

def verify_password(password: str, hash: str) -> bool:
    return bcrypt.checkpw(password.encode(), hash.encode())

def create_access_token(user_id: int) -> tuple[str, int]:
    expires = datetime.utcnow() + timedelta(hours=JWT_EXPIRATION_HOURS)
    payload = {"sub": user_id, "exp": expires}
    token = jwt.encode(payload, JWT_SECRET, algorithm=JWT_ALGORITHM)
    expires_in = int((expires - datetime.utcnow()).total_seconds())
    return token, expires_in

# ===== ROUTES: HEALTH =====
@app.get("/api/health")
async def health_check():
    return {"status": "ok", "version": "1.0.0"}

# ===== ROUTES: AUTH =====
@app.post("/api/auth/register", response_model=TokenResponse)
async def register(user_data: UserRegister, session: AsyncSession = Depends(get_session)):
    from sqlalchemy import select
    
    # Проверь что пользователь не существует
    result = await session.execute(select(User).where(User.email == user_data.email))
    if result.scalar_one_or_none():
        raise HTTPException(status_code=400, detail="Email already registered")
    
    # Создай пользователя
    hashed_password = hash_password(user_data.password)
    new_user = User(
        username=user_data.username,
        email=user_data.email,
        password_hash=hashed_password
    )
    session.add(new_user)
    await session.commit()
    await session.refresh(new_user)
    
    # Создай токен
    token, expires_in = create_access_token(new_user.id)
    
    return TokenResponse(
        access_token=token,
        expires_in=expires_in,
        user=UserResponse.model_validate(new_user)
    )

@app.post("/api/auth/login", response_model=TokenResponse)
async def login(user_data: UserLogin, session: AsyncSession = Depends(get_session)):
    from sqlalchemy import select
    
    # Найди пользователя
    result = await session.execute(select(User).where(User.email == user_data.email))
    user = result.scalar_one_or_none()
    
    if not user or not verify_password(user_data.password, user.password_hash):
        raise HTTPException(status_code=401, detail="Invalid credentials")
    
    # Создай токен
    token, expires_in = create_access_token(user.id)
    
    return TokenResponse(
        access_token=token,
        expires_in=expires_in,
        user=UserResponse.model_validate(user)
    )

# ===== ROUTES: CONFIGS (CRUD) =====
@app.post("/api/configs", response_model=ConfigResponse)
async def create_config(
    config_data: ConfigCreate,
    authorization: str = Header(None),
    session: AsyncSession = Depends(get_session)
):
    user = await get_current_user(authorization, session)
    
    new_config = Config(
        user_id=user.id,
        **config_data.dict()
    )
    session.add(new_config)
    await session.commit()
    await session.refresh(new_config)
    
    return ConfigResponse.model_validate(new_config)

@app.get("/api/configs", response_model=list[ConfigResponse])
async def get_user_configs(
    authorization: str = Header(None),
    session: AsyncSession = Depends(get_session)
):
    user = await get_current_user(authorization, session)
    
    from sqlalchemy import select
    result = await session.execute(
        select(Config).where(Config.user_id == user.id).order_by(Config.created_at.desc())
    )
    configs = result.scalars().all()
    
    return [ConfigResponse.model_validate(c) for c in configs]

@app.get("/api/configs/{config_id}", response_model=ConfigResponse)
async def get_config(
    config_id: int,
    authorization: str = Header(None),
    session: AsyncSession = Depends(get_session)
):
    user = await get_current_user(authorization, session)
    
    from sqlalchemy import select
    result = await session.execute(
        select(Config).where(Config.id == config_id, Config.user_id == user.id)
    )
    config = result.scalar_one_or_none()
    
    if not config:
        raise HTTPException(status_code=404, detail="Config not found")
    
    return ConfigResponse.model_validate(config)

@app.put("/api/configs/{config_id}", response_model=ConfigResponse)
async def update_config(
    config_id: int,
    config_data: ConfigCreate,
    authorization: str = Header(None),
    session: AsyncSession = Depends(get_session)
):
    user = await get_current_user(authorization, session)
    
    from sqlalchemy import select
    result = await session.execute(
        select(Config).where(Config.id == config_id, Config.user_id == user.id)
    )
    config = result.scalar_one_or_none()
    
    if not config:
        raise HTTPException(status_code=404, detail="Config not found")
    
    # Обнови поля
    for key, value in config_data.dict().items():
        setattr(config, key, value)
    
    config.updated_at = datetime.utcnow()
    await session.commit()
    await session.refresh(config)
    
    return ConfigResponse.model_validate(config)

@app.delete("/api/configs/{config_id}")
async def delete_config(
    config_id: int,
    authorization: str = Header(None),
    session: AsyncSession = Depends(get_session)
):
    user = await get_current_user(authorization, session)
    
    from sqlalchemy import select
    result = await session.execute(
        select(Config).where(Config.id == config_id, Config.user_id == user.id)
    )
    config = result.scalar_one_or_none()
    
    if not config:
        raise HTTPException(status_code=404, detail="Config not found")
    
    await session.delete(config)
    await session.commit()
    
    return {"message": "Config deleted"}

# ===== ROUTES: PUBLIC CONFIGS =====
@app.get("/api/public/popular", response_model=list[ConfigPublicResponse])
async def get_popular_configs(
    limit: int = Query(20, ge=1, le=100),
    session: AsyncSession = Depends(get_session)
):
    from sqlalchemy import select, func
    
    result = await session.execute(
        select(Config)
        .order_by(Config.created_at.desc())
        .limit(limit)
    )
    configs = result.scalars().all()
    
    return [ConfigPublicResponse.model_validate(c) for c in configs]

@app.get("/api/public/search", response_model=list[ConfigPublicResponse])
async def search_configs(
    q: str = Query(..., min_length=1),
    limit: int = Query(20, ge=1, le=100),
    session: AsyncSession = Depends(get_session)
):
    from sqlalchemy import select
    
    result = await session.execute(
        select(Config)
        .where(Config.name.ilike(f"%{q}%"))
        .order_by(Config.created_at.desc())
        .limit(limit)
    )
    configs = result.scalars().all()
    
    return [ConfigPublicResponse.model_validate(c) for c in configs]

@app.get("/api/public/configs/{config_id}", response_model=ConfigPublicResponse)
async def get_public_config(
    config_id: int,
    session: AsyncSession = Depends(get_session)
):
    from sqlalchemy import select
    
    result = await session.execute(select(Config).where(Config.id == config_id))
    config = result.scalar_one_or_none()
    
    if not config:
        raise HTTPException(status_code=404, detail="Config not found")
    
    return ConfigPublicResponse.model_validate(config)

# ===== STARTUP/SHUTDOWN =====
@app.on_event("startup")
async def startup():
    async with engine.begin() as conn:
        await conn.run_sync(Base.metadata.create_all)

@app.on_event("shutdown")
async def shutdown():
    await engine.dispose()

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)
