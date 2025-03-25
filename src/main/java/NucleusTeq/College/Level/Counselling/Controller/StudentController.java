package NucleusTeq.College.Level.Counselling.Controller;

import NucleusTeq.College.Level.Counselling.Service.StudentService;
import NucleusTeq.College.Level.Counselling.model.Student;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/students")
@CrossOrigin(origins = "*")
public class StudentController {

    private final StudentService studentService;

    @Autowired
    public StudentController(StudentService studentService) { // ✅ Constructor Injection
        this.studentService = studentService;
    }

    @GetMapping
    public List<Student> getAllStudents() {
        return studentService.getAllStudents(); // ✅ Use service instead of repo
    }

    @GetMapping("/{rollNumber}")
    public ResponseEntity<Student> getStudentByRollNumber(@PathVariable String rollNumber) {
        return studentService.getStudentByRollNumber(rollNumber)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    @PostMapping
    public ResponseEntity<Student> createStudent(@RequestBody Student student) {
        return ResponseEntity.ok(studentService.saveStudent(student)); // ✅ Use service
    }

    @PutMapping("/{rollNumber}")
    public ResponseEntity<Student> updateStudent(@PathVariable String rollNumber, @RequestBody Student updatedStudent) {
        return studentService.getStudentByRollNumber(rollNumber).map(student -> {
            updatedStudent.setRollNumber(rollNumber);
            return ResponseEntity.ok(studentService.saveStudent(updatedStudent)); // ✅ Use service
        }).orElse(ResponseEntity.notFound().build());
    }

    @DeleteMapping("/{rollNumber}")
    public ResponseEntity<Void> deleteStudent(@PathVariable String rollNumber) {
        if (studentService.existsByRollNumber(rollNumber)) { // ✅ Use service
            studentService.deleteByRollNumber(rollNumber);
            return ResponseEntity.noContent().build();
        }
        return ResponseEntity.notFound().build();
    }

//    @GetMapping("/email/{email}")
//    public ResponseEntity<Student> getStudentByEmail(@PathVariable String email) {
//        return studentService.existsByEmail(email)
//                .map(ResponseEntity::ok)
//                .orElse(ResponseEntity.notFound().build());
//    }
}
