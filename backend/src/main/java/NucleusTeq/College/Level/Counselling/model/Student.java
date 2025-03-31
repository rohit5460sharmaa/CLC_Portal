package NucleusTeq.College.Level.Counselling.model;

import jakarta.persistence.*;
import java.time.LocalDate;

import com.fasterxml.jackson.annotation.JsonProperty;

@Entity
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
    @JsonProperty 
    private boolean admitted = false; // Track admission status

    @Column(nullable = false)
    private String category = "GENERAL"; // Category for counselling (e.g., GENERAL, OBC, SC, ST)

    @Column(nullable = false)
    private String password; // Password for student authentication

    // Getters and Setters
    public String getRollNumber() {
        return rollNumber;
    }

    public void setRollNumber(String rollNumber) {
        this.rollNumber = rollNumber;
    }

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public int getRank() {
        return rank;
    }

    public void setRank(int rank) {
        this.rank = rank;
    }

    public String getEmail() {
        return email;
    }

    public void setEmail(String email) {
        this.email = email;
    }

    public String getPhone() {
        return phone;
    }

    public void setPhone(String phone) {
        this.phone = phone;
    }

    public String getAddress() {
        return address;
    }

    public void setAddress(String address) {
        this.address = address;
    }

    public String getFatherName() {
        return fatherName;
    }

    public void setFatherName(String fatherName) {
        this.fatherName = fatherName;
    }

    public LocalDate getDob() {
        return dob;
    }

    public void setDob(LocalDate dob) {
        this.dob = dob;
    }

    public boolean admitted() {
        return admitted;
    }

    public void setAdmitted(boolean admitted) {
        this.admitted = admitted;
    }

    public String getCategory() {
        return category;
    }

    public void setCategory(String category) {
        this.category = category;
    }

    public String getPassword() {
        return password;
    }

    public void setPassword(String password) {
        this.password = password;
    }

    // toString method
    @Override
    public String toString() {
        return "Student{" +
                "rollNumber='" + rollNumber + '\'' +
                ", name='" + name + '\'' +
                ", rank=" + rank +
                ", email='" + email + '\'' +
                ", phone='" + phone + '\'' +
                ", address='" + address + '\'' +
                ", fatherName='" + fatherName + '\'' +
                ", dob=" + dob +
                ", admitted=" + admitted +
                ", category='" + category + '\'' +
                ", password='" + password + '\'' +
                '}';
    }
}