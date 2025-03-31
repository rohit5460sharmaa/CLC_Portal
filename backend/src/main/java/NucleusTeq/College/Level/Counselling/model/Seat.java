package NucleusTeq.College.Level.Counselling.model;

import jakarta.persistence.*;

@Entity
@Table(name = "seat")
public class Seat {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id")
    private Long id;

    @Column(name = "branch", nullable = false, unique = true)
    private String branch;

    @Column(name = "general_seats", nullable = false)
    private Integer generalSeats;

    @Column(name = "obc_seats", nullable = false)
    private Integer obcSeats;

    @Column(name = "sc_seats", nullable = false)
    private Integer scSeats;

    @Column(name = "st_seats", nullable = false)
    private Integer stSeats;

    @Column(name = "filled_general_seats", nullable = false)
    private Integer filledGeneralSeats;

    @Column(name = "filled_obc_seats", nullable = false)
    private Integer filledObcSeats;

    @Column(name = "filled_sc_seats", nullable = false)
    private Integer filledScSeats;

    @Column(name = "filled_st_seats", nullable = false)
    private Integer filledStSeats;

    @Column(name = "total_seats", nullable = false)
    private Integer totalSeats;

    @Column(name = "vacant_seats", nullable = false)
    private Integer vacantSeats;

    // Calculate total seats
    public int calculateTotalSeats() {
        return (generalSeats != null ? generalSeats : 0) + 
               (obcSeats != null ? obcSeats : 0) + 
               (scSeats != null ? scSeats : 0) + 
               (stSeats != null ? stSeats : 0);
    }

    // Calculate filled seats
    public int calculateFilledSeats() {
        return (filledGeneralSeats != null ? filledGeneralSeats : 0) + 
               (filledObcSeats != null ? filledObcSeats : 0) + 
               (filledScSeats != null ? filledScSeats : 0) + 
               (filledStSeats != null ? filledStSeats : 0);
    }

    // Calculate vacant seats
    public int calculateVacantSeats() {
        return calculateTotalSeats() - calculateFilledSeats();
    }

    // Update filled seats dynamically
    public void incrementFilledSeats(String category) {
        switch (category.toLowerCase()) {
            case "general" -> this.filledGeneralSeats = (filledGeneralSeats != null ? filledGeneralSeats : 0) + 1;
            case "obc" -> this.filledObcSeats = (filledObcSeats != null ? filledObcSeats : 0) + 1;
            case "sc" -> this.filledScSeats = (filledScSeats != null ? filledScSeats : 0) + 1;
            case "st" -> this.filledStSeats = (filledStSeats != null ? filledStSeats : 0) + 1;
        }
        updateSeatCounts();
    }

    @PrePersist
    @PreUpdate
    public void updateSeatCounts() {
        this.totalSeats = calculateTotalSeats();
        this.vacantSeats = calculateVacantSeats();
    }

    // Getters and Setters
    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public String getBranch() { return branch; }
    public void setBranch(String branch) { this.branch = branch; }

    public Integer getGeneralSeats() { return generalSeats; }
    public void setGeneralSeats(Integer generalSeats) { this.generalSeats = generalSeats; }

    public Integer getObcSeats() { return obcSeats; }
    public void setObcSeats(Integer obcSeats) { this.obcSeats = obcSeats; }

    public Integer getScSeats() { return scSeats; }
    public void setScSeats(Integer scSeats) { this.scSeats = scSeats; }

    public Integer getStSeats() { return stSeats; }
    public void setStSeats(Integer stSeats) { this.stSeats = stSeats; }

    public Integer getFilledGeneralSeats() { return filledGeneralSeats; }
    public void setFilledGeneralSeats(Integer filledGeneralSeats) { this.filledGeneralSeats = filledGeneralSeats; }

    public Integer getFilledObcSeats() { return filledObcSeats; }
    public void setFilledObcSeats(Integer filledObcSeats) { this.filledObcSeats = filledObcSeats; }

    public Integer getFilledScSeats() { return filledScSeats; }
    public void setFilledScSeats(Integer filledScSeats) { this.filledScSeats = filledScSeats; }

    public Integer getFilledStSeats() { return filledStSeats; }
    public void setFilledStSeats(Integer filledStSeats) { this.filledStSeats = filledStSeats; }

    public Integer getTotalSeats() { return totalSeats; }
    public Integer getVacantSeats() { return vacantSeats; }

    public void updateSeatByBranch(Seat seatDetails) {
        if (seatDetails.getGeneralSeats() != null) this.generalSeats = seatDetails.getGeneralSeats();
        if (seatDetails.getObcSeats() != null) this.obcSeats = seatDetails.getObcSeats();
        if (seatDetails.getScSeats() != null) this.scSeats = seatDetails.getScSeats();
        if (seatDetails.getStSeats() != null) this.stSeats = seatDetails.getStSeats();
        if (seatDetails.getFilledGeneralSeats() != null) this.filledGeneralSeats = seatDetails.getFilledGeneralSeats();
        if (seatDetails.getFilledObcSeats() != null) this.filledObcSeats = seatDetails.getFilledObcSeats();
        if (seatDetails.getFilledScSeats() != null) this.filledScSeats = seatDetails.getFilledScSeats();
        if (seatDetails.getFilledStSeats() != null) this.filledStSeats = seatDetails.getFilledStSeats();
        updateSeatCounts();
    }

    @Override
    public String toString() {
        return "Seat{" +
                "id=" + id +
                ", branch='" + branch + '\'' +
                ", totalSeats=" + totalSeats +
                ", vacantSeats=" + vacantSeats +
                ", filledGeneralSeats=" + filledGeneralSeats +
                ", filledObcSeats=" + filledObcSeats +
                ", filledScSeats=" + filledScSeats +
                ", filledStSeats=" + filledStSeats +
                ", filledSeats=" + calculateFilledSeats() +
                '}';
    }
}
