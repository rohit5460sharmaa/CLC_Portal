package NucleusTeq.College.Level.Counselling.DTOs;

public class AuthResponse {
    private String token;
    private String userType;  // Add this fiel
    private String userName;

    public AuthResponse(String token, String userType, String userName) {
        this.token = token;
        this.userType = userType;
        this.userName = userName;
    }

    public String getToken() {
        return token;
    }

    public String getUserType() {
        return userType;
    }
    
    public String getUserName() {
        return userName;
    }
}
