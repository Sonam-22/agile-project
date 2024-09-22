package com.frauas.agile_development.model;


import java.io.Serializable;
import java.util.List;
import java.util.Objects;

import jakarta.persistence.CascadeType;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.Id;
import jakarta.persistence.OneToMany;
import jakarta.persistence.Table;


@Entity
@Table(name = "Provider")
public class Provider implements Serializable {
    @Id
    @GeneratedValue
    private Integer providerId;
    private String providerName;
    @OneToMany(cascade = CascadeType.ALL)
    private List<Domain> domains;
    private String address;
    private String existsSince;
    private String validFrom;
    private String validUntil;
    private String experienceLevel;
    private String technologyLevel;
    private Float price;

	private String providerRating;


	private String isAccepted;

	private String userName;

	private String userType;


    public Provider() {
   
    }

	public Provider(Integer providerId, String providerName, List<Domain> domains, String address, String existsSince,
					String validFrom, String validUntil, String experienceLevel, String technologyLevel, Float price,
					String isAccepted, String userName, String userType) {
		super();
		this.providerId = providerId;
		this.providerName = providerName;
		this.domains = domains;
		this.address = address;
		this.existsSince = existsSince;
		this.validFrom = validFrom;
		this.validUntil = validUntil;
		this.experienceLevel = experienceLevel;
		this.technologyLevel = technologyLevel;
		this.price = price;
		this.isAccepted = isAccepted;
		this.userName = userName;
		this.userType = userType;
	}

	public String getProviderRating() {
		return providerRating;
	}

	public void setProviderRating(String providerRating) {
		this.providerRating = providerRating;
	}

	public Integer getProviderId() {
		return providerId;
	}

	public void setProviderId(Integer providerId) {
		this.providerId = providerId;
	}

	public String getProviderName() {
		return providerName;
	}

	public void setProviderName(String providerName) {
		this.providerName = providerName;
	}

	public List<Domain> getDomains() {
		return domains;
	}

	public void setDomains(List<Domain> domains) {
		this.domains = domains;
	}

	public String getAddress() {
		return address;
	}

	public void setAddress(String address) {
		this.address = address;
	}

	public String getExistsSince() {
		return existsSince;
	}

	public void setExistsSince(String existsSince) {
		this.existsSince = existsSince;
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

	public String getExperienceLevel() {
		return experienceLevel;
	}

	public void setExperienceLevel(String experienceLevel) {
		this.experienceLevel = experienceLevel;
	}

	public String getTechnologyLevel() {
		return technologyLevel;
	}

	public void setTechnologyLevel(String technologyLevel) {
		this.technologyLevel = technologyLevel;
	}

	public Float getPrice() {
		return price;
	}

	public void setPrice(Float price) {
		this.price = price;
	}

	public String getIsAccepted() {
		return isAccepted;
	}

	public void setAccepted(String accepted) {
		this.isAccepted = accepted;
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

	@Override
	public int hashCode() {
		return Objects.hash(address, domains, existsSince, experienceLevel, price, providerId,
				providerName, technologyLevel, validFrom, validUntil);
	}

	@Override
	public boolean equals(Object obj) {
		if (this == obj)
			return true;
		if (obj == null)
			return false;
		if (getClass() != obj.getClass())
			return false;
		Provider other = (Provider) obj;
		return Objects.equals(address, other.address) && Objects.equals(domains, other.domains)
				&& Objects.equals(existsSince, other.existsSince)
				&& Objects.equals(experienceLevel, other.experienceLevel)
				&& Objects.equals(price, other.price) && Objects.equals(providerId, other.providerId)
				&& Objects.equals(providerName, other.providerName)
				&& Objects.equals(technologyLevel, other.technologyLevel) && Objects.equals(validFrom, other.validFrom)
				&& Objects.equals(validUntil, other.validUntil);
	}

	@Override
	public String toString() {
		return "Provider [providerId=" + providerId + ", providerName=" + providerName + ", domains=" + domains
				+ ", address=" + address + ", existsSince=" + existsSince + ", validFrom=" + validFrom + ", validUntil="
				+ validUntil + ", experienceLevel=" + experienceLevel + ", technologyLevel=" + technologyLevel
				+ ", price=" + price + "]";
	}
	
	
	
}
