-- Credit Card Service: Initial schema
-- V001: Create credit card tables

-- Credit Card Accounts
CREATE TABLE IF NOT EXISTS credit_card_accounts (
    id BIGSERIAL PRIMARY KEY,
    user_ecosystem_id VARCHAR(50) NOT NULL,
    status VARCHAR(50) NOT NULL DEFAULT 'PRE_APPROVED',
    credit_limit DECIMAL(15, 2) NOT NULL DEFAULT 5000.00,
    available_limit DECIMAL(15, 2) NOT NULL DEFAULT 5000.00,
    signature_text VARCHAR(255),
    signed_at TIMESTAMP WITH TIME ZONE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    
    CONSTRAINT chk_status CHECK (status IN ('PRE_APPROVED', 'ONBOARDED', 'ACTIVE', 'SUSPENDED', 'CLOSED'))
);

-- Index for user lookups
CREATE INDEX idx_credit_card_accounts_user ON credit_card_accounts(user_ecosystem_id);

-- Purchase History (for simulation)
CREATE TABLE IF NOT EXISTS purchases (
    id BIGSERIAL PRIMARY KEY,
    account_id BIGINT NOT NULL REFERENCES credit_card_accounts(id),
    amount DECIMAL(15, 2) NOT NULL,
    merchant VARCHAR(255) NOT NULL DEFAULT 'Simulated Merchant',
    status VARCHAR(50) NOT NULL DEFAULT 'APPROVED',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    
    CONSTRAINT chk_purchase_status CHECK (status IN ('APPROVED', 'DECLINED', 'PENDING'))
);

-- Index for account purchases
CREATE INDEX idx_purchases_account ON purchases(account_id);

-- Pre-approved offers for demo users
INSERT INTO credit_card_accounts (user_ecosystem_id, status, credit_limit, available_limit)
VALUES 
    ('usr_demo_user_001', 'PRE_APPROVED', 5000.00, 5000.00),
    ('usr_demo_admin_001', 'PRE_APPROVED', 10000.00, 10000.00)
ON CONFLICT DO NOTHING;

COMMENT ON TABLE credit_card_accounts IS 'Credit card accounts with limits and status';
COMMENT ON TABLE purchases IS 'Simulated purchase history for demonstration';

