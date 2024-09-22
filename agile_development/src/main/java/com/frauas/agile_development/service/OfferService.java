package com.frauas.agile_development.service;

import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.core.type.TypeReference;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.frauas.agile_development.model.OfferProvider;
import com.frauas.agile_development.model.OfferRole;
import com.frauas.agile_development.repository.OfferRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.*;
import org.springframework.http.converter.json.MappingJackson2HttpMessageConverter;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestOperations;
import org.springframework.web.client.RestTemplate;

import java.util.*;

@Service
public class OfferService {

    @Autowired
    OfferRepository offerRepository;

    public OfferRole saveOffer(OfferRole offer) {
        return offerRepository.save(offer);
    }
    public OfferRole updateOfferDetails(String offerId, OfferRole modifiedOfferRole,String rating) throws Exception{
        Optional<OfferRole> isInDb = offerRepository.findByProviderOfferId(offerId);

        if (isInDb.isPresent()) {
            OfferRole existingOffer = isInDb.get();
            List<OfferProvider> providers = existingOffer.getProvider();

            // Looping in  the unique provider with the matching offerId
            for (OfferProvider provider : providers) {
                if (offerId.equals(provider.getOfferId())) {
                    // Update the isAccepted field
                    provider.setAccepted(true);
                    if (null!=rating)
                    provider.setOfferProRating(rating);
                    break;
                }
            }
            // Save the updated OfferRole
            return offerRepository.save(existingOffer);
        }else {
            return null;
        }
    }

    public List<OfferRole> saveAllOffer(List<OfferRole> offerRoles) {
      final List<OfferRole> existing = offerRepository.findAll();
      existing.forEach((item) -> {
        offerRoles.stream()
            .filter((o) -> {
              return o.getDomainName().equals(item.getDomainName())
                  && o.getRoleName().equals(item.getRoleName())
                  && o.getExperienceLevel().equals(item.getExperienceLevel())
                  && o.getTechnologiesCatalog().equals(item.getTechnologiesCatalog())
                  && o.getMasterAgreementTypeId().equals(item.getMasterAgreementTypeId());
            })
            .findFirst()
            .ifPresent(o -> o.setId(item.getId()));
      });
      return offerRepository.saveAll(offerRoles);
    }

    public List<OfferRole> getallOffers() {
        return offerRepository.findAll();
    }



    public List<OfferRole> fetchOffersForm3a() {
        HttpHeaders headers = new HttpHeaders();
        headers.setAccept(Collections.singletonList(MediaType.APPLICATION_JSON));
        HttpEntity<String> entity = new HttpEntity<>(headers);
        RestOperations restTemplate = new RestTemplate();
        ((RestTemplate) restTemplate).getMessageConverters().add(new MappingJackson2HttpMessageConverter());

// The sample of th eAPI response from 3a is like below
/*[ { "roleName": "Data Architect", "experienceLevel": "INTERMEDIATE", "technologiesCatalog": "Uncommon", "domainId": 2, "domainName": "Data", "masterAgreementTypeId": 1, "masterAgreementTypeName": "MAT1", "provider": [ { "offerId": 6, "name": "provider_y", "quotePrice": 2000, "isAccepted": false, "cycle": null } ] }, { "roleName": "DevOps Eng", "experienceLevel": "JUNIOR", "technologiesCatalog": "Common", "domainId": 4, "domainName": "Operations", "masterAgreementTypeId": 2, "masterAgreementTypeName": "MAT2", "provider": [ { "offerId": 3, "name": "FRAUAS", "quotePrice": 2000, "isAccepted": true, "cycle": null } ] }, { "roleName": "Infrastructure Engineer", "experienceLevel": "ADVANCED", "technologiesCatalog": "Rare", "domainId": 4, "domainName": "Operations", "masterAgreementTypeId": 2, "masterAgreementTypeName": "MAT2", "provider": [ { "offerId": 5, "name": "provider_y", "quotePrice": 4600, "isAccepted": null, "cycle": null } ] }, { "roleName": "Service operator", "experienceLevel": "INTERMEDIATE", "technologiesCatalog": "Common", "domainId": 4, "domainName": "Operations", "masterAgreementTypeId": 1, "masterAgreementTypeName": "MAT1", "provider": [ { "offerId": 1, "name": "FRAUAS", "quotePrice": 2500, "isAccepted": null, "cycle": null }, { "offerId": 4, "name": "provider_y", "quotePrice": 2000, "isAccepted": null, "cycle": null } ] }, { "roleName": "Solution Architect", "experienceLevel": "ADVANCED", "technologiesCatalog": "Rare", "domainId": 1, "domainName": "DevAndConsult", "masterAgreementTypeId": 1, "masterAgreementTypeName": "MAT1", "provider": [ { "offerId": 2, "name": "FRAUAS", "quotePrice": 5000, "isAccepted": null, "cycle": null } ] } ]*/


        ResponseEntity<String> response = restTemplate.exchange
                ("https://agiledev3a.pythonanywhere.com/p3aplatform/api/agreement_offers",
                        HttpMethod.GET,
                        entity,
                        String.class);
        String resp = response.getBody();

        // map the response string to POJO class
        List<OfferRole> offerList = mapResponseToPojo(resp);

        //TODO calculate average role leve price , and add a field deciding on the Cycle.
        calculateAvgandPutCycle(offerList);

        //  save to our Database before returnign to the UI
        saveAllOffer(offerList);

        //Fetch back from DB if required
        // List<OfferRole> offerListFromDb = offerService.getallOffers();
        return offerList;
    }

    private static List<OfferRole> mapResponseToPojo(String resp) {
        ObjectMapper objectMapper = new ObjectMapper();
        List<OfferRole> offerlist = null;
        try {
            // Convert JSON array to List of OfferRole objects
            offerlist = objectMapper.readValue(resp, new TypeReference<List<OfferRole>>() {});
            // Process the list of OfferRole objects
            for (OfferRole pojo : offerlist) {
                System.out.println(pojo.toString());
            }
        } catch (JsonProcessingException e) {
            e.printStackTrace();
            // Handle exception
        }
        return offerlist;
    }

    // Loop over and calculate average for each unique role level and domain and create appropriate cycle
    private void calculateAvgandPutCycle(List<OfferRole> offerlist) {

        Map<String, List<Integer>> domainRolePrices = new HashMap<>();

        // Calculate sum and count for each domain and role
        for (OfferRole pojo : offerlist) {
            String domainRoleKey = pojo.getDomainId() + "_" + pojo.getRoleName();

            domainRolePrices.computeIfAbsent(domainRoleKey, k -> new ArrayList<>());

            for (OfferProvider provider : pojo.getProvider()) {
                domainRolePrices.get(domainRoleKey).add(provider.getQuotePrice());
            }
        }

        // Calculate average for each domain and role
        Map<String, Double> domainRoleAverages = new HashMap<>();
        for (Map.Entry<String, List<Integer>> entry : domainRolePrices.entrySet()) {
            String domainRoleKey = entry.getKey();
            List<Integer> prices = entry.getValue();
            double average = calculateAverage(prices);

            domainRoleAverages.put(domainRoleKey, average);
        }

        // Add cycle value to providers
        for (OfferRole pojo : offerlist) {
            String domainRoleKey = pojo.getDomainId() + "_" + pojo.getRoleName();
            double average = domainRoleAverages.get(domainRoleKey);

            for (OfferProvider provider : pojo.getProvider()) {
                int quotePrice = provider.getQuotePrice();
                int cycle = (quotePrice <= average) ? 1 : 2;

                provider.setCycle(cycle);
            }
        }

        // Print the updated OfferRole list
        for (OfferRole pojo : offerlist) {
            System.out.println(pojo.toString());
        }
    }

    private static double calculateAverage(List<Integer> prices) {
        int sum = 0;
        for (int price : prices) {
            sum += price;
        }

        return prices.isEmpty() ? 0 : (double) sum / prices.size();
    }


public static void postAcceptOfferTo3a(String offerId){
    String apiUrl = "https://agiledev3a.pythonanywhere.com/p3aplatform/api/post_ma_offer_response";
    String isAccepted = "True";
    String requestUrl = String.format("%s?offerId=%s&isAccepted=%s", apiUrl, offerId, isAccepted);

    HttpHeaders headers = new HttpHeaders();
    headers.setContentType(MediaType.APPLICATION_JSON);


    RestTemplate restTemplate = new RestTemplate();
    HttpEntity<String> requestEntity = new HttpEntity<>(headers);

    // POST request
    ResponseEntity<String> responseEntity = restTemplate.postForEntity(requestUrl, requestEntity, String.class);
    // Verifiying Response
    System.out.println("Response: " + responseEntity.getBody());
}

}
