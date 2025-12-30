INSERT INTO ROLES (role_name, description, created_at)
VALUES
('Admin', 'System administrator', NOW()),
('Support', 'Support technician', NOW()),
('Manager', 'Team manager', NOW());

INSERT INTO TAGS (tag_name)
VALUES
('NETWORKING'),
('PRINTING'),
('HARDWARE'),
('SOFTWARE');

INSERT INTO USERS (
  username,
  email,
  password_hash,
  first_name,
  last_name,
  phone_main,
  is_active,
  role_id,
  created_at
)
VALUES (
  'demo.admin',
  'admin@example.com',
  '$2b$10$fakehashforseeddataonly',
  'Demo',
  'Admin',
  '+123456789',
  TRUE,
  1,
  NOW()
);

INSERT INTO TICKETS (
  created_by,
  status,
  priority,
  title,
  description,
  device_serial_number,
  opened_at
)
VALUES (
  1,
  'OPEN',
  1,
  'Printer not working',
  'Office printer shows paper jam but none is present.',
  'SN-PRINTER-001',
  NOW()
);