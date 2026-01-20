# Medical Data Warehouse API

A FastAPI-based REST API for accessing analytics from the medical Telegram data warehouse.

## Overview

This API provides endpoints to query data from the data warehouse built with dbt, including message analytics, product detection, and visual content statistics.

## Installation

```bash
pip install -r requirements.txt
```

## Running the API

```bash
# From the project root directory
uvicorn api.main:app --host 127.0.0.1 --port 8000 --reload
```

The API will be available at `http://127.0.0.1:8000`

## API Documentation

Once the server is running, visit:
- **Swagger UI**: `http://127.0.0.1:8000/docs`
- **ReDoc**: `http://127.0.0.1:8000/redoc`

## Endpoints

### 1. Health Check
**GET** `/health`

Check if the API is running.

**Response:**
```json
{
  "status": "ok"
}
```

### 2. Channel Activity
**GET** `/channels/activity`

Get message counts per channel, ordered by activity.

**Response:**
```json
[
  {
    "channel_name": "lobelia4cosmetics",
    "message_count": 200
  },
  {
    "channel_name": "tikvahpharma",
    "message_count": 200
  }
]
```

### 3. Top Products
**GET** `/products/top`

Get top detected products from images (based on YOLO object detection).

**Response:**
```json
[
  {
    "product_name": "bottle",
    "count": 338
  },
  {
    "product_name": "cup",
    "count": 4
  }
]
```

### 4. Message Search
**GET** `/messages/search?keyword={search_term}`

Search messages by keyword (case-insensitive).

**Parameters:**
- `keyword` (string, required): Search term to find in message text

**Example:**
```bash
curl "http://127.0.0.1:8000/messages/search?keyword=health"
```

**Response:**
```json
[
  {
    "message_id": 12345,
    "channel_name": "lobelia4cosmetics",
    "message_text": "Health and wellness products...",
    "views": 150,
    "message_date": "2025-01-15T10:30:00"
  }
]
```

### 5. Visual Content Statistics
**GET** `/visual/stats`

Get statistics on visual content types (Product Display, Lifestyle, Promotional, Other).

**Response:**
```json
[
  {
    "category": "Product Display",
    "count": 342
  },
  {
    "category": "Lifestyle",
    "count": 163
  },
  {
    "category": "Other",
    "count": 90
  },
  {
    "category": "Promotional",
    "count": 36
  }
]
```

## Architecture

- **FastAPI**: Modern, high-performance web framework
- **Pydantic**: Data validation using Python type hints
- **SQLAlchemy**: Database connectivity and ORM
- **PostgreSQL**: Data warehouse database (dbt_dev schema)

## Project Structure

```
api/
├── main.py       # FastAPI application and endpoint definitions
├── database.py   # Database connection and session management
├── schemas.py    # Pydantic models for request/response validation
└── README.md     # This file
```

## Environment Variables

The API requires the following environment variables (defined in `.env`):
- `POSTGRES_USER`: Database username
- `POSTGRES_PASSWORD`: Database password
- `POSTGRES_DB`: Database name
- `POSTGRES_HOST`: Database host
- `POSTGRES_PORT`: Database port

## Development

For development with auto-reload:
```bash
uvicorn api.main:app --reload --host 127.0.0.1 --port 8000
```

## Testing

Test endpoints using curl:
```bash
# Health check
curl http://127.0.0.1:8000/health

# Channel activity
curl http://127.0.0.1:8000/channels/activity

# Top products
curl http://127.0.0.1:8000/products/top

# Search messages
curl "http://127.0.0.1:8000/messages/search?keyword=health"

# Visual stats
curl http://127.0.0.1:8000/visual/stats
```
