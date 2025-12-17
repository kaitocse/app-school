const express = require('express');
const router = express.Router();
const studentService = require('../services/studentService');

// Get all students
router.get('/', async (req, res) => {
  try {
    const students = await studentService.getAllStudents();
    res.json(students);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Get one student
router.get('/:id', async (req, res) => {
  try {
    const student = await studentService.getStudentById(req.params.id);
    if (!student) {
      return res.status(404).json({ message: 'Student not found' });
    }
    res.json(student);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Create student
router.post('/', async (req, res) => {
  try {
    const newStudent = await studentService.createStudent(req.body);
    res.status(201).json(newStudent);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// Update student - VULNERABLE TO CVE-2023-3696
router.put('/:id', async (req, res) => {
  try {
    const updatedStudent = await studentService.updateStudent(req.params.id, req.body);
    if (!updatedStudent) {
      return res.status(404).json({ message: 'Student not found' });
    }
    res.json(updatedStudent);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// Delete student
router.delete('/:id', async (req, res) => {
  try {
    const deleted = await studentService.deleteStudent(req.params.id);
    if (!deleted) {
      return res.status(404).json({ message: 'Student not found' });
    }
    res.json({ message: 'Student deleted' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Add subjects to student
router.post('/:id/subjects', async (req, res) => {
  try {
    const updatedStudent = await studentService.addSubjects(req.params.id, req.body.subjects || []);
    if (!updatedStudent) {
      return res.status(404).json({ message: 'Student not found' });
    }
    res.json(updatedStudent);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// Remove subject from student
router.delete('/:id/subjects/:subject', async (req, res) => {
  try {
    const updatedStudent = await studentService.removeSubject(req.params.id, req.params.subject);
    if (!updatedStudent) {
      return res.status(404).json({ message: 'Student not found' });
    }
    res.json(updatedStudent);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// VULNERABLE: Bulk update - CVE-2023-3696
router.patch('/bulk-update', async (req, res) => {
  try {
    const result = await studentService.bulkUpdate(req.body.filter || {}, req.body.update);
    res.json({ message: 'Bulk update completed', modifiedCount: result.modifiedCount });
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// VULNERABLE: Search - CVE-2023-3696
router.post('/search', async (req, res) => {
  try {
    const students = await studentService.searchStudents(req.body.query);
    res.json(students);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// VULNERABLE TO NOSQL INJECTION
// Attacker có thể bypass bằng: { "email": {"$ne": ""}, "password": {"$ne": ""} }
router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;
    const student = await studentService.loginStudent(email, password);
    if (!student) {
      return res.status(401).json({ message: 'Invalid email or password' });
    }
    res.json({ message: 'Login successful', student });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// VULNERABLE TO NOSQL INJECTION - $where injection
router.get('/unsafe-search', async (req, res) => {
  try {
    const students = await studentService.unsafeSearch(req.query.term);
    res.json(students);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// VULNERABLE TO NOSQL INJECTION - Regex injection
router.get('/search-pattern', async (req, res) => {
  try {
    const students = await studentService.searchByPattern(req.query.pattern);
    res.json(students);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

module.exports = router;
