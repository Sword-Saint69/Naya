CREATE TABLE IF NOT EXISTS users (
  id BIGSERIAL PRIMARY KEY,
  name VARCHAR(120) NOT NULL,
  email VARCHAR(180) NOT NULL UNIQUE,
  password_hash VARCHAR(255) NOT NULL,
  college_id VARCHAR(60) NOT NULL,
  role VARCHAR(20) NOT NULL DEFAULT 'STUDENT',
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE TABLE IF NOT EXISTS buses (
  id BIGSERIAL PRIMARY KEY,
  bus_no VARCHAR(30) NOT NULL UNIQUE,
  capacity INT NOT NULL CHECK (capacity > 0),
  bus_type VARCHAR(30) NOT NULL DEFAULT 'STANDARD',
  status VARCHAR(20) NOT NULL DEFAULT 'ACTIVE'
);

CREATE TABLE IF NOT EXISTS drivers (
  id BIGSERIAL PRIMARY KEY,
  name VARCHAR(120) NOT NULL,
  license_no VARCHAR(60) NOT NULL UNIQUE,
  phone VARCHAR(20) NOT NULL,
  status VARCHAR(20) NOT NULL DEFAULT 'ACTIVE'
);

CREATE TABLE IF NOT EXISTS routes (
  id BIGSERIAL PRIMARY KEY,
  route_no VARCHAR(30) NOT NULL UNIQUE,
  source VARCHAR(120) NOT NULL,
  destination VARCHAR(120) NOT NULL,
  distance_km DOUBLE PRECISION NOT NULL DEFAULT 0,
  fee NUMERIC(10,2) NOT NULL DEFAULT 0,
  status VARCHAR(20) NOT NULL DEFAULT 'ACTIVE'
);

CREATE TABLE IF NOT EXISTS route_stops (
  id BIGSERIAL PRIMARY KEY,
  route_id BIGINT NOT NULL REFERENCES routes(id) ON DELETE CASCADE,
  stop_name VARCHAR(150) NOT NULL,
  sequence INT NOT NULL,
  pickup_time VARCHAR(10),
  UNIQUE(route_id, sequence)
);

CREATE TABLE IF NOT EXISTS bus_assignments (
  id BIGSERIAL PRIMARY KEY,
  bus_id BIGINT NOT NULL REFERENCES buses(id),
  driver_id BIGINT NOT NULL REFERENCES drivers(id),
  route_id BIGINT NOT NULL REFERENCES routes(id),
  shift VARCHAR(20) NOT NULL,
  effective_from DATE NOT NULL DEFAULT CURRENT_DATE,
  active BOOLEAN NOT NULL DEFAULT TRUE,
  UNIQUE(bus_id, shift, effective_from),
  UNIQUE(driver_id, shift, effective_from)
);

CREATE TABLE IF NOT EXISTS bus_passes (
  id BIGSERIAL PRIMARY KEY,
  student_id BIGINT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  route_id BIGINT NOT NULL REFERENCES routes(id),
  assignment_id BIGINT REFERENCES bus_assignments(id),
  academic_year VARCHAR(20) NOT NULL,
  status VARCHAR(20) NOT NULL DEFAULT 'PENDING',
  valid_from DATE,
  valid_to DATE,
  fee_paid BOOLEAN NOT NULL DEFAULT FALSE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
CREATE INDEX IF NOT EXISTS idx_pass_student ON bus_passes(student_id);
CREATE INDEX IF NOT EXISTS idx_pass_status ON bus_passes(status);
CREATE INDEX IF NOT EXISTS idx_pass_assignment ON bus_passes(assignment_id);
