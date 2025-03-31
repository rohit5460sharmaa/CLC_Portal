package NucleusTeq.College.Level.Counselling.Controller;

import NucleusTeq.College.Level.Counselling.Service.StudentService;
import NucleusTeq.College.Level.Counselling.model.Student;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDate;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/students")
@CrossOrigin(origins = "*")
public class StudentController {

    private final StudentService studentService;

    @Autowired
    public StudentController(StudentService studentService) { // Constructor Injection
        this.studentService = studentService;
    }

    @GetMapping
    public List<Student> getAllStudents() {
        return studentService.getAllStudents(); // Use service 
    }

    @GetMapping("/{rollNumber}")
    public ResponseEntity<Student> getStudentByRollNumber(@PathVariable String rollNumber) {
        return studentService.getStudentByRollNumber(rollNumber)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    @PostMapping
    public ResponseEntity<Student> createStudent(@RequestBody Student student) {
        return ResponseEntity.ok(studentService.saveStudent(student)); //  Use service
    }

    @PutMapping("/{rollNumber}")
    public ResponseEntity<Student> updateStudent(
        @PathVariable String rollNumber,
        @RequestBody Map<String, Object> updates) {

        return studentService.getStudentByRollNumber(rollNumber)
            .map(existingStudent -> {
                // Merge changes with existing data
                if (updates.containsKey("name")) {
                    existingStudent.setName((String) updates.get("name"));
                }
                if (updates.containsKey("email")) {
                    existingStudent.setEmail((String) updates.get("email"));
                }
                if (updates.containsKey("phone")) {
                    existingStudent.setPhone((String) updates.get("phone"));
                }
                if (updates.containsKey("address")) {
                    existingStudent.setAddress((String) updates.get("address"));
                }
                if (updates.containsKey("dob")) {
                    existingStudent.setDob(LocalDate.parse((String) updates.get("dob")));
                }
                if (updates.containsKey("admitted")) {
                    existingStudent.setAdmitted((Boolean) updates.get("admitted"));
                }

                return ResponseEntity.ok(studentService.saveStudentUpdate(existingStudent));
            })
            .orElse(ResponseEntity.notFound().build());
    }

    @PatchMapping("/{rollNumber}")
    public ResponseEntity<Student> partialUpdateStudent(
        @PathVariable String rollNumber,
        @RequestBody Map<String, Object> updates) {

        return studentService.getStudentByRollNumber(rollNumber)
            .map(existingStudent -> {
                // Apply partial updates
                updates.forEach((key, value) -> {
                    switch (key) {
                        case "name" -> existingStudent.setName((String) value);
                        case "email" -> existingStudent.setEmail((String) value);
                        case "phone" -> existingStudent.setPhone((String) value);
                        case "address" -> existingStudent.setAddress((String) value);
                        case "dob" -> existingStudent.setDob(LocalDate.parse((String) value));
                        case "admitted" -> existingStudent.setAdmitted((Boolean) value);
                    }
                });

                return ResponseEntity.ok(studentService.saveStudentUpdate(existingStudent));
            })
            .orElse(ResponseEntity.notFound().build());
    }

    @DeleteMapping("/{rollNumber}")
    public ResponseEntity<Void> deleteStudent(@PathVariable String rollNumber) {
        if (studentService.existsByRollNumber(rollNumber)) { // ✅ Use service
            studentService.deleteByRollNumber(rollNumber);
            return ResponseEntity.noContent().build();
        }
        return ResponseEntity.notFound().build();
    }

}
