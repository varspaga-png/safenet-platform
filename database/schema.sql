CREATE TABLE users (
  id UUID PRIMARY KEY,
  name TEXT NOT NULL,
  email TEXT UNIQUE NOT NULL,
  phone TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  last_login_at TIMESTAMPTZ,
  security_level TEXT NOT NULL DEFAULT 'standard'
);

CREATE TABLE devices (
  id UUID PRIMARY KEY,
  user_id UUID REFERENCES users(id),
  device_name TEXT NOT NULL,
  device_type TEXT NOT NULL,
  os TEXT,
  last_verified_at TIMESTAMPTZ,
  is_trusted BOOLEAN NOT NULL DEFAULT FALSE,
  push_token TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE trusted_contacts (
  id UUID PRIMARY KEY,
  user_id UUID REFERENCES users(id),
  name TEXT NOT NULL,
  phone TEXT NOT NULL,
  relationship TEXT,
  is_active BOOLEAN NOT NULL DEFAULT TRUE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE journeys (
  id UUID PRIMARY KEY,
  user_id UUID REFERENCES users(id),
  origin TEXT NOT NULL,
  destination TEXT NOT NULL,
  selected_route TEXT NOT NULL,
  estimated_arrival_time TIMESTAMPTZ,
  journey_start_time TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  consent_state TEXT NOT NULL,
  monitoring_status TEXT NOT NULL,
  emergency_level INTEGER NOT NULL DEFAULT 0,
  state TEXT NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE journey_locations (
  id UUID PRIMARY KEY,
  journey_id UUID REFERENCES journeys(id),
  latitude DOUBLE PRECISION,
  longitude DOUBLE PRECISION,
  accuracy_meters DOUBLE PRECISION,
  speed_kmh DOUBLE PRECISION,
  recorded_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  location_source TEXT NOT NULL DEFAULT 'gps'
);

CREATE TABLE routes (
  id UUID PRIMARY KEY,
  source TEXT NOT NULL,
  destination TEXT NOT NULL,
  geometry JSONB,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE route_risk_factors (
  id UUID PRIMARY KEY,
  route_id UUID REFERENCES routes(id),
  emergency_services TEXT,
  public_activity TEXT,
  lighting TEXT,
  incident_density TEXT,
  data_confidence INTEGER,
  reasons JSONB,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE sensor_events (
  id UUID PRIMARY KEY,
  journey_id UUID REFERENCES journeys(id),
  accelerometer_x DOUBLE PRECISION,
  accelerometer_y DOUBLE PRECISION,
  accelerometer_z DOUBLE PRECISION,
  gyroscope_x DOUBLE PRECISION,
  gyroscope_y DOUBLE PRECISION,
  gyroscope_z DOUBLE PRECISION,
  motion_score DOUBLE PRECISION,
  anomaly_score DOUBLE PRECISION,
  event_type TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE anomaly_events (
  id UUID PRIMARY KEY,
  journey_id UUID REFERENCES journeys(id),
  emergency_level INTEGER NOT NULL,
  trigger_reason TEXT NOT NULL,
  confidence DOUBLE PRECISION,
  resolved BOOLEAN NOT NULL DEFAULT FALSE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE emergency_events (
  id UUID PRIMARY KEY,
  journey_id UUID REFERENCES journeys(id),
  event_level TEXT NOT NULL,
  trigger_reason TEXT NOT NULL,
  integration_mode TEXT NOT NULL,
  alert_sent BOOLEAN NOT NULL DEFAULT FALSE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE safety_nodes (
  id UUID PRIMARY KEY,
  name TEXT NOT NULL,
  type TEXT NOT NULL,
  latitude DOUBLE PRECISION,
  longitude DOUBLE PRECISION,
  verified_safe BOOLEAN NOT NULL DEFAULT TRUE,
  beacon_available BOOLEAN NOT NULL DEFAULT FALSE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE responder_accounts (
  id UUID PRIMARY KEY,
  name TEXT NOT NULL,
  agency TEXT,
  role TEXT NOT NULL,
  mfa_enabled BOOLEAN NOT NULL DEFAULT TRUE,
  is_active BOOLEAN NOT NULL DEFAULT TRUE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE responder_actions (
  id UUID PRIMARY KEY,
  responder_id UUID REFERENCES responder_accounts(id),
  emergency_event_id UUID REFERENCES emergency_events(id),
  action_type TEXT NOT NULL,
  note TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE police_integrations (
  id UUID PRIMARY KEY,
  name TEXT NOT NULL,
  region TEXT NOT NULL,
  system_type TEXT NOT NULL,
  is_active BOOLEAN NOT NULL DEFAULT FALSE,
  integration_mode TEXT NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE consents (
  id UUID PRIMARY KEY,
  user_id UUID REFERENCES users(id),
  consent_type TEXT NOT NULL,
  granted BOOLEAN NOT NULL,
  granted_at TIMESTAMPTZ,
  withdrawn_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE audit_logs (
  id UUID PRIMARY KEY,
  actor_id UUID,
  entity_type TEXT,
  entity_id TEXT,
  action TEXT NOT NULL,
  metadata JSONB,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE notifications (
  id UUID PRIMARY KEY,
  user_id UUID REFERENCES users(id),
  message TEXT NOT NULL,
  channel TEXT NOT NULL,
  status TEXT NOT NULL DEFAULT 'queued',
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE ai_conversations (
  id UUID PRIMARY KEY,
  user_id UUID REFERENCES users(id),
  message TEXT NOT NULL,
  response TEXT NOT NULL,
  confidence DOUBLE PRECISION,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE retention_policies (
  id UUID PRIMARY KEY,
  entity_name TEXT NOT NULL,
  retention_days INTEGER NOT NULL,
  auto_delete BOOLEAN NOT NULL DEFAULT TRUE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);
