CREATE TABLE admins (
    id INT AUTO_INCREMENT PRIMARY KEY,
    username VARCHAR(50) UNIQUE NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    role ENUM('super_admin', 'admin') DEFAULT 'admin'
);

CREATE TABLE stakeholders (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    type ENUM('hotel', 'restoran', 'destinasi', 'event_organizer') NOT NULL,
    contact_person VARCHAR(255),
    phone VARCHAR(20),
    email VARCHAR(255) UNIQUE NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    status ENUM('active', 'suspended') DEFAULT 'active',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE reports (
    id INT AUTO_INCREMENT PRIMARY KEY,
    stakeholder_id INT,
    report_month INT,
    report_year INT,
    nusantara INT,
    mancanegara INT,
    origin_country VARCHAR(100),
    avg_stay DECIMAL(4,2),
    occupancy_rate DECIMAL(5,2),
    avg_spending BIGINT,
    submitted_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    verified BOOLEAN DEFAULT FALSE,
    FOREIGN KEY (stakeholder_id) REFERENCES stakeholders(id)
);

CREATE TABLE notifications (
    id INT AUTO_INCREMENT PRIMARY KEY,
    message TEXT NOT NULL,
    target_user_id INT,
    is_read BOOLEAN DEFAULT FALSE,
    sent_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE certificates (
    id INT AUTO_INCREMENT PRIMARY KEY,
    stakeholder_id INT,
    period VARCHAR(20),
    issued_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (stakeholder_id) REFERENCES stakeholders(id)
);

INSERT INTO admins (username, password_hash, role) VALUES ('admin', '$2b$10$...', 'super_admin');
```

---
