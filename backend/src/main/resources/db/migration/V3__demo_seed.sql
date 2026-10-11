-- Demo seed: 3 routes, 3 buses, 3 drivers, 3 assignments (idempotent)
INSERT INTO routes (route_no, source, destination, distance_km, fee, status) VALUES
  ('R-DEMO-1', 'Campus Main Gate', 'City Central', 12.5, 5000, 'ACTIVE'),
  ('R-DEMO-2', 'Campus Main Gate', 'North Town', 8.0, 3500, 'ACTIVE'),
  ('R-DEMO-3', 'Campus Hostel', 'Railway Station', 15.0, 6000, 'ACTIVE')
ON CONFLICT (route_no) DO NOTHING;

INSERT INTO buses (bus_no, capacity, bus_type, status) VALUES
  ('BUS-DEMO-01', 40, 'STANDARD', 'ACTIVE'),
  ('BUS-DEMO-02', 35, 'STANDARD', 'ACTIVE'),
  ('BUS-DEMO-03', 50, 'DELUXE', 'ACTIVE')
ON CONFLICT (bus_no) DO NOTHING;

INSERT INTO drivers (name, license_no, phone, status) VALUES
  ('Demo Driver One', 'DL-DEMO-01', '9000000001', 'ACTIVE'),
  ('Demo Driver Two', 'DL-DEMO-02', '9000000002', 'ACTIVE'),
  ('Demo Driver Three', 'DL-DEMO-03', '9000000003', 'ACTIVE')
ON CONFLICT (license_no) DO NOTHING;

INSERT INTO route_stops (route_id, stop_name, sequence, pickup_time)
SELECT r.id, s.stop_name, s.sequence, s.pickup_time
FROM routes r JOIN (VALUES
  ('R-DEMO-1', 'City Central', 1, '07:30'),
  ('R-DEMO-1', 'Lake View', 2, '07:50'),
  ('R-DEMO-1', 'Campus Main Gate', 3, '08:20'),
  ('R-DEMO-2', 'North Town', 1, '07:40'),
  ('R-DEMO-2', 'Campus Main Gate', 2, '08:15')
) AS s(route_no, stop_name, sequence, pickup_time) ON s.route_no = r.route_no
ON CONFLICT DO NOTHING;

-- Assignments link bus+driver+route; skip if same bus+shift+date exists
INSERT INTO bus_assignments (bus_id, driver_id, route_id, shift, effective_from, active)
SELECT b.id, d.id, r.id, 'MORNING', CURRENT_DATE, TRUE
FROM buses b, drivers d, routes r
WHERE b.bus_no = 'BUS-DEMO-01' AND d.license_no = 'DL-DEMO-01' AND r.route_no = 'R-DEMO-1'
ON CONFLICT DO NOTHING;

INSERT INTO bus_assignments (bus_id, driver_id, route_id, shift, effective_from, active)
SELECT b.id, d.id, r.id, 'EVENING', CURRENT_DATE, TRUE
FROM buses b, drivers d, routes r
WHERE b.bus_no = 'BUS-DEMO-01' AND d.license_no = 'DL-DEMO-01' AND r.route_no = 'R-DEMO-1'
ON CONFLICT DO NOTHING;

INSERT INTO bus_assignments (bus_id, driver_id, route_id, shift, effective_from, active)
SELECT b.id, d.id, r.id, 'MORNING', CURRENT_DATE, TRUE
FROM buses b, drivers d, routes r
WHERE b.bus_no = 'BUS-DEMO-02' AND d.license_no = 'DL-DEMO-02' AND r.route_no = 'R-DEMO-2'
ON CONFLICT DO NOTHING;
