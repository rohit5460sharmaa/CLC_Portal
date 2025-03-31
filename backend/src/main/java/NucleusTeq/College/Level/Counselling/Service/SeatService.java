package NucleusTeq.College.Level.Counselling.Service;

import NucleusTeq.College.Level.Counselling.model.Seat;
import NucleusTeq.College.Level.Counselling.Repository.SeatRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class SeatService {

    private final SeatRepository seatRepository;

    @Autowired
    public SeatService(SeatRepository seatRepository) {
        this.seatRepository = seatRepository;
    }

    public List<Seat> getAllSeats() {
        return seatRepository.findAll();
    }

    public Optional<Seat> getSeatById(Long id) {
        return seatRepository.findById(id);
    }

    public Optional<Seat> getSeatByBranch(String branch) {
        return seatRepository.findByBranch(branch);
    }

    public Seat saveSeat(Seat seat) {
        return seatRepository.save(seat);
    }

    public void deleteSeat(Long id) {
        seatRepository.deleteById(id);
    }

    public Seat updateSeat(Long id, Seat seatDetails) {
        return seatRepository.findById(id).map(seat -> {
            if (seatDetails.getBranch() != null) seat.setBranch(seatDetails.getBranch());
            if (seatDetails.getGeneralSeats() != null) seat.setGeneralSeats(seatDetails.getGeneralSeats());
            if (seatDetails.getObcSeats() != null) seat.setObcSeats(seatDetails.getObcSeats());
            if (seatDetails.getScSeats() != null) seat.setScSeats(seatDetails.getScSeats());
            if (seatDetails.getStSeats() != null) seat.setStSeats(seatDetails.getStSeats());
            if (seatDetails.getFilledGeneralSeats() != null) seat.setFilledGeneralSeats(seatDetails.getFilledGeneralSeats());
            if (seatDetails.getFilledObcSeats() != null) seat.setFilledObcSeats(seatDetails.getFilledObcSeats());
            if (seatDetails.getFilledScSeats() != null) seat.setFilledScSeats(seatDetails.getFilledScSeats());
            if (seatDetails.getFilledStSeats() != null) seat.setFilledStSeats(seatDetails.getFilledStSeats());
            
            seat.updateSeatCounts();
            return seatRepository.save(seat);
        }).orElseThrow(() -> new RuntimeException("Seat not found with id " + id));
    }
    
    public Seat updateSeatByBranch(String branch, Seat seatDetails) {
        Seat seat = seatRepository.findByBranch(branch)
                .orElseThrow(() -> new RuntimeException("Branch not found: " + branch));

        seat.updateSeatByBranch(seatDetails);
        return seatRepository.save(seat);
    }
    
    
    
    public Seat allocateSeat(String branch, String category) {
        Seat seat = seatRepository.findByBranch(branch)
                .orElseThrow(() -> new RuntimeException("Branch not found: " + branch));

        if (seat.getVacantSeats() <= 0) {
            throw new RuntimeException("No vacant seats available in " + branch);
        }

        // Handle category-based allocation
        switch (category.toLowerCase()) {
            case "general" -> {
                if (seat.getFilledGeneralSeats() < seat.getGeneralSeats()) {
                    seat.incrementFilledSeats("general");  // Increment filled general seats
                } else {
                    throw new RuntimeException("No available General seats in " + branch);
                }
            }
            case "obc" -> {
                if (seat.getFilledObcSeats() < seat.getObcSeats()) {
                    seat.incrementFilledSeats("obc");  // Increment filled OBC seats
                } else {
                    throw new RuntimeException("No available OBC seats in " + branch);
                }
            }
            case "sc" -> {
                if (seat.getFilledScSeats() < seat.getScSeats()) {
                    seat.incrementFilledSeats("sc");  // Increment filled SC seats
                } else {
                    throw new RuntimeException("No available SC seats in " + branch);
                }
            }
            case "st" -> {
                if (seat.getFilledStSeats() < seat.getStSeats()) {
                    seat.incrementFilledSeats("st");  // Increment filled ST seats
                } else {
                    throw new RuntimeException("No available ST seats in " + branch);
                }
            }
            default -> throw new RuntimeException("Invalid category: " + category);
        }

        // Update total and vacant seats dynamically based on the allocation
        seat.updateSeatCounts();

        return seatRepository.save(seat);  // Save updated seat state
    }

}
