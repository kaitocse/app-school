const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const studentRoutes = require('./routes/studentRoutes');

const app = express();
const PORT = process.env.PORT || 3000;
const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/school_db';

// Middleware
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// Routes
app.use('/api/students', studentRoutes);

// Root endpoint
app.get('/', (req, res) => {
  res.json({
    message: 'School Management API - CVE-2023-3696 Demo',
    version: '1.0.0',
    mongooseVersion: mongoose.version,
    warning: 'This application uses mongoose 7.3.3 which is vulnerable to CVE-2023-3696 (Prototype Pollution)',
    endpoints: {
      'GET /api/students': 'Get all students',
      'GET /api/students/:id': 'Get student by ID',
      'POST /api/students': 'Create new student',
      'PUT /api/students/:id': 'Update student (VULNERABLE)',
      'DELETE /api/students/:id': 'Delete student',
      'POST /api/students/:id/subjects': 'Add subjects to student',
      'DELETE /api/students/:id/subjects/:subject': 'Remove subject from student',
      'PATCH /api/students/bulk-update': 'Bulk update students (VULNERABLE)',
      'POST /api/students/search': 'Search students (VULNERABLE)'
    }
  });
});

// CVE-2023-3696 Demo endpoint
app.get('/cve-info', (req, res) => {
  res.json({
    cve: 'CVE-2023-3696',
    description: 'Prototype Pollution in Mongoose < 7.3.4',
    severity: 'High (CVSS 7.5)',
    affectedVersion: '< 7.3.4',
    currentVersion: mongoose.version,
    vulnerable: true,
    exploitExample: {
      description: 'Send malicious payload to pollute Object prototype',
      endpoint: 'PUT /api/students/:id',
      payload: {
        '__proto__.isAdmin': true,
        'constructor.prototype.isAdmin': true
      },
      impact: 'Attacker can modify Object.prototype affecting all objects in the application'
    }
  });
});

// Connect to MongoDB and start server
mongoose.connect(MONGODB_URI)
  .then(() => {
    console.log('Connected to MongoDB');
    app.listen(PORT, () => {
      console.log(`Server running on port ${PORT}`);
      console.log(`Mongoose version: ${mongoose.version}`);
      console.log('WARNING: This app uses vulnerable mongoose version for CVE-2023-3696 demo');
    });
  })
  .catch(err => {
    console.error('MongoDB connection error:', err);
    process.exit(1);
  });

module.exports = app;
