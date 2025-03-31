
package NucleusTeq.College.Level.Counselling.Service;

import NucleusTeq.College.Level.Counselling.Repository.StudentRepo;
import NucleusTeq.College.Level.Counselling.model.Student;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

import org.springframework.security.crypto.password.PasswordEncoder;


@Service
public class StudentService {

    private final StudentRepo studentRepo;
    private final PasswordEncoder passwordEncoder;

    @Autowired
    public StudentService(StudentRepo studentRepo, PasswordEncoder passwordEncoder) {
        this.studentRepo = studentRepo;
        this.passwordEncoder = passwordEncoder;
    }

    // Save or update student with encrypted password
    public Student saveStudent(Student student) {
        student.setPassword(passwordEncoder.encode(student.getPassword())); // Encrypt password
        return studentRepo.save(student);
    }
    
    // Save or update student with encrypted password
    public Student saveStudentUpdate(Student student) {
        
        return studentRepo.save(student);
    }
    
    // Get all students
    public List<Student> getAllStudents() {
        return studentRepo.findAll();
    }

    // Get student by roll number
    public Optional<Student> getStudentByRollNumber(String rollNumber) {
        return studentRepo.findByRollNumber(rollNumber);
    }

    // Check if student exists by roll number
    public boolean existsByRollNumber(String rollNumber) {
        return studentRepo.existsByRollNumber(rollNumber);
    }

    // Check if student exists by email
    public boolean existsByEmail(String email) {
        return studentRepo.existsByEmail(email);
    }

    // Delete student by roll number
    public void deleteByRollNumber(String rollNumber) {
        studentRepo.deleteByRollNumber(rollNumber);
    }

    // Get student with the lowest rank
    public Optional<Student> getTopRankedStudent() {
        return studentRepo.findTopByOrderByRankAsc();
    }
}
