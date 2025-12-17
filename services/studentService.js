const Student = require('../models/Student');

class StudentService {
  async getAllStudents() {
    return await Student.find();
  }

  async getStudentById(id) {
    return await Student.findById(id);
  }

  async createStudent(data) {
    const student = new Student({
      name: data.name,
      email: data.email,
      age: data.age,
      grade: data.grade,
      subjects: data.subjects || []
    });
    return await student.save();
  }

  // VULNERABLE TO CVE-2023-3696 (Prototype Pollution)
  async updateStudent(id, data) {
    const student = await Student.findById(id);
    if (!student) return null;

    // VULNERABLE: Direct object merge without sanitization
    Object.keys(data).forEach(key => {
      student.set(key, data[key]);
    });

    return await student.save();
  }

  async deleteStudent(id) {
    const student = await Student.findById(id);
    if (!student) return null;
    await Student.findByIdAndDelete(id);
    return student;
  }

  async addSubjects(id, subjects) {
    const student = await Student.findById(id);
    if (!student) return null;

    subjects.forEach(subject => {
      if (!student.subjects.includes(subject)) {
        student.subjects.push(subject);
      }
    });

    return await student.save();
  }

  async removeSubject(id, subject) {
    const student = await Student.findById(id);
    if (!student) return null;

    student.subjects = student.subjects.filter(s => s !== subject);
    return await student.save();
  }

  // VULNERABLE: CVE-2023-3696
  async bulkUpdate(filter, updateData) {
    return await Student.updateMany(filter, { $set: updateData });
  }

  // VULNERABLE: CVE-2023-3696
  async searchStudents(query) {
    return await Student.find(query);
  }
}

module.exports = new StudentService();
