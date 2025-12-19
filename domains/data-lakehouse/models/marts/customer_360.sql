-- Customer 360 View
-- Aggregates user activity across all domains into a single view

{{ config(
    materialized='table',
    tags=['marts', 'customer360']
) }}

with events as (
    select * from {{ ref('stg_analytics_events') }}
    where user_ecosystem_id is not null
),

-- User journey summary
journey_summary as (
    select
        user_ecosystem_id,
        count(distinct journey_id) as total_journeys,
        count(*) as total_events,
        min(event_timestamp) as first_seen_at,
        max(event_timestamp) as last_seen_at
    from events
    group by user_ecosystem_id
),

-- Domain activity counts
domain_activity as (
    select
        user_ecosystem_id,
        domain,
        count(*) as event_count
    from events
    group by user_ecosystem_id, domain
),

domain_pivot as (
    select
        user_ecosystem_id,
        sum(case when domain = 'user' then event_count else 0 end) as user_domain_events,
        sum(case when domain = 'credit-card' then event_count else 0 end) as credit_card_domain_events,
        sum(case when domain = 'platform' then event_count else 0 end) as platform_events,
        sum(case when domain = 'analytics' then event_count else 0 end) as analytics_events
    from domain_activity
    group by user_ecosystem_id
),

-- Credit card activity
credit_card_activity as (
    select
        user_ecosystem_id,
        sum(case when event_name = 'purchase_simulated' then 1 else 0 end) as total_purchases,
        sum(case when event_name = 'limit_raised' then 1 else 0 end) as limit_raises,
        sum(case when event_name = 'account_reset' then 1 else 0 end) as account_resets,
        sum(case when event_name = 'onboarding_signed' then 1 else 0 end) as onboarding_completions
    from events
    where domain = 'credit-card'
    group by user_ecosystem_id
),

-- Final customer 360 view
customer_360 as (
    select
        js.user_ecosystem_id,
        
        -- Journey metrics
        js.total_journeys,
        js.total_events,
        js.first_seen_at,
        js.last_seen_at,
        
        -- Engagement score (simple formula for MVP)
        (js.total_events * 1.0 / nullif(js.total_journeys, 0)) as avg_events_per_journey,
        
        -- Domain activity breakdown
        coalesce(dp.user_domain_events, 0) as user_domain_events,
        coalesce(dp.credit_card_domain_events, 0) as credit_card_domain_events,
        coalesce(dp.platform_events, 0) as platform_events,
        
        -- Credit card specific metrics
        coalesce(cca.total_purchases, 0) as total_purchases,
        coalesce(cca.limit_raises, 0) as limit_raises,
        coalesce(cca.account_resets, 0) as account_resets,
        coalesce(cca.onboarding_completions, 0) as onboarding_completions,
        
        -- Activity flags
        case when cca.onboarding_completions > 0 then true else false end as has_credit_card,
        
        -- Timestamps
        current_timestamp as updated_at
        
    from journey_summary js
    left join domain_pivot dp on js.user_ecosystem_id = dp.user_ecosystem_id
    left join credit_card_activity cca on js.user_ecosystem_id = cca.user_ecosystem_id
)

select * from customer_360

