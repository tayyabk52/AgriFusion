-- Migration: Add service location fields to consultants table
-- Purpose: Allow consultants to specify where they provide services (can be different from their personal location)

-- Drop the incorrect service_areas column
ALTER TABLE consultants DROP COLUMN IF EXISTS service_areas;

-- Drop old index
DROP INDEX IF EXISTS idx_consultants_service_areas;

-- Add three new columns for service location
ALTER TABLE consultants ADD COLUMN service_country VARCHAR(100);
ALTER TABLE consultants ADD COLUMN service_state VARCHAR(100);
ALTER TABLE consultants ADD COLUMN service_district VARCHAR(100);

-- Add indexes for better query performance
CREATE INDEX idx_consultants_service_country ON consultants(service_country);
CREATE INDEX idx_consultants_service_state ON consultants(service_state);
CREATE INDEX idx_consultants_service_district ON consultants(service_district);

-- Verify the columns are added
SELECT column_name, data_type, character_maximum_length, is_nullable
FROM information_schema.columns
WHERE table_name = 'consultants'
AND column_name IN ('service_country', 'service_state', 'service_district')
ORDER BY column_name;
