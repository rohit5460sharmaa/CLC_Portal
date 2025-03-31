package NucleusTeq.College.Level.Counselling.model;

import jakarta.persistence.*;

@Entity
@Table(name = "student_allocation")
public class StudentAllocation {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "student_name", nullable = false)
    private String studentName;

    @Column(name = "roll_number", nullable = false, unique = true)
    private String rollNumber;

    @Column(name = "rank", nullable = false)
    private int rank;

    @Column(name = "category", nullable = false)
    private String category;

    @Column(name = "branch", nullable = false)
    private String branch;

    // Getters and Setters
    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getStudentName() {
        return studentName;
    }

    public void setStudentName(String studentName) {
        this.studentName = studentName;
    }

    public String getRollNumber() {
        return rollNumber;
    }

    public void setRollNumber(String rollNumber) {
        this.rollNumber = rollNumber;
    }

    public int getRank() {
        return rank;
    }

    public void setRank(int rank) {
        this.rank = rank;
    }

    public String getCategory() {
        return category;
    }

    public void setCategory(String category) {
        this.category = category;
    }

    public String getBranch() {
        return branch;
    }

    public void setBranch(String branch) {
        this.branch = branch;
    }

    @Override
    public String toString() {
        return "StudentAllocation{" +
                "id=" + id +
                ", studentName='" + studentName + '\'' +
                ", rollNumber='" + rollNumber + '\'' +
                ", rank=" + rank +
                ", category='" + category + '\'' +
                ", branch='" + branch + '\'' +
                '}';
    }
}
