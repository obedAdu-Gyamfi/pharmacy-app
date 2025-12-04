from sqlalchemy import Column, Index, Integer, ForeignKey, String, Date, DECIMAL,text, TIMESTAMP, Text, Boolean
from sqlalchemy.orm import relationship, declarative_base
from .base import BASE
from .suppliers import Supplier
from fastapi import HTTPException
from .log import logger




class Product(BASE):
    __tablename__ = "products"
    id = Column(Integer, primary_key=True, autoincrement=True)
    name = Column(String(200), nullable=False)
    generic_name = Column(String(200), nullable=True)
    barcode = Column(String(50), unique=True)
    category = Column(String(50), nullable=True)
    description = Column(Text)
    unit_price = Column(DECIMAL(10, 2), nullable=False)
    selling_price = Column(DECIMAL(10, 2) , nullable=False )
    reorder_level = Column(Integer,  default=10)
    is_active = Column(Boolean, default=True)
    created_at = Column(TIMESTAMP, nullable=False, server_default=text("CURRENT_TIMESTAMP"))
    updated_at = Column(TIMESTAMP, nullable=False, server_default=text("CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP"))
    __table_args__ = (
     Index("idx_barcode","barcode"),
     Index("idx_name","name")
    )
    
    stock_batches = relationship("StockBatch", back_populates="product")
    sales_items = relationship("SalesItem", back_populates="product")
    purchase_order_items = relationship("PurchaseOrderItem", back_populates="product")

    
    def __str__(self):
        return f"{self.id} {self.name} {self.generic_name} {self.barcode} {self.category} {self.description} {self.unit_price} \
            {self.selling_price} {self.reorder_level} {self.is_active} {self.created_at} {self.updated_at}" 

    def __repr__(self):
        return f"Product(id='{self.id}', name='{self.name}', generic_name='{self.generic_name}', barcode='{self.barcode}', category='{self.category}', \
            description='{self.description}', unit_price='{self.unit_price}', selling_price='{self.selling_price}', reoder_level='{self.reorder_level}', \
            is_active='{self.is_active}', created_at='{self.created_at}', updated_at='{self.updated_at}')"



class CreateProduct:
    
    def __init__(self, name, generic_name, barcode, category, description, unit_price, selling_price, reorder_level, is_active, db):
        self.name = name
        self.generic_name = generic_name
        self.barcode = barcode
        self.category = category
        self.description = description
        self.unit_price = unit_price
        self.is_active = is_active
        self.selling_price = selling_price
        self.reorder_level = reorder_level
        self.db = db   
     
    def __repr__(self):
        return f"Product(id='{self.id}', name='{self.name}', generic_name='{self.generic_name}', barcode='{self.barcode}', category='{self.category}', \
            description='{self.description}', unit_price='{self.unit_price}', selling_price='{self.selling_price}', reoder_level='{self.reorder_level}', \
            is_active='{self.is_active}', created_at='{self.created_at}', updated_at='{self.updated_at}')"

   
    def create_product(self):
        
        new_product = Product(
            name=self.name,
            generic_name=self.generic_name,
            barcode=self.barcode,
            category=self.category,
            description=self.description,
            unit_price=self.unit_price,
            selling_price=self.selling_price,
            reorder_level=self.reorder_level,
            is_active=self.is_active
          )
        self.db.add(new_product)
        self.db.commit()
        self.db.refresh(new_product)
    
        #return (user)
            
        
        
        
        
class SearchProduct:
    def __init__(self, barcode, db):
        self.db = db
        self.barcode = barcode
    def __repr__(self):
        return f"SearchUser(user_id='{self.barcode}', db='{self.db}')"
    
    def search_product(self):

        product = self.db.query(Product)
        product = product.outerjoin(StockBatch).outerjoin(Supplier).filter(Product.barcode == self.barcode).first()
        print(product)
        if not product:
            logger.error("Search_Product: product not found.")
            raise HTTPException(status_code=404, detail="product not found")
        batch = product.stock_batches[0] if product.stock_batches else None
        supplier_name = batch.supplier.name if batch and batch.supplier.name else None
        expiry_date = batch.expiry_date if batch else None
        return {
               "status": "success",
               "data" : {
                   "product_id": product.id, 
                   "name": product.name,
                   "supplier": supplier_name,
                   "expiry_date": expiry_date,
                   "reorder_level": product.reorder_level,
                   "description": product.description
               }
          }
    
class StockBatch(BASE):
    __tablename__ = "stock_batches"
    id = Column(Integer, primary_key=True, autoincrement=True)
    product_id = Column(Integer,ForeignKey("products.id", ondelete="CASCADE"), nullable=False)
    batch_number = Column(String(50), unique=True, nullable=False)
    lot_number = Column(String(50), unique=True, nullable=True)
    quantity = Column(Integer, nullable=False)
    remaining_quantity = Column(Integer, nullable=False)
    manufacturing_date = Column(Date)
    expiry_date = Column(Date, nullable=False)
    supplier_id = Column(Integer, ForeignKey("suppliers.id",  ondelete= "SET NULL"), nullable=True)
    purchase_price = Column(DECIMAL(10, 2))
    created_at = Column(TIMESTAMP, nullable=False, server_default=text("CURRENT_TIMESTAMP"))
    __table_args__ = (
     Index("idx_expiry", "expiry_date"),
     Index("idx_product","product_id")
    )
    
    product = relationship("Product", back_populates="stock_batches")
    supplier = relationship("Supplier", back_populates="stock_batches")
    sales_items = relationship("SalesItem", back_populates="batch")
    
    def __str__(self):
        return f"{self.id} {self.product_id} {self.batch_number} {self.lot_number} {self.quantity} {self.remaining_quantity} {self.manufacturing_date} \
            {self.expiry_date} {self.supplier_id} {self.purchase_price} {self.created_at}"
            
    def __repr__(self):
        return f"StochBatch(id='{self.id}', product_id='{self.product_id}', batch_number='{self.batch_number}', lot_number='{self.lot_number}', quantity='{self.quantity}', \
            remaining_quantity='{self.remaining_quantity}', manufacturing_date='{self.manufacturing_date}', \
            expiry_date='{self.expiry_date}', supplier_id='{self.supplier_id}', purchase_price='{self.purchase_price}', created_at='{self.created_at}')"


class CreateStochBatch:
    
    def __init__(self, product_id, batch_number, lot_number,
                 quantity, manufacturing_date,
                 expiry_date, supplier_id,
                 db):
        self.product_id = product_id
        self.batch_number = batch_number
        self.lot_number = lot_number
        self.quantity = quantity
        self.manufacturing_date = manufacturing_date
        self.expiry_date = expiry_date
        self.supplier_id = supplier_id
        self.db = db   
     
    def __repr__(self):
        return f"StochBatch(id='{self.id}', product_id='{self.product_id}', batch_number='{self.batch_number}', lot_number='{self.lot_number}', quantity='{self.quantity}', \
            remaining_quantity='{self.remaining_quantity}', manufacturing_date='{self.manufacturing_date}', \
            expiry_date='{self.expiry_date}', supplier_id='{self.supplier_id}')"

   
    def create_stock_batch(self):
        product = self.db.query(Product).filter(Product.id == self.product_id).first()
        if not product:
            logger.error("create_stock_batch: product not found")
            raise Exception("product not found")
        new_stock_batch = StockBatch(
            product_id=self.product_id,
            batch_number=self.batch_number,
            lot_number=self.lot_number,
            quantity=self.quantity,
            remaining_quantity=self.quantity,
            manufacturing_date=self.manufacturing_date,
            expiry_date=self.expiry_date,
            supplier_id=self.supplier_id,
            purchase_price=product.unit_price
          )
        self.db.add(new_stock_batch)
        self.db.commit()
        self.db.refresh(new_stock_batch)
        return new_stock_batch
        
        
    