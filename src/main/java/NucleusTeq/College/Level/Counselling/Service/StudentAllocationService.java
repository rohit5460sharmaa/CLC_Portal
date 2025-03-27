package NucleusTeq.College.Level.Counselling.Service;

import NucleusTeq.College.Level.Counselling.Repository.StudentAllocationRepository;
import NucleusTeq.College.Level.Counselling.Repository.SeatRepository;
import NucleusTeq.College.Level.Counselling.model.Seat;
import NucleusTeq.College.Level.Counselling.model.StudentAllocation;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class StudentAllocationService {

    private final StudentAllocationRepository allocationRepository;
    private final SeatRepository seatRepository;

    @Autowired
    public StudentAllocationService(StudentAllocationRepository allocationRepository, SeatRepository seatRepository) {
        this.allocationRepository = allocationRepository;
        this.seatRepository = seatRepository;
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
        updateSeatCounts(allocation, 1);
        return allocationRepository.save(allocation);
    }

    public void deleteAllocation(Long id) {
        StudentAllocation allocation = allocationRepository.findById(id).orElseThrow(() -> new RuntimeException("Allocation not found"));
        updateSeatCounts(allocation, -1);
        allocationRepository.deleteById(id);
    }

    public StudentAllocation updateStudentAllocation(Long id, StudentAllocation newAllocation) {
        StudentAllocation existingAllocation = allocationRepository.findById(id).orElseThrow(() -> new RuntimeException("Allocation not found"));

        // Revert previous allocation
        updateSeatCounts(existingAllocation, -1);

        // Apply new allocation
        existingAllocation.setStudentName(newAllocation.getStudentName());
        existingAllocation.setRollNumber(newAllocation.getRollNumber());
        existingAllocation.setRank(newAllocation.getRank());
        existingAllocation.setCategory(newAllocation.getCategory());
        existingAllocation.setBranch(newAllocation.getBranch());

        updateSeatCounts(existingAllocation, 1);

        return allocationRepository.save(existingAllocation);
    }

    private void updateSeatCounts(StudentAllocation allocation, int delta) {
        Seat seat = seatRepository.findByBranch(allocation.getBranch())
                .orElseThrow(() -> new RuntimeException("Branch not found: " + allocation.getBranch()));

        switch (allocation.getCategory().toLowerCase()) {
            case "general":
                if (delta == 1 && seat.getFilledGeneralSeats() >= seat.getGeneralSeats()) {
                    throw new RuntimeException("No available General seats for branch: " + allocation.getBranch());
                }
                seat.setFilledGeneralSeats(seat.getFilledGeneralSeats() + delta);
                break;
            case "obc":
                if (delta == 1 && seat.getFilledObcSeats() >= seat.getObcSeats()) {
                    throw new RuntimeException("No available OBC seats for branch: " + allocation.getBranch());
                }
                seat.setFilledObcSeats(seat.getFilledObcSeats() + delta);
                break;
            case "sc":
                if (delta == 1 && seat.getFilledScSeats() >= seat.getScSeats()) {
                    throw new RuntimeException("No available SC seats for branch: " + allocation.getBranch());
                }
                seat.setFilledScSeats(seat.getFilledScSeats() + delta);
                break;
            case "st":
                if (delta == 1 && seat.getFilledStSeats() >= seat.getStSeats()) {
                    throw new RuntimeException("No available ST seats for branch: " + allocation.getBranch());
                }
                seat.setFilledStSeats(seat.getFilledStSeats() + delta);
                break;
            default:
                throw new RuntimeException("Invalid category: " + allocation.getCategory());
        }

        seatRepository.save(seat);
    }
}
