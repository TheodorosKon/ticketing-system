-- Create the database if it does not exist
CREATE DATABASE IF NOT EXISTS TicketingSystem;
USE TicketingSystem;

-- Role table holds the roles each user has and will be used to determine what is visible and usable to each user.
CREATE TABLE ROLES (
    role_id INT NOT NULL AUTO_INCREMENT,
    role_name VARCHAR(255) NOT NULL,
    description VARCHAR(255),
    created_at DATETIME,
    PRIMARY KEY (role_id)
);

-- User table holds users of the system, this includes Support engineers, field or backoffice, Managers, Teamleaders
-- and anyone else that needs access to the system.
CREATE TABLE USERS (
    user_id INT NOT NULL AUTO_INCREMENT,
    username VARCHAR(255) COLLATE utf8mb4_unicode_ci NOT NULL UNIQUE,
    email VARCHAR(255) COLLATE utf8mb4_unicode_ci NOT NULL UNIQUE,
    password_hash VARCHAR(255) NOT NULL,
    password_updated_at DATETIME NULL,
    first_name VARCHAR(255) NOT NULL,
    last_name VARCHAR(255) NOT NULL,
    phone_main VARCHAR(255) NULL,
    phone_backup VARCHAR(255),
    is_active BOOLEAN,
    role_id INT NOT NULL,
    created_at DATETIME,
    updated_at DATETIME,
    force_password_change BOOLEAN DEFAULT 0,
    PRIMARY KEY (user_id),
    FOREIGN KEY (role_id) REFERENCES ROLES (role_id)
);

-- This holds the different tags that can exist.
CREATE TABLE TAGS (
    tag_id INT NOT NULL AUTO_INCREMENT,
    tag_name VARCHAR(255),
    PRIMARY KEY (tag_id)
);

-- Ticket table holds info about each individual ticket.
CREATE TABLE TICKETS (
    ticket_id INT NOT NULL AUTO_INCREMENT,
    created_by INT NOT NULL,
    assigned_to INT,
    status VARCHAR(255),
    priority INT,
    title VARCHAR(255) NOT NULL,
    description VARCHAR(255) NOT NULL,
    device_manufacturer VARCHAR(255),
    device_model VARCHAR(255),
    device_serial_number VARCHAR(255) NOT NULL,
    device_os VARCHAR(255),
    opened_at DATETIME,
    updated_at DATETIME,
    closed_at DATETIME,
    PRIMARY KEY (ticket_id),
    FOREIGN KEY (created_by) REFERENCES USERS (user_id),
    FOREIGN KEY (assigned_to) REFERENCES USERS (user_id)
);

-- Attachment table holds any attachment that might have been uploaded by a support agent like photos or videos. It can also be used to hold SignOff documents.
CREATE TABLE ATTACHMENTS (
    attachment_id INT NOT NULL AUTO_INCREMENT,
    ticket_id INT NOT NULL,
    file_name VARCHAR(255),
    file_type VARCHAR(255),
    file_size_bytes INT,
    storage_url VARCHAR(255),
    uploaded_at DATETIME,
    uploaded_by INT,
    PRIMARY KEY (attachment_id),
    FOREIGN KEY (ticket_id) REFERENCES TICKETS (ticket_id),
    FOREIGN KEY (uploaded_by) REFERENCES USERS (user_id)
);

-- Comment table can hold comments left by the support or anyone that needs to leave extra information like a different phone number or address
CREATE TABLE COMMENTS (
    comment_id INT NOT NULL AUTO_INCREMENT,
    ticket_id INT NOT NULL,
    user_id INT NOT NULL,
    body TEXT NOT NULL,
    created_at DATETIME,
    PRIMARY KEY (comment_id),
    FOREIGN KEY (ticket_id) REFERENCES TICKETS (ticket_id),
    FOREIGN KEY (user_id) REFERENCES USERS (user_id)
);

-- User tag holds tags that shows what skill each person has to be able to categorize them in certain situations.
CREATE TABLE USER_TAGS (
    user_id INT NOT NULL,
    tag_id INT NOT NULL,
    user_id_tag_id INT NOT NULL AUTO_INCREMENT,
    PRIMARY KEY (user_id_tag_id),
    FOREIGN KEY (user_id) REFERENCES USERS (user_id),
    FOREIGN KEY (tag_id) REFERENCES TAGS (tag_id)
);

-- Ticket tag holds TAGs that tickets might have. This can be used to categorize tickets and assign proper technicians to the tickets.
-- For example a ticket could have PRINTING and NETWORK tags which means the responding technician needs to have knowledge of both systems to be assigned.
CREATE TABLE TICKET_TAGS (
    ticket_id INT NOT NULL,
    tag_id INT NOT NULL,
    ticket_id_tag_id INT NOT NULL AUTO_INCREMENT,
    PRIMARY KEY (ticket_id_tag_id),
    FOREIGN KEY (ticket_id) REFERENCES TICKETS (ticket_id),
    FOREIGN KEY (tag_id) REFERENCES TAGS (tag_id)
);

CREATE TABLE IF NOT EXISTS AUDIT_LOGS (
  audit_id INT AUTO_INCREMENT,
  actor_user_id INT NOT NULL,
  target_user_id INT NULL,
  action VARCHAR(100) NOT NULL,
  details JSON NULL,
  created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (audit_id),
  FOREIGN KEY (actor_user_id) REFERENCES USERS(user_id),
  FOREIGN KEY (target_user_id) REFERENCES USERS(user_id)
);
