package com.frauas.agile_development.model;

import jakarta.persistence.*;

import java.util.List;

@Entity
@Table(name = "Master_Table")
public class MasterAgreementType {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer masterAgreementTypeId;

    private String masterAgreementTypeName;

    private String validFrom;
    private String validUntil;
    private String dailyrateIndicator;
    private String deadline;
    private String teamdeadline;
    private String workscontractdeadline;
    private String isAccepted;
    private List<String> providerNames;
    private String userName;
    private String userType;

    @OneToMany(cascade = CascadeType.ALL)
    //@JoinColumn(name = "master_agreement_id", referencedColumnName = "masterAgreementTypeId")
    private List<Domain> domains;

    public MasterAgreementType() {
    }

    public MasterAgreementType(int masterAgreementTypeId, String masterAgreementTypeName, String validFrom,
                               String validUntil, String dailyrateIndicator, String deadline, String teamdeadline, String isAccepted,
                               String workscontractdeadline, List<String> offeredProviderList, List<Domain> domains, String userName, String userType) {
        super();
        this.masterAgreementTypeId = masterAgreementTypeId;
        this.masterAgreementTypeName = masterAgreementTypeName;
        this.validFrom = validFrom;
        this.validUntil = validUntil;
        this.dailyrateIndicator = dailyrateIndicator;
        this.deadline = deadline;
        this.teamdeadline = teamdeadline;
        this.workscontractdeadline = workscontractdeadline;
        this.domains = domains;
        this.isAccepted = isAccepted;
        this.userName = userName;
        this.userType = userType;
        this.providerNames=offeredProviderList;
    }

    public List<Domain> getDomains() {
        return domains;
    }

    public void setDomains(List<Domain> domains) {
        this.domains = domains;
    }

    public Integer getMasterAgreementTypeId() {
        return masterAgreementTypeId;
    }

    public void setMasterAgreementTypeId(Integer masterAgreementTypeId) {
        this.masterAgreementTypeId = masterAgreementTypeId;
    }

    public String getMasterAgreementTypeName() {
        return masterAgreementTypeName;
    }

    public void setMasterAgreementTypeName(String masterAgreementTypeName) {
        this.masterAgreementTypeName = masterAgreementTypeName;
    }

    public String getValidFrom() {
        return validFrom;
    }

    public void setValidFrom(String validFrom) {
        this.validFrom = validFrom;
    }

    public String getValidUntil() {
        return validUntil;
    }

    public void setValidUntil(String validUntil) {
        this.validUntil = validUntil;
    }

    public String getDailyrateIndicator() {
        return dailyrateIndicator;
    }

    public void setDailyrateIndicator(String dailyrateIndicator) {
        this.dailyrateIndicator = dailyrateIndicator;
    }

    public String getDeadline() {
        return deadline;
    }

    public void setDeadline(String deadline) {
        this.deadline = deadline;
    }

    public String getTeamdeadline() {
        return teamdeadline;
    }

    public void setTeamdeadline(String teamdeadline) {
        this.teamdeadline = teamdeadline;
    }

    public String getWorkscontractdeadline() {
        return workscontractdeadline;
    }

    public void setWorkscontractdeadline(String workscontractdeadline) {
        this.workscontractdeadline = workscontractdeadline;
    }

    public String getUserName() {
        return userName;
    }

    public void setUserName(String userName) {
        this.userName = userName;
    }

    public String getUserType() {
        return userType;
    }

    public void setUserType(String userType) {
        this.userType = userType;
    }

    public List<String> getProviderNames() {
        return providerNames;
    }

    public void setProviderNames(List<String> providerNames) {
        this.providerNames = providerNames;
    }

    public String getIsAccepted() {
        return isAccepted;
    }

    public void setIsAccepted(String isAccepted) {
        this.isAccepted = isAccepted;
    }

    @Override
    public String toString() {
        return "MasterAgreementType [masterAgreementTypeId=" + masterAgreementTypeId + ", masterAgreementTypeName="
                + masterAgreementTypeName + ", validFrom=" + validFrom + ", validUntil=" + validUntil
                + ", dailyrateIndicator=" + dailyrateIndicator + ", deadline=" + deadline + ", teamdeadline="
                + teamdeadline + ", workscontractdeadline=" + workscontractdeadline + "]";
    }

}
