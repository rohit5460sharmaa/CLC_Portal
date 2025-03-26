package NucleusTeq.College.Level.Counselling.model;

import jakarta.persistence.*;
import java.util.List;

@Entity
public class Preference {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    private String studentName;
    private String rollNumber;
    private int rank;
    private String category;
    private String branches; // Stores branches as a comma-separated string

    public Preference() {}

    public Preference(String studentName, String rollNumber, int rank, String category, String branches) {
        this.studentName = studentName;
        this.rollNumber = rollNumber;
        this.rank = rank;
        this.category = category;
        this.branches = branches;
    }

    public Long getId() { return id; }
    public String getStudentName() { return studentName; }
    public String getRollNumber() { return rollNumber; }
    public int getRank() { return rank; }
    public String getCategory() { return category; }
    public List<String> getBranches() {
        return branches == null ? null : List.of(branches.split(","));
    }

    public void setId(Long id) { this.id = id; }
    public void setStudentName(String studentName) { this.studentName = studentName; }
    public void setRollNumber(String rollNumber) { this.rollNumber = rollNumber; }
    public void setRank(int rank) { this.rank = rank; }
    public void setCategory(String category) { this.category = category; }
    public void setBranches(List<String> branches) {
        this.branches = String.join(",", branches);
    }

	@Override
	public String toString() {
		return "Preference [id=" + id + ", studentName=" + studentName + ", rollNumber=" + rollNumber + ", rank=" + rank
				+ ", category=" + category + ", branches=" + branches + "]";
	}
}
