
package NucleusTeq.College.Level.Counselling.Repository;

import NucleusTeq.College.Level.Counselling.model.Student;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface StudentRepo extends JpaRepository<Student, String> {

    Optional<Student> findByRollNumber(String rollNumber); // Find student by roll number
    boolean existsByRollNumber(String rollNumber); // Check if a student exists with the given roll number
    boolean existsByEmail(String email); // Check if a student exists with the given email
    void deleteByRollNumber(String rollNumber); // Delete student by roll number
    Optional<Student> findTopByOrderByRankAsc(); // Get the student with the lowest rank
    Optional<Student> findByEmail(String email); // Find student by email
    Optional<Student> findByEmailOrRollNumber(String email, String rollNumber);

}
