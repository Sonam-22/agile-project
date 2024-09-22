package com.frauas.agile_development.model;

import com.fasterxml.jackson.annotation.JsonInclude;
import com.fasterxml.jackson.annotation.JsonProperty;
import jakarta.persistence.*;
import lombok.Data;

import java.io.Serializable;
import java.util.List;

@Data
@Entity
@JsonInclude(JsonInclude.Include.NON_NULL)
public class OfferRole implements Serializable {

	@Id
	@GeneratedValue(strategy = GenerationType.IDENTITY)
	private Integer id;
	@JsonProperty("roleName")
	private String roleName;

	@JsonProperty("experienceLevel")
	private String experienceLevel;

	@JsonProperty("technologiesCatalog")
	private String technologiesCatalog;

	@JsonProperty("domainId")
	private Integer domainId;

	@JsonProperty("domainName")
	private String domainName;

	@JsonProperty("masterAgreementTypeId")
	private Integer masterAgreementTypeId;

	@JsonProperty("masterAgreementTypeName")
	private String masterAgreementTypeName;

	@OneToMany(cascade = CascadeType.ALL)
	@JsonProperty("provider")
	private List<OfferProvider> provider;

	public OfferRole(Integer id, String roleName, String experienceLevel, String technologiesCatalog,List<OfferProvider> provider) {
		this.id = id;
		this.roleName = roleName;
		this.experienceLevel = experienceLevel;
		this.technologiesCatalog = technologiesCatalog;
		this.provider = provider;

	}

	public OfferRole() {
	}

	public Integer getDomainId() {
		return domainId;
	}

	public void setDomainId(Integer domainId) {
		this.domainId = domainId;
	}

	public String getDomainName() {
		return domainName;
	}

	public void setDomainName(String domainName) {
		this.domainName = domainName;
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

	public List<OfferProvider> getProvider() {
		return provider;
	}

	public void setProvider(List<OfferProvider> provider) {
		this.provider = provider;
	}

	public Integer getId() {
		return id;
	}

	public void setId(Integer id) {
		this.id = id;
	}

	public String getRoleName() {
		return roleName;
	}

	public void setRoleName(String roleName) {
		this.roleName = roleName;
	}

	public String getExperienceLevel() {
		return experienceLevel;
	}

	public void setExperienceLevel(String experienceLevel) {
		this.experienceLevel = experienceLevel;
	}

	public String getTechnologiesCatalog() {
		return technologiesCatalog;
	}

	public void setTechnologiesCatalog(String technologiesCatalog) {
		this.technologiesCatalog = technologiesCatalog;
	}


	@Override
	public String toString() {
		return "OfferRole{" +
				"id=" + id +
				", roleName='" + roleName + '\'' +
				", experienceLevel='" + experienceLevel + '\'' +
				", technologiesCatalog='" + technologiesCatalog + '\'' +
				", domainId=" + domainId +
				", domainName='" + domainName + '\'' +
				", masterAgreementTypeId=" + masterAgreementTypeId +
				", masterAgreementTypeName='" + masterAgreementTypeName + '\'' +
				", provider=" + provider +
				'}';
	}
}
