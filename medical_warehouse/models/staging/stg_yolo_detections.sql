with source as (
    select * from {{ source('medical_warehouse', 'yolo_detections') }}
),

renamed as (
    select
        id,
        image_path,
        channel_name,
        message_id,
        label as detection_class,
        confidence,
        x_min,
        y_min,
        x_max,
        y_max,
        ingested_at
    from source
)

select * from renamed
