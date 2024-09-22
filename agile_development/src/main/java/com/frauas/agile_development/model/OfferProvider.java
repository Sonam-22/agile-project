package com.frauas.agile_development.model;

import com.fasterxml.jackson.annotation.JsonProperty;
import jakarta.persistence.*;

import lombok.Data;

import com.fasterxml.jackson.annotation.JsonInclude;

@Data
@Entity
@JsonInclude(JsonInclude.Include.NON_NULL)
public class OfferProvider {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private int id;
    @JsonProperty("offerId")
    private String offerId;
    @JsonProperty("name")
    private String name;

    @JsonProperty("quotePrice")
    private Integer quotePrice;

    @JsonProperty("isAccepted")
    private Boolean isAccepted;

    private String offerProRating;
    @JsonProperty("cycle")
    private Integer cycle;

    public OfferProvider(int id, String offerId, String name, Integer quotePrice, Boolean isAccepted, int cycle, String offerProRating) {
        this.id = id;
        this.offerId = offerId;
        this.name = name;
        this.quotePrice = quotePrice;
        this.isAccepted = isAccepted;
        this.cycle = cycle;
        this.offerProRating=offerProRating;
    }

    public OfferProvider() {
    }

    public Boolean getAccepted() {
        return isAccepted;
    }

    public void setAccepted(Boolean accepted) {
        isAccepted = accepted;
    }

    public String getOfferProRating() {
        return offerProRating;
    }

    public void setOfferProRating(String offerProRating) {
        this.offerProRating = offerProRating;
    }

    public String getOfferId() {
        return offerId;
    }


    public void setOfferId(String offerId) {
        this.offerId = offerId;
    }

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public Integer getQuotePrice() {
        return quotePrice;
    }

    public void setQuotePrice(Integer quotePrice) {
        this.quotePrice = quotePrice;
    }

    public Integer getCycle() {
        return cycle;
    }

    public void setCycle(Integer cycle) {
        this.cycle = cycle;
    }
}
