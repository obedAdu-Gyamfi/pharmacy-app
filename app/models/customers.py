from sqlalchemy import Column, Index, Integer, ForeignKey, String, Date, DECIMAL,text, Text,TIMESTAMP,Boolean
from sqlalchemy.orm import relationship, declarative_base
from .base import BASE
from .log import logger



class Customer(BASE):
    __tablename__ = "customers"
    id = Column(Integer, primary_key=True, autoincrement=True)
    first_name = Column(String(50), nullable=True)
    last_name = Column(String(50), nullable=True)
    phone = Column(String(20), unique=True, nullable=True)
    email = Column(String(100), unique=True, nullable=True)
    date_of_birth = Column(Date, nullable=True)
    address = Column(Text, nullable=True)
    loyalty_points = Column(Integer, default=0)
    is_active = Column(Boolean, default=True)
    created_at = Column(TIMESTAMP, nullable=False, server_default=text("CURRENT_TIMESTAMP"))
    updated_at = Column(TIMESTAMP, nullable=False, server_default=text("CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP"))
    
    sales = relationship("Sale", back_populates="customer")
    __table_args__  = (
        Index("idx_phone", "phone"),
    )
    
class CreateCustomer:
    
    def __init__(self, first_name, last_name, phone, email, date_of_birth, address, db):
        self.first_name = first_name
        self.last_name = last_name
        self.phone = phone
        self.email = email
        self.date_of_birth = date_of_birth
        self.address = address
        self.db = db
        
    def __repr__(self):
        return f"CreateCustomer(first_name='{self.first_name},last_name='{self.last_name}', phone='{self.phone}', \
            email='{self.email}', date_of_birth='{self.date_of_birth}', address='{self.address}', db='{self.db}')"

    def create_customer(self):
        new_customer = Customer(
             first_name = self.first_name,
             last_name = self.last_name,
             phone = self.phone,
             email = self.email,
             date_of_birth = self.date_of_birth,
             address = self.address,
             loyalty_points = 0,
             is_active = True
        )
        if not new_customer:
            logger.error(f"create_customer: Failed to create new customer {self.first_name}")
        self.db.add(new_customer)
        self.db.commit()
        self.db.refresh(new_customer)
