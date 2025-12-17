# School Management Backend

## Setup

```bash
npm install
npm start
```

MongoDB must be running on `localhost:27017`

## API Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | /api/students | Get all students |
| GET | /api/students/:id | Get student by ID |
| POST | /api/students | Create student |
| PUT | /api/students/:id | Update student (VULNERABLE) |
| DELETE | /api/students/:id | Delete student |
| POST | /api/students/:id/subjects | Add subjects |
| DELETE | /api/students/:id/subjects/:subject | Remove subject |
| PATCH | /api/students/bulk-update | Bulk update (VULNERABLE) |
| POST | /api/students/search | Search (VULNERABLE) |
