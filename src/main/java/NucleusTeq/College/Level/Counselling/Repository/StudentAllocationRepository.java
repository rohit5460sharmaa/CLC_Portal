package NucleusTeq.College.Level.Counselling.Repository;

import NucleusTeq.College.Level.Counselling.model.StudentAllocation;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface StudentAllocationRepository extends JpaRepository<StudentAllocation, Long> {

    boolean existsByRollNumber(String rollNumber);

    StudentAllocation findByRollNumber(String rollNumber);

}
