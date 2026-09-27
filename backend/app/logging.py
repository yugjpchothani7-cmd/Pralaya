"""
PRALAYA Structured Logging Setup
"""

import logging
import sys
from app.config import settings


def setup_logging():
    log_level = getattr(logging, settings.LOG_LEVEL.upper(), logging.INFO)
    
    # Custom format with ISO timestamps and module tracking
    log_format = "%(asctime)s | %(levelname)-7s | %(name)s:%(lineno)d | %(message)s"
    date_format = "%Y-%m-%d %H:%M:%S"
    
    logging.basicConfig(
        level=log_level,
        format=log_format,
        datefmt=date_format,
        handlers=[
            logging.StreamHandler(sys.stdout)
        ]
    )
    
    # Silence overly verbose third-party loggers
    logging.getLogger("uvicorn.access").setLevel(logging.WARNING)
    logging.getLogger("uvicorn.error").setLevel(logging.INFO)
    
    logger = logging.getLogger("pralaya")
    logger.info(f"Logging initialized at level: {settings.LOG_LEVEL} for environment: {settings.ENVIRONMENT}")
    return logger


logger = logging.getLogger("pralaya")
