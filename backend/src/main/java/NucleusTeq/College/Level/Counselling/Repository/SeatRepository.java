package NucleusTeq.College.Level.Counselling.Repository;

import NucleusTeq.College.Level.Counselling.model.Seat;

import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface SeatRepository extends JpaRepository<Seat, Long> {
//    Seat findByBranch(String branch);
    Optional<Seat> findByBranch(String branch);

}
