package NucleusTeq.College.Level.Counselling.Repository;

import NucleusTeq.College.Level.Counselling.model.Preference;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.Optional;

public interface PreferenceRepository extends JpaRepository<Preference, Long> {
    Optional<Preference> findByRollNumber(String rollNumber);
    void deleteByRollNumber(String rollNumber);

}
