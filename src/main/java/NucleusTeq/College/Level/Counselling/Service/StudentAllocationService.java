package NucleusTeq.College.Level.Counselling.Service;

import NucleusTeq.College.Level.Counselling.Repository.StudentAllocationRepository;
import NucleusTeq.College.Level.Counselling.model.Seat;
import NucleusTeq.College.Level.Counselling.model.StudentAllocation;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class StudentAllocationService {

    private final StudentAllocationRepository allocationRepository;

    @Autowired
    public StudentAllocationService(StudentAllocationRepository allocationRepository) {
        this.allocationRepository = allocationRepository;
    }

    public List<StudentAllocation> getAllAllocations() {
        return allocationRepository.findAll();
    }

    public StudentAllocation getByRollNumber(String rollNumber) {
        return allocationRepository.findByRollNumber(rollNumber);
    }

    public boolean isStudentAllocated(String rollNumber) {
        return allocationRepository.existsByRollNumber(rollNumber);
    }

    public StudentAllocation allocateStudent(StudentAllocation allocation) {
        return allocationRepository.save(allocation);
    }

    public void deleteAllocation(Long id) {
        allocationRepository.deleteById(id);
    }

}
