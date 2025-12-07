from fastapi import FastAPI, Form,HTTPException, Depends, Request, APIRouter
from fastapi.responses import Response
from models.database import DB
from models.user import SearchUser, CreateUser, User, DeleteUser
from models.suppliers import CreateSupplier, SearchSupplier
from models.products import CreateProduct, SearchProduct, CreateStochBatch
from models.sales import CreateSaleItem, CreateSale
from models.customers import CreateCustomer
from models.config import WriteAuditLogs, AuditLog
from models.base import BASE, audit_user_id, audit_ip
from pydantic import BaseModel
from fastapi.responses import JSONResponse
from typing import Optional, List
from sqlalchemy.orm import Session
from fastapi.security import OAuth2PasswordBearer,OAuth2PasswordRequestForm
from jose import jwt, JWTError
from pathlib import Path
from dotenv import load_dotenv
from datetime import datetime , timedelta, date
from passlib.context import CryptContext
from sqlalchemy import event, insert, delete
import os
from urllib.parse import quote_plus
import logging
from sqlalchemy.inspection import inspect
from decimal import Decimal
from models.log import logger
from fastapi.middleware.cors import CORSMiddleware



base_path = Path(__file__).resolve().parent.parent
load_dotenv(dotenv_path=base_path / ".env")
app = FastAPI(title="Pharmacy App")
db_instance = DB(activate=True)
oAuth2_schema = OAuth2PasswordBearer(tokenUrl="login")

SECRET_KEY = os.getenv("SECRET_KEY")
ALGORITHM = "HS256"
pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")

def get_access_token(data: dict):
     to_encode = data.copy()
     expire = datetime.utcnow() + timedelta(hours=1)
     #expire = datetime.now(datetime.astimezone.utc) + timedelta(hours=1)
     to_encode.update({"exp": expire})
     return jwt.encode(to_encode, SECRET_KEY, algorithm=ALGORITHM)



def get_current_user(token: str = Depends(oAuth2_schema), db: Session = Depends(db_instance.get_db)):
          try:
               payload = jwt.decode(token, SECRET_KEY, algorithms=[ALGORITHM])
               username: str = payload.get("sub")
               if not username:
                    logger.error("get_current_user: Invali token")
                    raise HTTPException(status_code=401, detail="Invalid token")
               user = db.query(User).filter(User.username == username).first()
               if not user:
                    logger.error("get_current_user: User not found")
                    raise HTTPException(status_code=401, detail="User not found")
               return user
          except JWTError as e:
               logger.error(f"get_current_user_JWT Error: {e}")
               raise HTTPException(status_code=401, detail="Invalid credentials")


from typing import Optional
from fastapi import Depends
from sqlalchemy.orm import Session
from jose import jwt, JWTError

def get_current_user_optional(
    token: str = Depends(oAuth2_schema),
    db: Session = Depends(db_instance.get_db)
) -> Optional[User]:
    if not token:
        return None
    try:
        payload = jwt.decode(token, SECRET_KEY, algorithms=[ALGORITHM])
        username: str = payload.get("sub")
        if not username:
             logger.error("get_current_user_optional: No username found")
             return None
        user = db.query(User).filter(User.username == username).first()
        return user
    except JWTError as e:
         logger.error(f"get_current_user_optional Error: {e}")
         return None


def verify_password(plain_password, hashed_password):
     return pwd_context.verify(plain_password, hashed_password)

def authenticate_user(username: str, password : str, db:Session):
     user = db.query(User).filter(User.username == username).first()
     if not user:
          logger.error(f"user_authentication: Invalid username - {user}")
          return False
          
     if not verify_password(password, user.hash_password):
          logger.error("user_authentication: Invalid password")
          return False
     
     logger.info(f"login successfully - user_id: {user.id} : username: {user.username}")
     return user
          
def require_role(*roles: str):
     def role_dependency(current_user: User = Depends(get_current_user)):
          if current_user.role not in roles:
               logger.error("require_role: Insufficient Permission")
               raise HTTPException(status_code=403, detail="Insufficient Permission")
          return current_user
     return role_dependency





async def audit_middleware(request: Request, call_next):
     token = None
     auth_header = request.headers.get("Authorization")
     if auth_header and auth_header.startswith("Bearer "):
          token = auth_header.split(" ")[1]
     user_id = None
     if token:          
          try:
               db_gen = db_instance.get_db()
               db = next(db_gen)
               payload = jwt.decode(token, SECRET_KEY, algorithms=[ALGORITHM])
               username = payload.get("sub")
               if username and db:
                    #db: Session = next(db_instance.get_db())
                    user = db.query(User).filter(User.username == username).first()
                    if user:
                         user_id = user.id
          except JWTError as e:
               logger.error(f"JWT decode failed: {e}")
          except Exception as e:
               logger.error(f"Audit middleware DB Error: {e}")
          finally:
               if db:
                    db.close()
     
     audit_user_id.set(user_id)
     audit_ip.set(request.client.host)
     
     response = await call_next(request)
     
     return response

app.middleware("http")(audit_middleware)

app.add_middleware(
     CORSMiddleware,
     allow_origins=["*"],   # or ["http://localhost:5173"]
     allow_credentials=True,
     allow_methods=["*"],
     allow_headers=["*"],
)
@app.on_event("startup")
def on_startup():
     logger.info("Application is starting")
     db_instance.db_init()
     logger.info("Database initialized")
          
          
          
          
@app.on_event("shutdown")
def on_shutdown():
     logger.info("Application is shutting down...")
     

def clean_model_dict(obj):
     result = {}
     for k, v in obj.__dict__.items():
          if k.startswith("_sa_"):
               continue
          if isinstance(v, (int, float, str, bool)) or v is None:
               result[k] = v
          if isinstance(v, Decimal):
               result[k] = float(v)

          if isinstance(v, (datetime, date)):
               result[k] = v.isoformat()
          elif hasattr(v, "__dict__"):
               result[k] = str(v)  # or skip it: continue
          else:
               result[k] = v
          return result


@event.listens_for(BASE, "after_insert", propagate=True)
def after_insert(mapper, connection, target):
     
    stmt = insert(AuditLog).values(
        user_id=audit_user_id.get(),
        action="insert",
        table_name=target.__tablename__,
        record_id=getattr(target, "id", None),
        old_values=None,
        new_values=clean_model_dict(target),
        ip_address=audit_ip.get()
    )
    connection.execute(stmt)
     
    
@event.listens_for(BASE, "after_update", propagate=True)
def after_update(mapper, connection, target):
     
    stmt = insert(AuditLog).values(
        user_id=audit_user_id.get(),
        action="update",
        table_name=target.__tablename__,
        record_id=getattr(target, "id", None),
        old_values=None,
        new_values=clean_model_dict(target),
        ip_address=audit_ip.get()
    )
    connection.execute(stmt)
@event.listens_for(BASE, "after_delete", propagate=True)
def after_delete(mapper, connection, target):
     
    stmt = delete(AuditLog).values(
        user_id=audit_user_id.get(),
        action="delete",
        table_name=target.__tablename__,
        record_id=getattr(target, "id", None),
        old_values=None,
        new_values=clean_model_dict(target),
        ip_address=audit_ip.get()
    )
    connection.execute(stmt)
     
@app.post("/login/")
async def login(form_data: OAuth2PasswordRequestForm = Depends(), db:Session = Depends(db_instance.get_db)):
     user = authenticate_user(form_data.username, form_data.password, db)
     if not user:
          logger.error("login: Invalid Credentials")
          raise HTTPException(status_code=401, detail="Invalid Credentials")
     access_token = get_access_token({"sub": user.username})
     return {
          "access_token" : access_token,
          "token_type" : "bearer"
          }
#app.include_router(router) 
@app.post("/logout/")
async def logout(user: Optional[User] = Depends(get_current_user_optional)):
    if user:
        logger.info(f"logout successfully - user_id: {user.id} : username: {user.username}")
    else:
        logger.info("logout attempted - no valid user token")
    return {"message": "Logged out successfully"}

     
@app.post("/sign-up/")
async def add_user(
     username: str = Form(...),
     password: str = Form(...),
     fullname: str = Form(...),
     role: str = Form(...),
     email: Optional[str] = Form(None),
     phone: Optional[str] = Form(None),
     current_user: User = Depends(require_role("admin")),
     db: Session = Depends(db_instance.get_db)
):
     try:
          new_user = CreateUser(
               username,
               password,
               fullname,
               role,
               email,
               phone,
               db).create_user()
          
          logger.info(f"Successfully created user with id {new_user.id}")
          return JSONResponse(status_code=200, content={"status" :"success", "message": f"successfully added {username}"})
     except RuntimeError as e:
          logger.error(f"{e}")
          raise HTTPException(status_code=500, detail=str(e))
     except Exception as e:
          print("DB Error: ", e)
          logger.debug(f"{e}")
          db.rollback()
          raise HTTPException(status_code=500, detail=f"Failed to add {username} to database")
     
     
@app.get("/get-user/{user_name}")
async def get_user_by_name(
     user_name: str,
     current_user: User = Depends(require_role("admin")),
     db: Session  = Depends(db_instance.get_db)
     ):
     try:
          result = SearchUser(user_name, db).search_user()
          return result
     except RuntimeError as e:
          logger.error(f"{e}")
          raise HTTPException(status_code=500, detail=str(e))
     except Exception as e:
          print("DB Error: ", e)
          logger.debug(f"{e}")
          db.rollback()
          raise HTTPException(status_code=500, detail=f"Failed to retreive user")
     
@app.put("/update-user/{user_id}")
async def update_user_info(user_id, db: Session = Depends(db_instance.get_db)):
     pass
     
     
@app.post("/add-supplier/")
async def add_supplier(
     name: str = Form(...),
     contact_person: str = Form(...),
     email: Optional[str] = Form(None),
     phone: Optional[str] = Form(None),
     address: Optional[str] = Form(None),
     is_active: bool = True,
     current_user: User = Depends(require_role("admin")),
     db: Session = Depends(db_instance.get_db)
):
     try:
          CreateSupplier(
               name,
               contact_person,
               email,
               phone,
               address,
               is_active,
               db).create_supplier()
          
          
          return JSONResponse(status_code=200, content={"status" :"success", "message": f"successfully added {name}"})
     except RuntimeError as e:
          logger.error(f"add_supplier_endpoint_Error: {e} ")
          raise HTTPException(status_code=500, detail=str(e))
     except Exception as e:
          logger.debug(f"add_supplier_endpoint_DB Error: {e}")
          #print("DB Error: ", e)
          db.rollback()
          raise HTTPException(status_code=500, detail=f"Failed to add {name} to database")

     
@app.get("/get-supplier/{supplier_id}")
async def get_supplier_by_id(
     supplier_id: int,
     db: Session  = Depends(db_instance.get_db)
     ):
     try:
          result = SearchSupplier(supplier_id, db).search_supplier()
          return result
     except RuntimeError as e:
          logger.error(f"{e}")
          raise HTTPException(status_code=500, detail=str(e))
     except Exception as e:
          print("DB Error: ", e)
          logger.debug(f"{e}")
          db.rollback()
          raise HTTPException(status_code=500, detail=f"Failed to retreive user")

     
@app.post("/add-product/")
async def add_product(
     name: str = Form(...),
     generic_name: str = Form(...),
     barcode: str = Form(...),
     category: Optional[str] = Form(None),
     description: Optional[str] = Form(None),
     unit_price: float =  Form(...),
     selling_price: float = Form(...),
     current_user: User = Depends(require_role("admin")),
     db: Session = Depends(db_instance.get_db)
):
     try:
          CreateProduct(
               name,
               generic_name,
               barcode,
               category,
               description,
               unit_price,
               selling_price,
               db).create_product()
          
          
          return JSONResponse(status_code=200, content={"status" :"success", "message": f"successfully added {name}"})
     except RuntimeError as e:
          logger.error(f"add_product_endpoint: {e}")
          raise HTTPException(status_code=500, detail=str(e))
     except Exception as e:
          #print("DB Error: ", e)
          logger.debug(f"add_product_endpoint_DB Error: {e}")
          db.rollback()
          raise HTTPException(status_code=500, detail=f"Failed to add {name} to database")

     
@app.get("/get-product/{barcode}")
async def get_product_by_barcode(
     barcode: str,
     db: Session  = Depends(db_instance.get_db)
     ):
     try:
          result = SearchProduct(barcode, db).search_product()
          return result
     except RuntimeError as e:
          logger.error(f"get_product_by_barcode_endpoint: {e}")
          raise HTTPException(status_code=500, detail=str(e))
     except Exception as e:
          logger.debug(f"get_product_by_barcode_endpoint_DB Error: {e}")
          db.rollback()
          raise HTTPException(status_code=500, detail=f"Failed to retreive product")
     
     
@app.post("/add-stock-batch/")
async def add_stock_batch(
     product_id : int = Form(...),
     batch_number: str = Form(...),
     lot_number: Optional[str] = Form(None),
     quantity: int = Form(...),
     manufacturing_date: date = Form(...),
     expiry_date: date = Form(...),
     supplier_id: int = Form(...),
     current_user: User = Depends(require_role("admin")),
     db: Session = Depends(db_instance.get_db)
):
     
     try:
          stock = CreateStochBatch(
               product_id,
               batch_number,
               lot_number,
               quantity,
               manufacturing_date,
               expiry_date,
               supplier_id,
               db
          ).create_stock_batch()
          logger.info(f"Successfully Created Stoch Batch with id {stock.id}")
          return JSONResponse(status_code=200, content={"status" :"success", "message": f"successfully added {batch_number}"})
     except RuntimeError as e:
          logger.error(f"add_stock_batch_endpoint: {e}") 
          raise HTTPException(status_code=500, detail=str(e))
     except Exception as e:
          logger.debug(f"add_stock_batch_endpoint_DB Error: {e}")
          db.rollback()
          raise HTTPException(status_code=500, detail=f"Failed to add {batch_number} to database")

@app.post("/add-customer/")
async def add_customer(
     first_name: Optional[str] = Form(...),
     last_name: Optional[str] = Form(...),
     phone: Optional[str] = Form(...),
     email: Optional[str] = Form(...),
     date_of_birth: Optional[date] = Form(...),
     address: Optional[str] = Form(...),
     current_user: User = Depends(require_role("admin", "cashier")),
     db: Session = Depends(db_instance.get_db)     
):
     try:
          CreateCustomer(
               first_name,
               last_name,
               phone,
               email,
               date_of_birth,
               address,
               db
          ).create_customer()
          return JSONResponse(status_code=200, content={"status" :"success", "message": f"successfully added {first_name}"})
     except RuntimeError as e:
          logger.error(f"add_customer_endpoint: {e}") 
          raise HTTPException(status_code=500, detail=str(e))
     except Exception as e:
          logger.debug(f"add_customer_endpoint_DB Error: {e}")
          db.rollback()
          raise HTTPException(status_code=500, detail=f"Failed to add {first_name} to database")
@app.post("/add-sale/")
async def add_sale(
     customer_id: int = Form(...),
     payment_method: str = Form(...),
     payment_status: str = Form(...),
     notes : str = Form(...),
     db: Session = Depends(db_instance.get_db),
     current_user: User = Depends(require_role("admin", "cashier"))
):
     
     try:
                    
          sale = CreateSale(
               customer_id,
               payment_method,
               payment_status,
               notes,
               db,
               current_user.id
          ).create_sale()   
          return JSONResponse(status_code=200, content={"status" :"success", "message": f"successfully added {sale.id}"})
     
     except RuntimeError as e:
          logger.error(f"{e}")
          raise HTTPException(status_code=500, detail=str(e))
     except Exception as e:
          print("DB Error: ", e)
          logger.debug(f"{e}")
          db.rollback()
          raise HTTPException(status_code=500, detail=f"Failed to add sale")

class SaleItemCreate(BaseModel):
     sale_id: int
     barcodes : List[str] 
     batch_ids : List[int] 
     quantities: List[int]
    
@app.post("/add-sale-item/")
async def add_sale_item(
     sale_items: SaleItemCreate,
      db: Session = Depends(db_instance.get_db)
):
     
     try:
          CreateSaleItem(
               sale_items.sale_id, 
               sale_items.barcodes, 
               sale_items.batch_ids, 
               sale_items.quantities, 
               db
          ).create_sale_item()
          
          return JSONResponse(status_code=200, content={"status" :"success", "message": f"successfully added sale id {sale_items.sale_id}"})
     except RuntimeError as e:
          logger.error(f"{e}") 
          raise HTTPException(status_code=500, detail=str(e))
     except Exception as e:
          print("DB Error: ", e)
          logger.debug(f"{e}")
          db.rollback()
          raise HTTPException(status_code=500, detail=f"Failed to add {sale_items.sale_id} to database")


@app.post("/delete-user/")
async def delete_user(
     user_id: int,
     current_user: User = Depends(require_role("admin")),
     db: Session = Depends(db_instance.get_db)
):
     try:
          DeleteUser(
               user_id,
               db
          ).delete_user()
          return JSONResponse(status_code=200, content={"status" :"success", "message": f"successfully deleted user, id ={user_id}"})
     except RuntimeError as e:
          logger.error(f"{e}") 
          raise HTTPException(status_code=500, detail=str(e))
     except Exception as e:
          print("DB Error: ", e)
          logger.debug(f"{e}")
          db.rollback()
          raise HTTPException(status_code=500, detail=f"Failed to delete user, id = {user_id}")

if __name__ == "__main__":
     import uvicorn
     uvicorn.run("main:app", host="127.0.0.1", port=8000, reload=True)