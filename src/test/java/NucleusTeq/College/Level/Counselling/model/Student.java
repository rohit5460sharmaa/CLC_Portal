package NucleusTeq.College.Level.Counselling.model;

import jakarta.persistence.*;
import lombok.*;
import java.time.LocalDate;

@Entity
@Data // Generates Getters, Setters, toString, Equals, and HashCode
@NoArgsConstructor // Generates a no-argument constructor
@AllArgsConstructor // Generates an all-argument constructor
public class Student {

    @Id
    @Column(name = "rollnumber", unique = true, nullable = false)
    private String rollNumber; // Qualifying exam roll number (primary key)

    @Column(nullable = false)
    private String name;

    @Column(nullable = false)
    private int rank; // Rank in the qualifying exam

    @Column(nullable = false, unique = true)
    private String email; // Email should be unique

    @Column(nullable = false)
    private String phone;

    @Column(nullable = false)
    private String address;

    @Column(name = "father_name", nullable = false)
    private String fatherName;

    @Column(nullable = false)
    private LocalDate dob; // Date of birth

    @Column(nullable = false)
    private boolean admitted = false; // Track admission status

    @Column(nullable = false)
    private String category = "GENERAL"; // Category for counselling (e.g., GENERAL, OBC, SC, ST)

    @Column(nullable = false)
    private String password; // Password for student authentication

}

