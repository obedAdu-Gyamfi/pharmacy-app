from sqlalchemy.orm  import declarative_base, relationship, sessionmaker
from sqlalchemy import Column, Integer, String, Boolean, TIMESTAMP, text, Enum, Index, or_, ForeignKey, DateTime
from .base import BASE
from passlib.context import CryptContext
from .log import logger
from fastapi import HTTPException
import datetime
import hashlib
import secrets
import smtplib
from email.message import EmailMessage
import os

pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")
class User(BASE):
    __tablename__ = "users"
    id = Column(Integer, primary_key=True, autoincrement=True)
    username = Column(String(50), unique=True, nullable=False)
    hash_password = Column(String(255), unique=False, nullable=False)
    fullname = Column(String(100), nullable=False)
    role = Column(Enum('admin', 'cashier', 'pharmacist', 'manager','other', name="user_roles"), nullable=False)
    email = Column(String(100), unique=True, nullable=True)
    phone = Column(String(20), unique=True,nullable=True)
    logged_in = Column(Boolean, default=True)
    is_active = Column(Boolean, default=True)
    created_at = Column(TIMESTAMP, nullable=False, server_default=text("CURRENT_TIMESTAMP"))
    updated_at = Column(TIMESTAMP, nullable=False, server_default=text("CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP"))
    
    __table_args__ = (
     Index("idx_users_username","username"),
     Index("idx_fullname","fullname"),
     Index("idx_users_email", "email"),
     Index("idx_users_phone", "phone"),

    )
    
    sales = relationship("Sale", back_populates="user")
    purchase_orders = relationship("PurchaseOrder", back_populates="user")
    audit_logs = relationship("AuditLog", back_populates="user")
    password_resets = relationship("PasswordResetToken", back_populates="user", cascade="all, delete")

    def __str__(self):
        return f"{self.id} {self.username} {self.hash_password} {self.fullname} {self.role} {self.email} {self.phone} {self.is_active} {self.created_at} {self.updated_at}"
    
    def __repr__(self):
        return f"User(id='{self.id}', username='{self.username}', password_hash='{self.hash_password}', fullname='{self.fullname}', \
            role='{self.role}', email='{self.email}', phone='{self.phone}', is_active='{self.is_active}', created_at='{self.created_at}', updated_at='{self.updated_at}')"
    
class CreateUser:
    
    def __init__(self, username, password, fullname, role, email, phone,db):
        self.username = username
        self.hash_password = pwd_context.hash(password)
        self.fullname = fullname
        self.role = role
        self.email = email
        self.phone = phone
        self.logged_in = True
        self.is_active = True
        self.db = db
     
    def __repr__(self):
        return f"CreateUser(username='{self.username}', password_hash='{self.hash_password}', fullname='{self.fullname}', role='{self.role}' \
            email='{self.email}', phone='{self.phone}', is_active='{self.is_active}'"
            
    def create_user(self):
        
        new_user = User(
            username=self.username,
            hash_password=self.hash_password,
            fullname=self.fullname,
            role=self.role,
            email=self.email,
            phone=self.phone,
            logged_in = self.logged_in,
            is_active=self.is_active
          )
        self.db.add(new_user)
        
        self.db.commit()
        self.db.refresh(new_user)
        return new_user
    
      
        
        
class SearchUser:
    def __init__(self, user_name, db):
        self.db = db
        self.user_name = user_name
        
    def __repr__(self):
        return f"SearchUser(user_name='{self.user_name}', db='{self.db}')"    
    
    def search_user(self):
        user = self.db.query(User).filter(User.username == self.user_name).first()
        if not user:
            logger.error("SearchUser: user not found")
            raise Exception(status_code=404, detail="user not found")
    

        return {
               "status": "success",
               "data" : {
                "id": user.id,
               "username": user.username,
               "fullname": user.fullname,
               "email": user.email,
               "role": user.role
               }
          }
        
class UserSearch:
    def __init__(self, username, db):
        self.db = db
        self.username = username.strip()
        
    def __repr__(self):
        return f"UserSearch(username='{self.username}', db='{self.db}')"    
    
    def lookup_user(self):
        if not self.username:
            raise HTTPException(status_code=400, detail="Search term is required")
        users = self.db.query(User).filter(
            or_(
                User.username.ilike(f"{self.username}%"),
                User.fullname.ilike(f"%{self.username}%")
            )).limit(20).all()
        if not users:
            logger.info(f"UserSearch:no users found for'{self.username}'")

        return {
               "status": "success",
               "count": len(users),
               "data" : [{
                "id": user.id,
               "username": user.username,
               "fullname": user.fullname,
               "email": user.email,
               "role": user.role
               }
                for user in users
                ]
          }
        
class DeleteUser:
    
    def __init__(self, user_id, db):
        self.user_id = user_id
        self.db = db

    def delete_user(self):
        user_id = self.db.query(User).filter(User.id == self.user_id).first()
        if user_id:
            logger.info(f"{user_id} deleted successfully")
            self.db.delete(user_id)
            self.db.commit()
        else:
            logger.error(f"{user_id} delete failed!")
        return user_id
    
    
class Profile:
    
    def __init__(self):
        pass
    
    def view_profile(self):
        pass
    
    def edit_profile(self):
        pass


class PasswordResetToken(BASE):
    __tablename__ = "password_reset_tokens"
    id = Column(Integer, primary_key=True, autoincrement=True)
    user_id = Column(Integer, ForeignKey("users.id", ondelete="CASCADE"), nullable=False)
    token_hash = Column(String(64), unique=True, nullable=False)
    expires_at = Column(DateTime, nullable=False)
    used_at = Column(DateTime, nullable=True)
    created_at = Column(TIMESTAMP, nullable=False, server_default=text("CURRENT_TIMESTAMP"))

    user = relationship("User", back_populates="password_resets")

    __table_args__ = (
        Index("idx_reset_user_id", "user_id"),
        Index("idx_reset_token_hash", "token_hash"),
        Index("idx_reset_expires_at", "expires_at"),
    )


class PasswordRecovery:
    def __init__(self, db):
        self.db = db

    def __repr__(self):
        return f"PasswordRecovery(db='{self.db}')"

    def _hash_token(self, token: str) -> str:
        return hashlib.sha256(token.encode("utf-8")).hexdigest()

    def _send_reset_email(self, email: str, reset_link: str):
        smtp_host = os.getenv("SMTP_HOST")
        smtp_port = int(os.getenv("SMTP_PORT", "587"))
        smtp_user = os.getenv("SMTP_USER")
        smtp_password = os.getenv("SMTP_PASSWORD")
        smtp_sender = os.getenv("SMTP_SENDER", smtp_user)

        if not smtp_host or not smtp_user or not smtp_password or not smtp_sender:
            logger.error("PasswordRecovery: SMTP settings are not configured")
            raise Exception("SMTP settings are not configured")

        msg = EmailMessage()
        msg["Subject"] = "Password Reset Request"
        msg["From"] = smtp_sender
        msg["To"] = email
        msg.set_content(
            f"Hello,\n\nWe received a request to reset your password. "
            f"Use the link below to set a new password:\n\n{reset_link}\n\n"
            "If you did not request this, you can safely ignore this email.\n"
        )

        with smtplib.SMTP(smtp_host, smtp_port) as server:
            server.starttls()
            server.login(smtp_user, smtp_password)
            server.send_message(msg)

    def request_password_reset(self, email: str):
        user = self.db.query(User).filter(User.email == email).first()
        if not user:
            logger.info("PasswordRecovery: password reset requested for unknown email")
            return {"status": "success"}

        raw_token = secrets.token_urlsafe(32)
        token_hash = self._hash_token(raw_token)
        expires_at = datetime.datetime.utcnow() + datetime.timedelta(hours=1)

        reset_token = PasswordResetToken(
            user_id=user.id,
            token_hash=token_hash,
            expires_at=expires_at,
            used_at=None,
        )
        self.db.add(reset_token)
        self.db.commit()

        frontend_base_url = os.getenv("FRONTEND_BASE_URL", "http://localhost:5173")
        reset_link = f"{frontend_base_url}/reset-password?token={raw_token}"
        self._send_reset_email(user.email, reset_link)

        return {"status": "success"}

    def reset_password(self, token: str, new_password: str):
        token_hash = self._hash_token(token)
        reset_token = (
            self.db.query(PasswordResetToken)
            .filter(PasswordResetToken.token_hash == token_hash)
            .first()
        )
        if not reset_token:
            logger.error("PasswordRecovery: invalid reset token")
            raise HTTPException(status_code=400, detail="Invalid reset token")

        if reset_token.used_at is not None:
            logger.error("PasswordRecovery: token already used")
            raise HTTPException(status_code=400, detail="Token already used")

        if reset_token.expires_at < datetime.datetime.utcnow():
            logger.error("PasswordRecovery: token expired")
            raise HTTPException(status_code=400, detail="Token expired")

        user = self.db.query(User).filter(User.id == reset_token.user_id).first()
        if not user:
            logger.error("PasswordRecovery: user not found")
            raise HTTPException(status_code=404, detail="User not found")

        user.hash_password = pwd_context.hash(new_password)
        reset_token.used_at = datetime.datetime.utcnow()
        self.db.commit()

        return {"status": "success"}
