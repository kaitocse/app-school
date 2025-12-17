const mongoose = require('mongoose');

const teacherSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true
  },
  email: {
    type: String,
    required: true,
    unique: true,
    trim: true
  },
  password: {
    type: String,
    required: true
  },
  subject: {
    type: String,
    enum: ['Math', 'Physics', 'Chemistry', 'Biology', 'Literature', 'History', 'Geography', 'English', 'IT']
  },
  role: {
    type: String,
    enum: ['teacher', 'head_teacher', 'admin'],
    default: 'teacher'
  },
  permissions: [{
    type: String,
    enum: ['view_students', 'edit_students', 'delete_students', 'manage_grades', 'manage_teachers', 'full_access']
  }],
  classes: [{
    type: String
  }],
  createdAt: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model('Teacher', teacherSchema);
