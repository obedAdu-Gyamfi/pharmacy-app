from sqlalchemy.orm  import declarative_base, relationship, sessionmaker
from sqlalchemy import Column, Integer, String, Boolean, TIMESTAMP, text, Enum
from .base import BASE
from passlib.context import CryptContext
from .log import logger

pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")
class User(BASE):
    __tablename__ = "users"
    id = Column(Integer, primary_key=True, autoincrement=True)
    username = Column(String(50), unique=True, nullable=False)
    hash_password = Column(String(255), unique=True, nullable=False)
    fullname = Column(String(100), nullable=False)
    role = Column(Enum('admin', 'cashier', 'pharmacist', 'other', name="user_roles"), nullable=False)
    email = Column(String(100), unique=True, nullable=True)
    phone = Column(String(20), unique=True,nullable=True)
    logged_in = Column(Boolean, default=True)
    is_active = Column(Boolean, default=True)
    created_at = Column(TIMESTAMP, nullable=False, server_default=text("CURRENT_TIMESTAMP"))
    updated_at = Column(TIMESTAMP, nullable=False, server_default=text("CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP"))
    
    sales = relationship("Sale", back_populates="user")
    purchase_orders = relationship("PurchaseOrder", back_populates="user")
    audit_logs = relationship("AuditLog", back_populates="user")

    def __str__(self):
        return f"{self.id} {self.username} {self.password_hash} {self.fullname} {self.role} {self.email} {self.phone} {self.is_active} {self.created_at} {self.updated_at}"
    
    def __repr__(self):
        return f"User(id='{self.id}', username='{self.username}', password_hash='{self.password_hash}', fullname='{self.fullname}', \
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
        return f"CreateUser(username='{self.username}', password_hash='{self.password_hash}', fullname='{self.fullname}', role='{self.role}' \
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
    def __init__(self, user_id, db):
        self.db = db
        self.user_id = user_id
        
    def __repr__(self):
        return f"SearchUser(user_id='{self.user_id}', db='{self.db}')"    
    
    def search_user(self):
        user = self.db.query(User).filter(User.id == self.user_id).first()
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