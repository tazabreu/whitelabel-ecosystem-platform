-- Staging model for analytics events
-- Cleans and standardizes raw event data

{{ config(
    materialized='view',
    tags=['staging', 'analytics']
) }}

with source as (
    -- Use sample data for local development
    -- In production, switch to: select * from {{ source('analytics', 'analytics_events') }}
    select * from {{ ref('sample_events') }}
),

cleaned as (
    select
        -- IDs
        event_id,
        journey_id,
        user_ecosystem_id,
        
        -- Event classification
        event_name,
        domain,
        entity,
        action,
        
        -- Timestamps
        cast(timestamp as timestamp) as event_timestamp,
        
        -- Tracing
        trace_id,
        span_id,
        source as source_service,
        
        -- Metadata
        metadata,
        
        -- Derived fields
        date_trunc('day', cast(timestamp as timestamp)) as event_date,
        date_trunc('hour', cast(timestamp as timestamp)) as event_hour
        
    from source
    where event_id is not null
)

select * from cleaned

