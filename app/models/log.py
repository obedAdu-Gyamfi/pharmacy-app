import logging
from datetime import datetime , timedelta, date
import os
from pathlib import Path





base_path = Path(__file__).resolve().parent.parent.parent

today = datetime.today()

logfile = f"{base_path}/logs/{today.month:02d}-{today.day:02d}-{today.year }.log"

logging.basicConfig(level=logging.DEBUG)
logger = logging.getLogger("PHARMACYLOGGER")

file_handler = logging.FileHandler(logfile)
file_handler.setLevel(logging.DEBUG)
logger.addHandler(file_handler)
formatter = logging.Formatter("%(asctime)s: %(levelname)s - %(message)s")
file_handler.setFormatter(formatter)
 
