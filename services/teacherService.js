const Teacher = require('../models/Teacher');

class TeacherService {
  async getAllTeachers() {
    return await Teacher.find();
  }

  async getTeacherById(id) {
    return await Teacher.findById(id);
  }

  async createTeacher(data) {
    const teacher = new Teacher({
      name: data.name,
      email: data.email,
      password: data.password,
      subject: data.subject,
      role: data.role || 'teacher',
      permissions: data.permissions || ['view_students'],
      classes: data.classes || []
    });
    return await teacher.save();
  }

  async updateTeacher(id, data) {
    const teacher = await Teacher.findById(id);
    if (!teacher) return null;

    Object.keys(data).forEach(key => {
      teacher.set(key, data[key]);
    });

    return await teacher.save();
  }

  async deleteTeacher(id) {
    const teacher = await Teacher.findById(id);
    if (!teacher) return null;
    await Teacher.findByIdAndDelete(id);
    return teacher;
  }

  // VULNERABLE TO NOSQL INJECTION
  // Attacker có thể bypass bằng: { "email": {"$ne": ""}, "password": {"$ne": ""} }
  async loginTeacher(email, password) {
    return await Teacher.findOne({ email: email, password: password });
  }

  // VULNERABLE TO NOSQL INJECTION
  async searchTeachers(query) {
    return await Teacher.find(query);
  }

  // Get teachers by role
  async getTeachersByRole(role) {
    return await Teacher.find({ role: role });
  }

  // Check permission
  async checkPermission(teacherId, permission) {
    const teacher = await Teacher.findById(teacherId);
    if (!teacher) return false;
    
    if (teacher.role === 'admin') return true;
    return teacher.permissions.includes(permission) || teacher.permissions.includes('full_access');
  }

  // VULNERABLE: Add permission without validation
  async addPermission(teacherId, permission) {
    const teacher = await Teacher.findById(teacherId);
    if (!teacher) return null;
    
    if (!teacher.permissions.includes(permission)) {
      teacher.permissions.push(permission);
    }
    return await teacher.save();
  }
}

module.exports = new TeacherService();
