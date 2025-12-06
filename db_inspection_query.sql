-- 1. List all Tables
SELECT 
    tablename as table_name
FROM 
    pg_tables 
WHERE 
    schemaname = 'public'
ORDER BY 
    tablename;

-- 2. List all Indexes (Definitions)
SELECT 
    tablename as table_name, 
    indexname as index_name, 
    indexdef as index_definition
FROM 
    pg_indexes 
WHERE 
    schemaname = 'public'
ORDER BY 
    tablename, indexname;

-- 3. List all Triggers (Definitions)
SELECT 
    tbl.relname AS table_name,
    trg.tgname AS trigger_name,
    pg_get_triggerdef(trg.oid) AS trigger_definition
FROM 
    pg_trigger trg
JOIN 
    pg_class tbl ON trg.tgrelid = tbl.oid
JOIN 
    pg_namespace ns ON tbl.relnamespace = ns.oid
WHERE 
    ns.nspname = 'public' 
    AND NOT trg.tgisinternal
ORDER BY 
    table_name, trigger_name;

-- 4. List all RLS Policies
SELECT 
    tablename as table_name, 
    policyname as policy_name, 
    permissive, 
    roles, 
    cmd as command, 
    qual as using_expression, 
    with_check as with_check_expression
FROM 
    pg_policies 
WHERE 
    schemaname = 'public'
ORDER BY 
    tablename, policyname;

-- 5. List all Functions (often used by triggers)
SELECT 
    p.proname as function_name,
    pg_get_functiondef(p.oid) as function_definition
FROM 
    pg_proc p
JOIN 
    pg_namespace n ON p.pronamespace = n.oid
WHERE 
    n.nspname = 'public'
ORDER BY 
    function_name;
