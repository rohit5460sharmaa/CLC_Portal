package NucleusTeq.College.Level.Counselling.Controller;

import NucleusTeq.College.Level.Counselling.Service.StudentAllocationService;
import NucleusTeq.College.Level.Counselling.model.StudentAllocation;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/allocations")
public class StudentAllocationController {

    private final StudentAllocationService allocationService;

    @Autowired
    public StudentAllocationController(StudentAllocationService allocationService) {
        this.allocationService = allocationService;
    }

    @GetMapping
    public List<StudentAllocation> getAllAllocations() {
        return allocationService.getAllAllocations();
    }

    @GetMapping("/{rollNumber}")
    public ResponseEntity<StudentAllocation> getByRollNumber(@PathVariable String rollNumber) {
        StudentAllocation allocation = allocationService.getByRollNumber(rollNumber);
        return allocation != null ? ResponseEntity.ok(allocation) : ResponseEntity.notFound().build();
    }

    @PostMapping
    public ResponseEntity<StudentAllocation> allocateStudent(@RequestBody StudentAllocation allocation) {
        if (allocationService.isStudentAllocated(allocation.getRollNumber())) {
            return ResponseEntity.badRequest().body(null);
        }
        return ResponseEntity.ok(allocationService.allocateStudent(allocation));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteAllocation(@PathVariable Long id) {
        allocationService.deleteAllocation(id);
        return ResponseEntity.noContent().build();
    }

}
