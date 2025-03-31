package NucleusTeq.College.Level.Counselling.Controller;

import NucleusTeq.College.Level.Counselling.model.Preference;
import NucleusTeq.College.Level.Counselling.Service.PreferenceService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.util.List;

@RestController
@RequestMapping("/api/preferences")
public class PreferenceController {

    private final PreferenceService preferenceService;

    public PreferenceController(PreferenceService preferenceService) {
        this.preferenceService = preferenceService;
    }

    @PostMapping("/add")
    public ResponseEntity<Preference> addPreference(@RequestBody PreferenceRequest request) {
        Preference preference = preferenceService.savePreference(
                request.getStudentName(),
                request.getRollNumber(),
                request.getRank(),
                request.getCategory(),
                request.getBranches()
        );
        return ResponseEntity.ok(preference);
    }
//all
    @GetMapping("/all")
    public ResponseEntity<List<Preference>> getAllPreferences() {
        return ResponseEntity.ok(preferenceService.getAllPreferences());
    }

    @GetMapping("/student/{rollNumber}")
    public ResponseEntity<Preference> getPreferenceByRollNumber(@PathVariable String rollNumber) {
        Preference preference = preferenceService.getPreferenceByRollNumber(rollNumber);
        return preference != null ? ResponseEntity.ok(preference) : ResponseEntity.notFound().build();
    }

    
    @DeleteMapping("/{rollNumber}")
    public ResponseEntity<String> deletePreference(@PathVariable String rollNumber) {
        preferenceService.deleteByRollNumber(rollNumber);
        return ResponseEntity.ok("Preference deleted successfully");
    }


    public static class PreferenceRequest {
        private String studentName;
        private String rollNumber;
        private int rank;
        private String category;
        private List<String> branches;

        public String getStudentName() { return studentName; }
        public String getRollNumber() { return rollNumber; }
        public int getRank() { return rank; }
        public String getCategory() { return category; }
        public List<String> getBranches() { return branches; }
    }
}
