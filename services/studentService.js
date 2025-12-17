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
      password: data.password,
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

  // VULNERABLE TO NOSQL INJECTION
  // Attacker có thể bypass authentication bằng cách gửi:
  // { "email": {"$ne": ""}, "password": {"$ne": ""} }
  // hoặc { "email": {"$gt": ""}, "password": {"$gt": ""} }
  async loginStudent(email, password) {
    // VULNERABLE: Truyền trực tiếp user input vào query mà không sanitize
    return await Student.findOne({ email: email, password: password });
  }

  // VULNERABLE TO NOSQL INJECTION với $where operator
  // Attacker có thể inject JavaScript code
  // Ví dụ: searchTerm = "'; return true; var a='"
  async unsafeSearch(searchTerm) {
    // VULNERABLE: Sử dụng $where với user input
    return await Student.find({
      $where: `this.name.includes('${searchTerm}')`
    });
  }

  // VULNERABLE TO NOSQL INJECTION với regex
  // Attacker có thể gây ReDoS hoặc extract data
  // Ví dụ: pattern = ".*" hoặc pattern = {"$regex": "^a", "$options": "i"}
  async searchByPattern(pattern) {
    // VULNERABLE: Truyền trực tiếp pattern vào regex query
    return await Student.find({ name: { $regex: pattern } });
  }
}

module.exports = new StudentService();
