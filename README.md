# FleetFlow – Fleet Management System

## Features
- Role-based login: Admin / Manager / Viewer
- Vehicle CRUD
- Driver CRUD
- Vehicle-driver assignment
- Dashboard summaries
- Search/filter
- MySQL database
- REST API
- Responsive frontend

## Requirements
Node.js 18+ and MySQL 8+

## Setup
1. Create a MySQL database by running `database/schema.sql`.
2. Copy `.env.example` to `.env` and set your MySQL password.
3. Run:
   ```bash
   npm install
   npm start
   ```
4. Open http://localhost:5000

## Default admin
Email: admin@fleet.com
Password: Admin@123

The server creates this account automatically on startup.

## API
POST /api/auth/login
GET/POST /api/vehicles
PUT/DELETE /api/vehicles/:id
GET/POST /api/drivers
PUT/DELETE /api/drivers/:id
GET/POST /api/assignments
DELETE /api/assignments/:id
GET /api/dashboard

Change the default admin password before production use.