from sqlalchemy import Column, Integer, String, TIMESTAMP, text, Text, Boolean, or_, Index
from sqlalchemy.orm import relationship, declarative_base
from .base import BASE
from .log import logger
from fastapi import HTTPException

class Supplier(BASE):
    __tablename__ = "suppliers"
    id = Column(Integer, primary_key=True, autoincrement=True)
    name = Column(String(100), nullable=False)
    contact_person = Column(String(100), nullable=True)
    email = Column(String(100),  unique=True, nullable=True)
    phone = Column(String(20), unique=True, nullable=True)
    address = Column(Text)
    is_active = Column(Boolean, default=True)
    created_at = Column(TIMESTAMP, nullable=False, server_default=text("CURRENT_TIMESTAMP"))
    updated_at = Column(TIMESTAMP, nullable=False, server_default=text("CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP"))
    
    __table_args__ = (
        Index("idx_name", "name"),
        Index("idx_contact_person", "contact_person"),
    )
    stock_batches = relationship("StockBatch", back_populates="supplier")
    purchase_orders = relationship("PurchaseOrder", back_populates="supplier")
    
    def __str__(self):
        return f"{self.id} {self.name} {self.contact_person} {self.email} {self.phone} {self.address} {self.is_active} {self.created_at} {self.updated_at}"
    
    def __repr__(self):
        return f"Supplier(id='{self.id}', name='{self.name}', contact_person='{self.contact_person}', email='{self.email}', phone='{self.phone}', \
            address='{self.address}', is_active='{self.is_active}', created_at='{self.created_at}', updated_at='{self.updated_at}')"


class CreateSupplier:
    def __init__(self, name, contact_person, email, phone, address,is_active, db):
        self.name = name
        self.contact_person = contact_person
        self.email = email
        self.phone = phone
        self.address  = address
        self.is_active = is_active
        self.db = db   
     
    def __repr__(self):
        return f"CreateSupplier(name='{self.name}', contact_person='{self.contact_person}', email='{self.email}', \
            phone='{self.phone}', address='{self.address}', is_active='{self.is_active}'"
            
    def create_supplier(self):
        
        new_supplier = Supplier(
            name=self.name,
            contact_person=self.contact_person,
            email=self.email,
            phone=self.phone,
            address=self.address,
            is_active=self.is_active
          )
        if not new_supplier:
            logger.error("create_supplier: Failed to create new_supplier")
        self.db.add(new_supplier)
        self.db.commit()
        self.db.refresh(new_supplier)
        
class SearchSupplier:
    def __init__(self, supplier_id, db):
        self.db = db
        self.supplier_id = supplier_id
        
    def __repr__(self):
        return f"SearchSupplier(supplier_id='{self.supplier_id}', db='{self.db}')"    
    
    def search_supplier(self):
        supplier = self.db.query(Supplier).filter(Supplier.id == self.supplier_id).first()
        #print(user)
        if not supplier:
            logger.error("search_supplier: supplier not found!")
            raise Exception(status_code=404, detail="supplier not found")
    
        #return user.username
        return {
               "status": "success",
               "data" : {
               "name": supplier.name,
               "contact_person": supplier.contact_person
               }
          }
class GetSupplier:
    def __init__(self, query, db):
        self.query = query.strip()
        self.db = db
        
    def __repr__(self):
        return f"GetSupplier(query='{self.query}', db='{self.db}')"
    
    def lookup_supplier(self):
        if not self.query:
            raise HTTPException(status_code=400, detail="Search term can not be empty")
        suppliers = self.db.query(Supplier).filter(
            or_(
                Supplier.name.ilike(f"{self.query}%"),
                Supplier.contact_person.ilike(f"%{self.query}%")
            )).limit(20).all()
        
        if not suppliers:
            logger.info(f"lookup_supplier: {self.query} not found!")
        [print(supplier) for supplier in suppliers]
        return {
            "status": "success",
            "count" : len(suppliers),
            "data": [{
                "id": supplier.id,
                "name": supplier.name,
                "contact_person": supplier.contact_person,
                "email": supplier.email,
                "phone" : supplier.phone,
                "address": supplier.address
            } for supplier in suppliers]
        }