package NucleusTeq.College.Level.Counselling.model;

import jakarta.persistence.*;

@Entity
@Table(name = "users")
public class User {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(unique = true, nullable = false)
    private String username; // If null, it takes email value

    @Column(unique = true, nullable = false)
    private String email; // Email field remains

    @Column(nullable = false)
    private String password;

    @Column(nullable = false)
    private String role; // STUDENT, ADMIN, OFFICER

    @Column(nullable = false)
    private boolean enabled = true; // ✅ New field (Default: true)

    @Column(nullable = false)
    private String name; // New field: Full name

    @Column(nullable = false)
    private String phone; // New field: Contact number

    @Column(nullable = false)
    private String department; // New field: Department

    // Default constructor (Required by JPA)
    public User() {}

    // Constructor for Student registration (Username is required)
    public User(String username, String email, String password) {
        this.username = username;
        this.email = email;
        this.password = password;
        this.role = "STUDENT"; // Default role
        this.enabled = true;   // Enable user by default
    }

    // Constructor for Admin/Officer (If username is null, set email as username)
    public User(String username, String email, String password, String role, String name, String phone, String department) {
        this.email = email;
        this.username = (username == null || username.trim().isEmpty()) ? email : username;
        this.password = password;
        this.role = role;
        this.enabled = true;   // Enable user by default
        this.name = name;
        this.phone = phone;
        this.department = department;
    }

    // Getters and Setters
    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getUsername() {
        return username;
    }

    public void setUsername(String username) {
        this.username = (username == null || username.trim().isEmpty()) ? this.email : username;
    }

    public String getEmail() {
        return email;
    }

    public void setEmail(String email) {
        this.email = email;
    }

    public String getPassword() {
        return password;
    }

    public void setPassword(String password) {
        this.password = password;
    }

    public String getRole() {
        return role;
    }

    public void setRole(String role) {
        this.role = role;
    }

    public boolean isEnabled() {
        return enabled;
    }

    public void setEnabled(boolean enabled) {
        this.enabled = enabled;
    }

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public String getPhone() {
        return phone;
    }

    public void setPhone(String phone) {
        this.phone = phone;
    }

    public String getDepartment() {
        return department;
    }

    public void setDepartment(String department) {
        this.department = department;
    }

    // toString() Method
    @Override
    public String toString() {
        return "User{" +
                "id=" + id +
                ", username='" + username + '\'' +
                ", email='" + email + '\'' +
                ", role='" + role + '\'' +
                ", enabled=" + enabled +
                ", name='" + name + '\'' +
                ", phone='" + phone + '\'' +
                ", department='" + department + '\'' +
                '}';
    }
}
