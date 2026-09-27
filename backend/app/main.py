"""
PRALAYA: Predictive Resilience & Adaptive Local Action AI
FastAPI Production Application Entrypoint
"""

import time
import uuid
from contextlib import asynccontextmanager
from fastapi import FastAPI, Request, status
from fastapi.exceptions import RequestValidationError
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse
from starlette.exceptions import HTTPException as StarletteHTTPException

from app.config import settings
from app.logging import setup_logging, logger
from app.api.v1 import api_v1_router
from app.api.v1.health import router as root_health_router
from app.schemas.common import ProblemDetails, ErrorDetail


import os
import sys

# Ensure project root is available for geospatial imports
root_dir = os.path.dirname(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))
if root_dir not in sys.path:
    sys.path.insert(0, root_dir)

@asynccontextmanager
async def lifespan(app: FastAPI):
    # Application startup
    setup_logging()
    logger.info(f"Starting {settings.PROJECT_NAME} (Version: {settings.VERSION})")
    logger.info(f"Active Environment: {settings.ENVIRONMENT} | API Prefix: {settings.API_V1_STR}")
    logger.info(f"Allowed CORS Origins: {settings.CORS_ORIGINS}")
    
    # Initialize Earth Engine / Geospatial Data Service
    try:
        from geospatial.services import get_geospatial_service
        geo_service = get_geospatial_service()
        await geo_service.initialize()
        status_info = geo_service.get_service_status()
        logger.info(f"Geospatial Service initialized: {status_info['active_provider_mode']} (GEE Active: {status_info['primary_gee_available']})")
    except Exception as e:
        logger.warning(f"Geospatial service initialization notice: {e}")
        
    yield
    # Application shutdown
    logger.info("Shutting down PRALAYA backend services cleanly.")


app = FastAPI(
    title=settings.PROJECT_NAME,
    version=settings.VERSION,
    description=settings.DESCRIPTION,
    docs_url="/docs",
    redoc_url="/redoc",
    openapi_url=f"{settings.API_V1_STR}/openapi.json",
    lifespan=lifespan
)

# Safe CORS Middleware Configuration
app.add_middleware(
    CORSMiddleware,
    allow_origins=settings.CORS_ORIGINS,
    allow_credentials=True,
    allow_methods=["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"],
    allow_headers=["*"],
    expose_headers=["X-Request-ID", "X-Response-Time"]
)


# Request Correlation ID & Performance Logging Middleware
@app.middleware("http")
async def correlation_and_timing_middleware(request: Request, call_next):
    request_id = request.headers.get("X-Request-ID", str(uuid.uuid4()))
    start_time = time.time()
    
    response = await call_next(request)
    
    duration = time.time() - start_time
    response.headers["X-Request-ID"] = request_id
    response.headers["X-Response-Time"] = f"{duration:.4f}s"
    
    if request.url.path not in ["/health", "/api/v1/health"]:
        logger.info(f"{request.method} {request.url.path} -> {response.status_code} ({duration * 1000:.1f}ms) [ReqID: {request_id[:8]}]")
        
    return response


# Global Exception Handlers (RFC 7807 Problem Details)
@app.exception_handler(StarletteHTTPException)
async def http_exception_handler(request: Request, exc: StarletteHTTPException):
    problem = ProblemDetails(
        type=f"https://pralaya.ai/errors/http-{exc.status_code}",
        title=exc.detail if isinstance(exc.detail, str) else "HTTP Request Error",
        status=exc.status_code,
        detail=str(exc.detail),
        instance=str(request.url.path),
        error_code=f"ERR_HTTP_{exc.status_code}"
    )
    return JSONResponse(status_code=exc.status_code, content=problem.model_dump(mode="json"))


@app.exception_handler(RequestValidationError)
async def validation_exception_handler(request: Request, exc: RequestValidationError):
    errors = [
        ErrorDetail(loc=[str(p) for p in err["loc"]], msg=err["msg"], type=err["type"])
        for err in exc.errors()
    ]
    problem = ProblemDetails(
        type="https://pralaya.ai/errors/validation-error",
        title="Request Validation Failed",
        status=status.HTTP_422_UNPROCESSABLE_ENTITY,
        detail="One or more fields in request parameters or body failed schema validation.",
        instance=str(request.url.path),
        error_code="ERR_VALIDATION_FAILURE",
        invalid_params=errors
    )
    return JSONResponse(status_code=status.HTTP_422_UNPROCESSABLE_ENTITY, content=problem.model_dump(mode="json"))


@app.exception_handler(Exception)
async def unhandled_exception_handler(request: Request, exc: Exception):
    logger.exception(f"Unhandled server exception on {request.method} {request.url.path}: {exc}")
    problem = ProblemDetails(
        type="https://pralaya.ai/errors/internal-server-error",
        title="Internal Server Error",
        status=status.HTTP_500_INTERNAL_SERVER_ERROR,
        detail="An unexpected internal error occurred. Our incident response team has been alerted.",
        instance=str(request.url.path),
        error_code="ERR_INTERNAL_EXCEPTION"
    )
    return JSONResponse(status_code=status.HTTP_500_INTERNAL_SERVER_ERROR, content=problem.model_dump(mode="json"))


# Root metadata endpoint
@app.get("/", tags=["System"])
async def root():
    return {
        "platform": settings.PROJECT_NAME,
        "version": settings.VERSION,
        "docs": "/docs",
        "api_v1": settings.API_V1_STR,
        "health": "/health",
        "status": "OPERATIONAL"
    }


# Mount root health router (for standard probes: /health, /api/health)
app.include_router(root_health_router)

# Mount Versioned API (e.g. /api/v1/*)
app.include_router(api_v1_router, prefix=settings.API_V1_STR)
