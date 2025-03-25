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

    public Seat getSeatByBranch(String branch) {
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
            seat.setBranch(seatDetails.getBranch());
            seat.setGeneralSeats(seatDetails.getGeneralSeats());
            seat.setObcSeats(seatDetails.getObcSeats());
            seat.setScSeats(seatDetails.getScSeats());
            seat.setStSeats(seatDetails.getStSeats());
            seat.setFilledGeneralSeats(seatDetails.getFilledGeneralSeats());
            seat.setFilledObcSeats(seatDetails.getFilledObcSeats());
            seat.setFilledScSeats(seatDetails.getFilledScSeats());
            seat.setFilledStSeats(seatDetails.getFilledStSeats());
            return seatRepository.save(seat);
        }).orElseThrow(() -> new RuntimeException("Seat not found with id " + id));
    }
}
