package NucleusTeq.College.Level.Counselling.DTOs;

public class AuthResponse {
    private String token;
    private String userType;  // Add this field

    public AuthResponse(String token, String userType) {
        this.token = token;
        this.userType = userType;
    }

    public String getToken() {
        return token;
    }

    public String getUserType() {
        return userType;
    }
}
