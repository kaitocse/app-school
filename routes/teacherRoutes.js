const express = require('express');
const router = express.Router();
const teacherService = require('../services/teacherService');

// Get all teachers
router.get('/', async (req, res) => {
  try {
    const teachers = await teacherService.getAllTeachers();
    res.json(teachers);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Get teacher by ID
router.get('/:id', async (req, res) => {
  try {
    const teacher = await teacherService.getTeacherById(req.params.id);
    if (!teacher) {
      return res.status(404).json({ message: 'Teacher not found' });
    }
    res.json(teacher);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Create teacher
router.post('/', async (req, res) => {
  try {
    const newTeacher = await teacherService.createTeacher(req.body);
    res.status(201).json(newTeacher);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// Update teacher
router.put('/:id', async (req, res) => {
  try {
    const updatedTeacher = await teacherService.updateTeacher(req.params.id, req.body);
    if (!updatedTeacher) {
      return res.status(404).json({ message: 'Teacher not found' });
    }
    res.json(updatedTeacher);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// Delete teacher
router.delete('/:id', async (req, res) => {
  try {
    const deleted = await teacherService.deleteTeacher(req.params.id);
    if (!deleted) {
      return res.status(404).json({ message: 'Teacher not found' });
    }
    res.json({ message: 'Teacher deleted' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// VULNERABLE TO NOSQL INJECTION - Teacher Login
router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;
    const teacher = await teacherService.loginTeacher(email, password);
    if (!teacher) {
      return res.status(401).json({ message: 'Invalid email or password' });
    }
    res.json({ 
      message: 'Login successful', 
      teacher,
      permissions: teacher.permissions,
      role: teacher.role
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// VULNERABLE TO NOSQL INJECTION - Search teachers
router.post('/search', async (req, res) => {
  try {
    const teachers = await teacherService.searchTeachers(req.body.query);
    res.json(teachers);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// Get teachers by role
router.get('/role/:role', async (req, res) => {
  try {
    const teachers = await teacherService.getTeachersByRole(req.params.role);
    res.json(teachers);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Check permission
router.get('/:id/permission/:permission', async (req, res) => {
  try {
    const hasPermission = await teacherService.checkPermission(req.params.id, req.params.permission);
    res.json({ hasPermission });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// VULNERABLE - Add permission
router.post('/:id/permissions', async (req, res) => {
  try {
    const teacher = await teacherService.addPermission(req.params.id, req.body.permission);
    if (!teacher) {
      return res.status(404).json({ message: 'Teacher not found' });
    }
    res.json(teacher);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

module.exports = router;
