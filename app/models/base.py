from sqlalchemy.orm import declarative_base
from contextvars import ContextVar

BASE = declarative_base()

audit_user_id = ContextVar("audit_user_id", default=None)
audit_ip = ContextVar("audit_ip", default=None)