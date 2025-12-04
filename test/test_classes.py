import unittest
from pathlib import Path
import os
from app.models.database import DB
from app.main import get_product_by_id
import sys
from pathlib import Path
sys.path.append(str(Path(__file__).resolve().parent.parent))

db_instance = DB(activate = True)

db_instance.db_init()

class TestApp(unittest.TestCase):
    
    @classmethod
    def setUpClass(cls):
        
        cls.session=db_instance.get_db()
        
    @classmethod
    def tearDownClass(cls):
        cls.session.close()
        
        
    def test_get_product_by_id(self):
        session = db_instance.get_db()
        result = get_product_by_id(1, db=session)
        
        expected = {
            "status" : "success",
            "data":{
            "name": "Paracetamol",
            "supplier": "Tobinco",
            "expiry_date": "2025-11-29",
            "reorder_level": 2,
            "description": "Subsidizes pain"
            }
        }
        self.assertEqual(result, expected)
        
        
if __name__ == "__main__":
    unittest.main()