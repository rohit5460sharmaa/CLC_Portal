package NucleusTeq.College.Level.Counselling.DTOs;

public class AuthResponse {
    private String token;
    private String userType;
    private String username;

    // Default constructor
    public AuthResponse() {}

    // Constructor with all fields
    public AuthResponse(String token, String userType, String username) {
        this.token = token;
        this.userType = userType;
        this.username = username;
    }

    // Getters and Setters
    public String getToken() {
        return token;
    }

    public void setToken(String token) {
        this.token = token;
    }

    public String getUserType() {
        return userType;
    }

    public void setUserType(String userType) {
        this.userType = userType;
    }

    public String getUsername() {
        return username;
    }

    public void setUsername(String username) {
        this.username = username;
    }
}