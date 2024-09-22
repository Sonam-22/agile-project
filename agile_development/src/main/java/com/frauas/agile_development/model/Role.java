package com.frauas.agile_development.model;

import jakarta.persistence.*;

import lombok.Data;

import java.io.Serializable;

@Data
@Entity
public class Role implements Serializable {

	@Id
	@GeneratedValue(strategy = GenerationType.IDENTITY)
	private Integer id;
	private String roleName;
	private String experienceLevel;
	private String technologiesCatalog;

	public Float getRoleprice() {
		return roleprice;
	}

	public void setRoleprice(Float roleprice) {
		this.roleprice = roleprice;
	}

	private Float roleprice;
//
//	@ManyToOne
//	private Domain domain;
	public Role() {
	}

	public Role(Integer id, String roleName, String experienceLevel, String technologiesCatalog) {
		super();
		this.id = id;
		this.roleName = roleName;
		this.experienceLevel = experienceLevel;
		this.technologiesCatalog = technologiesCatalog;
	}
	public Integer getId() {	return id; }
	public void setId(Integer id) { this.id = id; }
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
		return "Role [roleName=" + id + "roleName=" + roleName + ", experienceLevel=" + experienceLevel + ", technologiesLevel="
				+ technologiesCatalog + "]";
	}

	
}
