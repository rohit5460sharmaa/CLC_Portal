package NucleusTeq.College.Level.Counselling.DTOs;

public class AuthRequest {
    private String username;
    private String password;
    private String userType; // New field

    // Constructors
    public AuthRequest() {}

    public AuthRequest(String username, String password, String userType) {
        this.username = username;
        this.password = password;
        this.userType = userType;
    }

    // Getters and Setters
    public String getUsername() {
        return username;
    }

    public void setUsername(String username) {
        this.username = username;
    }

    public String getPassword() {
        return password;
    }

    public void setPassword(String password) {
        this.password = password;
    }

    public String getUserType() {
        return userType;
    }

    public void setUserType(String userType) {
        this.userType = userType;
    }
}