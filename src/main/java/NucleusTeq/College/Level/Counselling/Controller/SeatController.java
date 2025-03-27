package NucleusTeq.College.Level.Counselling.Controller;

import NucleusTeq.College.Level.Counselling.Service.SeatService;
import NucleusTeq.College.Level.Counselling.model.Seat;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/seats")
public class SeatController {

    private final SeatService seatService;

    @Autowired
    public SeatController(SeatService seatService) {
        this.seatService = seatService;
    }

    @GetMapping
    public List<Seat> getAllSeats() {
        return seatService.getAllSeats();
    }

    @GetMapping("/{id}")
    public ResponseEntity<Seat> getSeatById(@PathVariable Long id) {
        return seatService.getSeatById(id)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    @PostMapping
    public Seat createSeat(@RequestBody Seat seat) {
        return seatService.saveSeat(seat);
    }

    @PutMapping("/{id}")
    public ResponseEntity<Seat> updateSeat(@PathVariable Long id, @RequestBody Seat seatDetails) {
        return ResponseEntity.ok(seatService.updateSeat(id, seatDetails));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteSeat(@PathVariable Long id) {
        seatService.deleteSeat(id);
        return ResponseEntity.noContent().build();
    }

    @PostMapping("/allocate")
    public ResponseEntity<Seat> allocateSeat(@RequestParam String branch, @RequestParam String category) {
        return ResponseEntity.ok(seatService.allocateSeat(branch, category));
    }

    @PatchMapping("/{branch}")
    public ResponseEntity<Seat> updateSeat(@PathVariable String branch, @RequestBody Seat seatDetails) {
        return ResponseEntity.ok(seatService.updateSeatByBranch(branch, seatDetails));
    }


}
