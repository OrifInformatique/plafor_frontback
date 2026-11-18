-- This script runs only the first time the container is created
-- Required by docker-compose db service
-- Create test_db in the same container
CREATE DATABASE IF NOT EXISTS test_db;
GRANT ALL PRIVILEGES ON test_db.* TO 'root'@'%';
