from sqlalchemy import create_engine, text
from sqlalchemy.orm import sessionmaker
from urllib.parse import quote_plus
from pathlib import Path
from dotenv import load_dotenv
import os
from .base import BASE
from .log import logger
from .user import User, PasswordResetToken
from .config import SystemSetting, AuditLog
from .customers import Customer
from .suppliers import Supplier
from .products import Product, StockBatch
from .sales import Sale, SalesItem, PurchaseOrder, PurchaseOrderItem
from passlib.context import CryptContext


pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")

class DB:
    
    def __init__(self, activate=False):
        self.activate = activate
        self.engine = None
        self.SessionLocal = None
        
    def db_init(self):
        base_dir = Path(__file__).resolve().parent.parent.parent
        load_dotenv(dotenv_path=base_dir /".env")

        user = os.getenv("DB_USER")
        password = os.getenv("DB_PASSWORD")
        if not password:
            logger.error("password: Environment not set")
            print(f"Environment Set!")
        dbname = os.getenv("DB_NAME")
        host = os.getenv("DB_HOST")
        port = int(os.getenv("DB_PORT"))

        password = quote_plus(password)

        DATABASE_URL_NO_DB  = f"mysql+pymysql://{user}:{password}@{host}:{port}/"

        engine_tmp = create_engine(DATABASE_URL_NO_DB, pool_pre_ping=True, echo=True)
        with engine_tmp.connect() as conn:
            conn.execute(text(f"CREATE DATABASE IF NOT EXISTS {dbname}"))
        engine_tmp.dispose()

        DATABASE_URL = f"mysql+pymysql://{user}:{password}@{host}:{port}/{dbname}"
        self.engine = create_engine(DATABASE_URL, echo=True)
    

        self.SessionLocal = sessionmaker(bind=self.engine, autocommit=False, autoflush=False)
        session = self.SessionLocal()
        try:
            session.execute(text("SELECT 1 FROM system_settings LIMIT 1"))
            result = session.execute(text("SELECT setting_value FROM system_settings WHERE setting_key='db_initialized'")).fetchone()
            if result and result[0] == "true":
                logger.info(f"Database already initialized. Skipping creation.")
                #print("Database already initialized. Skipping table creation.")
                self.activate = False
                return
        except Exception as e:
            logger.error(f"Database Initaliazation Error: {e}")
        
        BASE.metadata.create_all(self.engine)
        session.execute(text("INSERT INTO system_settings (setting_key, setting_value) Values('db_initialized', 'true')"))
        session.commit()
        
        admin = session.query(User).filter(User.username == "admin").first()
        if not admin:
            admin_user = User(
                username = "admin",
                fullname = "System Administrator",
                hash_password = pwd_context.hash("admin123"),
                role = "admin",
                email = "obed.adu-gyamfi@peterma-ag.com",
                phone = "0503816553",
                is_active = True
            )
            session.add(admin_user)
            session.commit()
        session.close()
        #print("Database initialized Successfully")
        logger.info("Databse initialized Succussfully")

    def get_db(self):
        db = self.SessionLocal()
        try:
            yield db
        finally:
            db.close()
   
    

