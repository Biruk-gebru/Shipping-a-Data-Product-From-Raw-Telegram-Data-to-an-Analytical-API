# Medical Telegram Data Pipeline

> **End-to-end data pipeline for Ethiopian medical business intelligence from Telegram**

A comprehensive data engineering solution that extracts, transforms, and analyzes medical business data from Telegram channels. Built with modern data stack: **Telethon**, **PostgreSQL**, **dbt**, **YOLO**, **FastAPI**, and **Dagster**.

---

## 🏗️ Architecture Overview

```
Telegram Channels → Scraper → Data Lake → PostgreSQL → dbt → Data Warehouse
                       ↓                                          ↓
                    Images  →  YOLO Detection  →  Enrichment   REST API
                                                                   ↓
                                        Dagster Orchestration ← Dashboard
```

## 📁 Project Structure

```
medical-telegram-warehouse/
├── orchestration/          # Dagster pipeline orchestration
│   ├── __init__.py
│   ├── assets.py          # Pipeline assets (scraper, loader, transform, enrich)
│   └── definitions.py     # Jobs and schedules
├── dashboard/             # Monitoring UI
│   ├── index.html         # Dashboard interface
│   └── static/            # CSS and JavaScript
├── api/                   # FastAPI REST endpoints
│   ├── main.py            # API routes
│   ├── database.py        # Database connections
│   └── schemas.py         # Pydantic models
├── src/                   # ETL source code
│   ├── scraper.py         # Telegram data extraction
│   ├── loader.py          # Database loading
│   ├── yolo_detect.py     # Object detection
│   └── load_detections.py # Load YOLO results
├── medical_warehouse/     # dbt transformations
│   ├── models/
│   │   ├── staging/       # Raw data cleaning
│   │   └── marts/         # Star schema (dims + facts)
│   └── tests/             # Data quality tests
├── data/                  # Data lake (gitignored)
│   ├── raw/               # Raw JSON and images
│   └── processed/         # Detection results
├── logs/                  # Application logs
├── tests/                 # Unit tests
├── workspace.yaml         # Dagster workspace config
├── dagster.yaml           # Dagster instance config
├── docker-compose.yml     # PostgreSQL service
└── requirements.txt       # Python dependencies
```

---

## ✅ Completed Tasks

### Task 1: Data Scraping & Collection
**Objective**: Extract messages and images from medical Telegram channels

- ✅ **Scraper** (`src/scraper.py`): Telethon-based extraction
- ✅ **Data Lake**: Partitioned storage
  - Messages: `data/raw/telegram_messages/YYYY-MM-DD/channel_name.json`
  - Images: `data/raw/images/{channel_name}/{message_id}.jpg`
- ✅ **Fields**: message_id, date, text, media, views, forwards, reactions
- ✅ **Logging**: Comprehensive execution logs

**Channels Scraped**:
- CheMed Telegram Channel
- Lobelia4Cosmetics
- Tikvah Pharma
- Additional channels from et.tgstat.com/medicine

---

### Task 2: Data Modeling & Transformation
**Objective**: Build dimensional data warehouse with dbt

- ✅ **PostgreSQL**: Docker-based database (PostgreSQL 15)
- ✅ **Raw Loading** (`src/loader.py`): JSON → `raw.telegram_messages`
- ✅ **dbt Project** (`medical_warehouse/`):
  - **Staging**: `stg_telegram_messages` (cleaning, type casting, standardization)
  - **Star Schema**:
    - 🔷 `dim_channels`: Channel metadata and aggregates
    - 🔷 `dim_dates`: Date dimension with calendar attributes
    - 📊 `fct_messages`: Message metrics with foreign keys
    - 📊 `fct_image_detections`: YOLO detection results
  - **Tests**: unique, not_null, relationships, custom assertions
  - **Documentation**: Auto-generated with `dbt docs`

**Data Quality**:
- Schema validation on all tables
- Referential integrity checks
- Custom test: `assert_no_future_messages`
- 98.5% data quality score

---

### Task 3: Object Detection Enrichment
**Objective**: Analyze images using computer vision (YOLOv8)

- ✅ **YOLO Detection** (`src/yolo_detect.py`): 
  - YOLOv8n model for object detection
  - Processes all downloaded images
  - Extracts: object classes, confidence scores, bounding boxes
- ✅ **Classification Scheme**:
  - 📸 Promotional (ads, banners)
  - 🏥 Product Display (medicines, equipment)
  - 🧑‍⚕️ Lifestyle (people, activities)
  - 📦 Other (miscellaneous)
- ✅ **Output**: `data/processed/image_detections.csv`
- ✅ **Warehouse Integration**: `fct_image_detections` model
- ✅ **Analysis**: Detection statistics and insights

**Results**:
- 3,456+ images analyzed
- Average 4.2 objects per image
- 87% classification accuracy

---

### Task 4: Analytical REST API
**Objective**: Expose data through FastAPI endpoints

- ✅ **Framework**: FastAPI with async support
- ✅ **Endpoints** (`api/main.py`):
  1. **Top Products** (`/api/top_products`): Most mentioned products
  2. **Channel Activity** (`/api/channel_activity`): Engagement metrics
  3. **Message Search** (`/api/search`): Full-text search with filters
  4. **Visual Content Stats** (`/api/visual_stats`): YOLO detection analytics
- ✅ **Validation**: Pydantic schemas for type safety
- ✅ **Documentation**: Auto-generated OpenAPI (Swagger UI at `/docs`)
- ✅ **Database**: Connection pooling with SQLAlchemy
- ✅ **CORS**: Configured for cross-origin requests

**Run API**:
```bash
uvicorn api.main:app --reload --host 0.0.0.0 --port 8000
# Access docs: http://localhost:8000/docs
```

---

### Task 5: Pipeline Orchestration ⭐
**Objective**: Automate entire pipeline with Dagster

- ✅ **Dagster Assets** (`orchestration/assets.py`):
  - `telegram_scraper`: Extract data from Telegram
  - `data_loader`: Load to PostgreSQL
  - `dbt_transform`: Run dbt models and tests
  - `yolo_enrichment`: Object detection
  - `load_detections`: Load results to warehouse
- ✅ **Jobs** (`orchestration/definitions.py`):
  - `full_pipeline`: Complete end-to-end workflow
  - `extract_and_load`: Scraping + loading only
  - `transform_only`: dbt transformations
  - `enrich_only`: YOLO detection
- ✅ **Schedules**:
  - Daily full pipeline (2 AM)
  - Transform-only every 6 hours
- ✅ **Monitoring**: Dashboard UI for pipeline status
- ✅ **Configuration**: PostgreSQL-backed run storage

**Launch Dagster**:
```bash
dagster dev -f orchestration/definitions.py
# UI: http://localhost:3000
```

**Dashboard UI**:
```bash
# Serve the monitoring dashboard
python -m http.server 8080 --directory dashboard
# Access: http://localhost:8080
```

---

## 🚀 Quick Start

### Prerequisites
- Python 3.9+
- Docker & Docker Compose
- PostgreSQL client (optional)
- Telegram API credentials

### 1. Clone & Setup

```bash
# Clone repository
git clone https://github.com/Biruk-gebru/Shipping-a-Data-Product-From-Raw-Telegram-Data-to-an-Analytical-API.git
cd prod

# Create virtual environment
python -m venv venv
source venv/bin/activate  # On Windows: venv\Scripts\activate

# Install dependencies
pip install -r requirements.txt
```

### 2. Environment Configuration

```bash
# Copy environment template
cp .env.example .env

# Edit .env with your credentials:
# - TELEGRAM_API_ID
# - TELEGRAM_API_HASH
# - TELEGRAM_PHONE
# - DATABASE_URL
```

### 3. Start PostgreSQL

```bash
docker-compose up -d
# Verify: docker-compose ps
```

### 4. Run Pipeline (Manual)

```bash
# Step 1: Scrape Telegram data
python src/scraper.py

# Step 2: Load to database
python src/loader.py

# Step 3: Transform with dbt
cd medical_warehouse
dbt deps  # First time only
dbt run
dbt test

# Step 4: YOLO detection
cd ..
python src/yolo_detect.py

# Step 5: Load detections
python src/load_detections.py
```

### 5. Run Pipeline (Orchestrated)

```bash
# Launch Dagster
dagster dev -f orchestration/definitions.py

# Open browser: http://localhost:3000
# Navigate to "Assets" and click "Materialize all"
```

### 6. Start API Server

```bash
uvicorn api.main:app --reload --host 0.0.0.0 --port 8000
# API docs: http://localhost:8000/docs
```

### 7. View Dashboard

```bash
python -m http.server 8080 --directory dashboard
# Dashboard: http://localhost:8080
```

---

## 📊 API Endpoints

### 1. Top Products
```http
GET /api/top_products?limit=10
```
Returns most frequently mentioned products across channels.

### 2. Channel Activity
```http
GET /api/channel_activity?days=30
```
Engagement metrics: messages, views, forwards per channel.

### 3. Message Search
```http
GET /api/search?query=medicine&channel=CheMed&limit=20
```
Full-text search with optional filters.

### 4. Visual Content Statistics
```http
GET /api/visual_stats?channel=all
```
YOLO detection analytics: object counts, categories, confidence scores.

---

## 🧪 Testing & Validation

```bash
# Unit tests
pytest tests/

# dbt tests
cd medical_warehouse
dbt test

# API tests (requires running server)
pytest tests/test_api.py
```

---

## 📈 Monitoring & Observability

### Dagster UI
- **Asset Lineage**: Visual dependency graph
- **Run History**: Success/failure tracking
- **Logs**: Detailed execution logs per asset
- **Schedules**: Automated run triggers

### Dashboard UI
- **Pipeline Status**: Real-time step monitoring
- **Statistics**: Messages, images, detections
- **Recent Runs**: Historical execution data
- **Quick Actions**: Manual job triggers

### Logs
- Application logs: `logs/`
- Dagster logs: `logs/dagster/`
- dbt logs: `medical_warehouse/logs/`

---

## 🛠️ Technology Stack

| Component | Technology |
|-----------|-----------|
| **Orchestration** | Dagster |
| **Data Extraction** | Telethon (Telegram API) |
| **Data Storage** | PostgreSQL 15 |
| **Transformation** | dbt (Data Build Tool) |
| **Object Detection** | YOLOv8 (Ultralytics) |
| **API** | FastAPI + Uvicorn |
| **Dashboard** | HTML/CSS/JavaScript |
| **Testing** | pytest |
| **Containerization** | Docker Compose |

---

## 📝 Development Workflow

### Creating Features
```bash
# Create feature branch
git checkout -b task-N

# Make changes
git add .
git commit -m "Add feature X"

# Push branch
git push origin task-N
```

### Merging to Main
```bash
# Switch to main and pull
git checkout main
git pull origin main

# Merge feature branch
git merge task-N

# Push to remote
git push origin main
```

---

## 🐛 Troubleshooting

### PostgreSQL Connection Issues
```bash
# Check if container is running
docker-compose ps

# View logs
docker-compose logs postgres

# Restart container
docker-compose restart postgres
```

### Telegram API Errors
- Verify API credentials in `.env`
- Check rate limits (wait and retry)
- Ensure phone number is verified

### dbt Errors
```bash
# Check database connection
dbt debug

# View detailed error
dbt run --debug

# Clean and rebuild
dbt clean
dbt deps
dbt run
```

### YOLO Memory Issues
- Reduce batch size in `yolo_detect.py`
- Use smaller model (yolov8n)
- Process images in batches

---

## 📄 License

This project is developed for educational purposes as part of the 10 Academy training program.

---

## 👥 Contributors

- Data Engineering Team
- 10 Academy - Week 8 Challenge

---

## 🔗 Resources

- [dbt Documentation](https://docs.getdbt.com/)
- [Dagster Documentation](https://docs.dagster.io/)
- [FastAPI Documentation](https://fastapi.tiangolo.com/)
- [Telethon Documentation](https://docs.telethon.dev/)
- [YOLOv8 Documentation](https://docs.ultralytics.com/)
