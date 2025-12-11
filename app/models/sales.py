from sqlalchemy import Column, Index, Integer, ForeignKey, String, Date, DECIMAL,text, TIMESTAMP, Text, Enum, cast, func
from sqlalchemy.orm import relationship
from .base import BASE
from .user import User
from .products import Product, StockBatch
from .customers import Customer
import datetime
from decimal import Decimal
from .log import logger
from datetime import date, timedelta


class Sale(BASE):
    __tablename__ = "sales"
    id = Column(Integer, primary_key=True, autoincrement=True)
    sale_number = Column(String(50), unique=True, nullable=True)
    customer_id = Column(Integer,ForeignKey("customers.id", ondelete="SET NULL"))       
    user_id = Column(Integer, ForeignKey("users.id", ondelete="RESTRICT"))
    subtotal = Column(DECIMAL(10, 2), nullable=False)
    discount = Column(DECIMAL(10, 2),  default=0)
    tax = Column(DECIMAL(10, 2), default=0)
    total = Column(DECIMAL(10, 2), nullable=False)
    payment_method = Column(Enum('cash', 'momo', 'credit_card', name="payment_methods"), default='cash')
    payment_status = Column(Enum('paid', 'partial', 'pending', name="payment_status"), default='paid')
    sale_date = Column(TIMESTAMP , server_default=text("CURRENT_TIMESTAMP"))
    notes = Column(Text)
    
    customer = relationship("Customer", back_populates="sales")
    user = relationship("User", back_populates="sales")
    items = relationship("SalesItem", back_populates="sale", cascade="all, delete")
    
    __table_args__ = (
        Index("idx_sale_date","sale_date"),
    )
    
class CreateSale:
    
    def __init__(self,customer_id,payment_method,payment_status, notes,db, user_id):
        self.sale_number = f"pharm-{int(datetime.datetime.utcnow().timestamp())}"
        self.customer_id = customer_id
        self.subtotal = 0
        self.discount = 0
        self.tax = 0 
        self.total = 0 
        self.payment_method = payment_method
        self.payment_status = payment_status
        self.notes = notes
        self.db = db
        self.current_user = user_id
        
    
    def __repr__(self):
        return f"CreateSale(sale_number='{self.sale_number}',customer_id='{self.customer_id}', \
            user_id='{self.user_id}',subtotal='{self.subtotal}',discount='{self.discount}', total='{self.total}', \
                discount = {self.discount},total = {self.total},payment_method='{self.payment_method}',payment_status='{self.payment_status}',note='{self.notes}')"

    def create_sale(self):
        customer = self.db.query(Customer).filter(Customer.id == self.customer_id ).first()
        customer.loyalty_points += (10) / 100
        
        new_sale = Sale(
            sale_number = self.sale_number,
            customer_id = self.customer_id,
            user_id = self.current_user, 
            subtotal = self.subtotal,
            discount = self.discount,
            tax = self.tax, 
            total = self.total,
            payment_method = self.payment_method,
            payment_status = self.payment_status,
            notes = self.notes
          )
        self.db.add(new_sale)
        self.db.commit()
        self.db.refresh(new_sale)
        
        return (new_sale)
    



class SalesItem(BASE):
    __tablename__ = "sales_items"
    id = Column(Integer, primary_key=True, autoincrement=True)
    sale_id = Column(Integer, ForeignKey("sales.id", ondelete="CASCADE"), nullable=False)
    product_id = Column(Integer, ForeignKey("products.id", ondelete="RESTRICT"),nullable=False)
    batch_id = Column(Integer, ForeignKey("stock_batches.id", ondelete="RESTRICT"),nullable=False)
    quantity = Column(Integer, nullable=False)
    unit_price = Column(DECIMAL(10, 2), nullable=False)
    discount = Column(DECIMAL(10, 2), default=0)
    total = Column(DECIMAL(10, 2), nullable=False)
    
    sale = relationship("Sale", back_populates="items")
    product = relationship("Product", back_populates="sales_items")
    batch = relationship("StockBatch", back_populates="sales_items")

    
    def __str__(self):
        return f"{self.id}, {self.sale_id}, {self.product_id}, {self.batch_id}, {self.quantity}, {self.unit_price}, {self.discount}, {self.total}"
    
    def __repr__(self):
        return f"Sales_items(id = {self.id}, sale_id = {self.sale_id}, product_id = {self.product_id}, batch_id = {self.batch_id}, quantity = {self.quantity}, unit_price = {self.unit_price}, discount = {self.discount},  total = {self.total})"



class CreateSaleItem:
    
    
    def __init__(self, sale_id, barcode, batch_id, quantities, db):
        self.sale_id = sale_id
        self.barcode = barcode
        self.batch_id = batch_id
        self.quantities = quantities
        self.discount = 0
        self.db = db
        
        
     
    def __repr__(self):
        return f"Sales_items(id = {self.id}, sale_id = {self.sale_id}, product_id = {self.product_id}, batch_id = {self.batch_id}, quantity = {self.quantity}, unit_price = {self.unit_price}, discount = {self.discount},  total = {self.total})"


    def create_sale_item(self):
        sale_items = []
        
        for barcode, batch_id, quantity in zip(self.barcode, self.batch_id, self.quantities):
            batch = self.db.query(StockBatch).filter(StockBatch.id == batch_id).first()
            product = self.db.query(Product).filter(Product.barcode == barcode).first()
            if not batch:
                logger.error("create_sale_item: Invalid stock_batch_id")
                raise Exception("Invalid stock_batch_id")
            if batch.quantity < quantity:
                logger.error("create_sale_item: Not enough stock in this batch")
                raise Exception("Not enough to stock in this batch")
            if not product:
                logger.error("create_sale_item: Invalid barcode")
                raise Exception("Invalid barcode")
        
            batch.remaining_quantity -= quantity
            product.reorder_level += 1
            if batch.quantity == 0:
                product.is_active = False
            unit_price = product.selling_price
            total = float(quantity * unit_price - self.discount)
            print(f"quantity: {quantity}, total = {total}")

            new_sale_item = SalesItem(
                sale_id = self.sale_id,
                product_id = product.id, 
                batch_id = batch.id, 
                quantity = quantity, 
                unit_price = unit_price, 
                discount = self.discount, 
                total = total
            )
            self.db.add(new_sale_item)
            sale_items.append(new_sale_item)
            product.is_active = False
        self.db.commit()
        
        new_sale = self.db.query(Sale).filter(Sale.id == self.sale_id).first()
        new_sale.subtotal = sum(item.total for item in sale_items)
        new_sale.tax = new_sale.subtotal * Decimal("0.15")
        new_sale.total = new_sale.subtotal + new_sale.tax
        self.db.commit()
        
        

class GetSales:
    def __init__(self, period, db):
        self.period = period
        self.db = db
        
    def __repr__(self):
        return f"GetSales(period={self.period}, db={self.db})"
        
    def get_sales(self):

        start_date = date.today() - timedelta(days=self.period)
        end_date = date.today()
        search = (
            self.db.query(Sale)
            .filter(Sale.sale_date >= start_date)
            .filter(Sale.sale_date < end_date + timedelta(days=1))
            .all()
        )

        if search:
            total_revenue = round(sum(item.total for item in search), 2)
            average_sale = f"{total_revenue / len(search):.2f}"
            
        if not search:
            logger.info("sales search was unsuccessful")
            return {
                "total_revenue": 0,
                "average_sale": 0
            }
    
        return {
            "total_revenue": total_revenue,
            "average_sale": average_sale
        }
class RecentTransaction:
    
    def __init__(self, db):
        self.db = db
        
    def __repr__(self):
        return f"RecentTransaction(db='{self.db}')"
    def get_recent_transaction(self):
        recent_sales = (
        self.db.query(Sale, Customer).join(Customer, Sale.customer_id == Customer.id).order_by(Sale.sale_date.desc()).limit(15).all()
)


        return  [
        {
            "cusId": c.id,
            "date": s.sale_date.strftime("%b %d, %Y"),
            "sale": s.total,
            "sale_id": f"#{s.id}",
            "loyalty_points": c.loyalty_points
        }
        for s, c in recent_sales
        ]
                            
 
    def activity(self):
        results = (
        self.db.query(
            func.date_format(Sale.sale_date, "%b").label("month"),
            func.count(Sale.id).label("transactions"),
            func.sum(Sale.total).label("total_sales")
        )
        .group_by("month")
        .all()
        )

        return [
        {"name": r.month, "No. Sales": r.transactions, "Sales": r.total_sales} for r in results
        ]
 
 
 
class PurchaseOrder(BASE):  
    __tablename__ = "purchase_orders"
    id = Column(Integer, primary_key=True, autoincrement=True)
    po_number = Column(String(50), unique=True, nullable=False)
    supplier_id = Column(Integer, ForeignKey("suppliers.id", ondelete="RESTRICT"),nullable=False)
    user_id = Column(Integer, ForeignKey("users.id", ondelete="RESTRICT"),nullable=False)
    order_date = Column(Date, nullable=False)
    expected_delivery_date = Column(Date)
    status = Column(String(20), Enum('pending', 'received', 'cancelled', name="purchars_order_status"), default='pending')
    total_amount = Column(DECIMAL(10, 2))
    notes = Column(Text)
    created_at = Column(TIMESTAMP, nullable=False, server_default=text("CURRENT_TIMESTAMP"))
    user = relationship("User", back_populates="purchase_orders")
    supplier = relationship("Supplier", back_populates="purchase_orders")
    items = relationship("PurchaseOrderItem", back_populates="po", cascade="all, delete")


        
    
class PurchaseOrderItem(BASE):
    __tablename__ = "purchase_order_items"
    id = Column(Integer, primary_key=True, autoincrement=True)
    po_id = Column(Integer, ForeignKey("purchase_orders.id" , ondelete="CASCADE"),nullable=False)
    product_id = Column(Integer, ForeignKey("products.id", ondelete="RESTRICT"), nullable=False)
    quantity = Column(Integer, nullable=False)
    unit_price = Column(DECIMAL(10, 2), nullable=False)
    total = Column(DECIMAL(10, 2), nullable=False)
    po = relationship("PurchaseOrder", back_populates="items")
    product = relationship("Product", back_populates="purchase_order_items")
    
    
