# Project Tasks & Deliverables

## Task 1 - Data Scraping and Collection (Extract & Load) ✅
**Objective**: Build a data scraping pipeline that extracts messages and images from Telegram channels and stores them in a raw data lake.

**Instructions**:
1.  **Set Up Telegram API Access**
    *   Register at my.telegram.org.
    *   Configure Telethon.
2.  **Telegram Scraping**
    *   Extract data from:
        *   CheMed Telegram Channel
        *   https://t.me/lobelia4cosmetics
        *   https://t.me/tikvahpharma
        *   And others from https://et.tgstat.com/medicine
    *   Extract: Message ID, date, text, view count, forward count, media info.
3.  **Download Images**
    *   Store in `data/raw/images/{channel_name}/{message_id}.jpg`
4.  **Populate Data Lake**
    *   Store raw JSON in `data/raw/telegram_messages/YYYY-MM-DD/channel_name.json`
5.  **Implement Logging**
    *   Log activity and errors to `logs/`.

**Deliverables**:
*   `src/scraper.py`
*   Raw JSON files
*   Downloaded images
*   Log files

---

## Task 2 - Data Modeling and Transformation (Transform)
**Objective**: Transform raw data into a structured data warehouse using dbt and dimensional modeling.

**Instructions**:
1.  **Load Raw Data to PostgreSQL**
    *   Script to load JSON to `raw.telegram_messages`.
2.  **Initialize dbt Project**
    *   `dbt init medical_warehouse`
3.  **Create Staging Models** (`models/staging/`)
    *   Clean, standardize, cast types, rename columns.
4.  **Design Star Schema** (`models/marts/`)
    *   Dimension Tables: `dim_channels`, `dim_dates`
    *   Fact Table: `fct_messages`
5.  **Implement dbt Tests**
    *   `unique`, `not_null`, relationships.
6.  **Create Custom Data Test**
    *   e.g., `assert_no_future_messages.sql`
7.  **Generate Documentation**
    *   `dbt docs generate`

**Deliverables**:
*   dbt project
*   Passing tests
*   Documentation
*   Report section on schema design

---

## Task 3 - Data Enrichment with Object Detection (YOLO)
**Objective**: Use computer vision to analyze images.

**Instructions**:
1.  **Set Up YOLO** (`ultralytics`)
2.  **Implement Object Detection Script** (`src/yolo_detect.py`)
    *   Run YOLOv8 on images.
    *   Save results to CSV.
3.  **Create Classification Scheme**
    *   Promotional, Product Display, Lifestyle, Other.
4.  **Integrate with Data Warehouse**
    *   Create `models/marts/fct_image_detections.sql`.
5.  **Analyze Results**

**Deliverables**:
*   `src/yolo_detect.py`
*   Detection CSV
*   dbt model
*   Analysis in report

---

## Task 4 - Build an Analytical API
**Objective**: Expose data through a REST API.

**Instructions**:
1.  **Set Up FastAPI**
2.  **Implement Endpoints**
    *   Top Products
    *   Channel Activity
    *   Message Search
    *   Visual Content Stats
3.  **Add Data Validation** (Pydantic)
4.  **Document the API** (Swagger/OpenAPI)

**Deliverables**:
*   `api/main.py`
*   4 endpoints
*   Pydantic schemas
*   Documentation screenshots

---

## Task 5 - Pipeline Orchestration
**Objective**: Automate pipeline with Dagster.

**Instructions**:
1.  **Install Dagster**
2.  **Define Pipeline as Dagster Job**
    *   Ops: Scrape, Load, Transform, Enrich.
3.  **Create Job Graph**
4.  **Launch and Test**
5.  **Add Scheduling**

**Deliverables**:
*   Dagster pipeline definition
*   UI screenshots
