from sqlalchemy import Column, Index, Integer, ForeignKey, String,text, TIMESTAMP, Text, JSON
from sqlalchemy.orm import relationship
from .base import BASE, audit_ip, audit_user_id
from .log import logger

#BASE = declarative_base()


class AuditLog(BASE):
    __tablename__ = "audit_logs"
    id = Column(Integer, primary_key=True, autoincrement=True)
    user_id = Column(Integer, ForeignKey("users.id", ondelete="SET NULL"))
    action = Column(String(50), nullable=False)
    table_name = Column(String(50))
    record_id = Column(Integer)
    old_values = Column(JSON)
    new_values = Column(JSON)
    ip_address = Column(String(50))
    timestamp = Column(TIMESTAMP, server_default=text("CURRENT_TIMESTAMP"))
    
    user = relationship("User", back_populates="audit_logs")


    
    __table_args__ = (
        Index("idx_timestamp","timestamp"),
        Index("idx_user","user_id"),
        Index("idx_table_name", "table_name"),
        Index("idx_record_id", "record_id")
    )
    
class WriteAuditLogs:
    
    def __init__(self, db, action, table_name=None, record_id=None, old=None, new=None):
        self.db = db
        self.action = action
        self.table_name = table_name
        self.record_id = record_id
        self.old = old
        self.new = new
        
    def write_audit_log(self):
        log = AuditLog(
            user_id = audit_user_id.get(),
            action = self.action,
            table_name = self.table_name,
            old_values = self.old,
            new_values = self.new,
            ip_address = audit_ip.get()
        )
        if not log:
            logger.error("Faild to add Auditlog")
        self.db.add(log)
        self.db.commit()
    
    
class SystemSetting(BASE):
    __tablename__ = "system_settings"
    id = Column(Integer, primary_key=True, autoincrement=True)
    setting_key = Column(String(50), unique=True, nullable=False)
    setting_value = Column(String(50), nullable=False)
    updated_at = Column(TIMESTAMP, nullable=False, server_default=text("CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP"))