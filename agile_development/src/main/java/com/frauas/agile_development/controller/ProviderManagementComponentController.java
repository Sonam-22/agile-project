package com.frauas.agile_development.controller;

import java.util.*;

import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.JsonNode;
import com.frauas.agile_development.model.*;
import com.frauas.agile_development.service.*;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api")
@CrossOrigin("*")
public class ProviderManagementComponentController {

    @Autowired
    private ProviderManagementComponentService providerManagementComponentService;
    @Autowired
    private DomainService domainService;
    @Autowired
    private RoleService roleService;
    @Autowired
    private AuthService authService;

    @Autowired
    private OfferService offerService;

    private StandardExperienceLevel experienceLevel;

    private StandardTechCatalog technologiesCatalog;

    @Autowired
    private MasterAgreementTypeServiceImpl masterAgreementTypeServiceImpl;

    @GetMapping("/techCataloglevels")
    public StandardTechCatalog[] getAllTechnologyCatalogs() {
        return technologiesCatalog.values();
    }

    @GetMapping("/experiencelevels")
    public StandardExperienceLevel[] getAllExpLevels() {
        return experienceLevel.values();
    }

    @GetMapping("/roles")
    public List<StandardRoles> getAllRoles() {
        return roleService.getAllRoles();
    }

    @GetMapping("/domains")
    public List<StandardDomains> getAllDomains() {
        return domainService.getAllDomains();
    }

    @PostMapping("/adddomains")
    public List<StandardDomains> addDomains(@RequestBody List<StandardDomains> domains) {
        return domainService.addDomains(domains);
    }

    @PostMapping("/addProvider")
    public Provider addProvider(@RequestBody Provider provider) {
        return providerManagementComponentService.saveProvider(provider);
    }

    @PostMapping("/login")
    public JsonNode login(@RequestBody Map<String, String> credentials) throws JsonProcessingException {
        return authService.login(credentials);
    }

    @GetMapping("/providers")
    public List<Provider> findAllProviders() {
        return providerManagementComponentService.getProviders();
    }

    @GetMapping("/providerById/{id}")
    public Provider findProviderById(@PathVariable int id) {
        return providerManagementComponentService.getProviderById(id);
    }

    @GetMapping(value = "/mastertype/all")
    public ResponseEntity<List<MasterAgreementType>> getMasterAgreements() {
        List<MasterAgreementType> masterAgreements = masterAgreementTypeServiceImpl.getMasterAgreements();
        return new ResponseEntity<>(masterAgreements, HttpStatus.OK);
    }

    @GetMapping(value = "/getmastertype")
    public ResponseEntity<MasterAgreementType> addMasterAgreements(@RequestParam("id") int masterId) {
        MasterAgreementType masterAgreements = masterAgreementTypeServiceImpl.getMasterAgreement(masterId);
        return new ResponseEntity<>(masterAgreements, HttpStatus.OK);
    }

    @PostMapping(value = "/addmastertype")
    public ResponseEntity<MasterAgreementType> addMasterAgreements(
            @RequestBody MasterAgreementType masterAgreementType) {
        MasterAgreementType newMasterAgreement = masterAgreementTypeServiceImpl.addMasterAgreement(masterAgreementType);
        return new ResponseEntity<>(newMasterAgreement, HttpStatus.OK);
    }

    @PutMapping("/update/{id}")
    public ResponseEntity<MasterAgreementType> updateMasterAgreement(
            @PathVariable int id,
            @RequestBody MasterAgreementType updatedMasterAgreement) {

        MasterAgreementType updated = masterAgreementTypeServiceImpl.updateMasterAgreement(id, updatedMasterAgreement);

        if (updated != null) {
            return new ResponseEntity<>(updated, HttpStatus.OK);
        } else {
            return new ResponseEntity<>(HttpStatus.NOT_FOUND);
        }
    }

    @PutMapping("/updateprovideroffer")
    public ResponseEntity<Provider> updateProviderWithMat(@RequestParam("id") int id, @RequestBody Provider updatedprovider) {
        Provider updated = providerManagementComponentService
                .updateProviderdetails(id, updatedprovider);

        if (updated != null) {
            return new ResponseEntity<>(updated, HttpStatus.OK);
        } else {
            return new ResponseEntity<>(HttpStatus.NOT_FOUND);
        }
    }

/*    @PutMapping("/linkmasterwithtoffer/{id}")
    public ResponseEntity<MasterAgreementType> updateMasterAgreementOffer(
            @PathVariable int id,
            @RequestBody MasterAgreementType updatedMasterAgreement) throws Exception {

        MasterAgreementType updated = masterAgreementTypeServiceImpl.updateMasterAgreementWithOfferedProviders(id);

        if (updated != null) {
            return new ResponseEntity<>(updated, HttpStatus.OK);
        } else {
            return new ResponseEntity<>(HttpStatus.NOT_FOUND);
        }
    }*/

    @DeleteMapping(value = "/deletemastertype")
    public ResponseEntity<Void> removeMasterAgreement(@RequestParam("id") int id) {
        try {
            masterAgreementTypeServiceImpl.deleteMasterAgreement(id);

            return ResponseEntity.ok().build();
        } catch (Exception e) {

            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }
    }

    @PutMapping("/saveofferdetails")
    public ResponseEntity<OfferRole> modifyOffer(@RequestBody OfferRole offerRole,
                                              @RequestParam("masterid") int mid,
                                              @RequestParam("providername") String pname,
                                                 @RequestParam (value= "rating",required = false) String rating,
                                              @RequestParam ("offerid") String offerId) throws Exception {

        OfferRole savedOffer = offerService.updateOfferDetails(offerId, offerRole,rating);

        offerService.postAcceptOfferTo3a(offerId);

        //Consequently update the corresponding  master agreemnet type  with the provider name details in role
        MasterAgreementType updated = masterAgreementTypeServiceImpl.updateMasterAgreementWithOfferedProviders(mid,pname);
        providerManagementComponentService.updateProviderAfterOffered(pname, offerRole,rating);

        return new ResponseEntity<>(savedOffer, HttpStatus.OK);
    }

    @GetMapping("/getAlloffers")
    public ResponseEntity<List<OfferRole>> addOffer() {
        List<OfferRole> offerList = offerService.getallOffers();
        return new ResponseEntity<>(offerList, HttpStatus.OK);
    }

    @GetMapping("/fetchoffersforui")
    public ResponseEntity<List<OfferRole>> fetchOffers() {

        List<OfferRole> offerList = offerService.fetchOffersForm3a();

        return new ResponseEntity<>(offerList, HttpStatus.OK);
    }



    @DeleteMapping(value = "/deleteprovider")
    public ResponseEntity<Void> removeAProvider(@RequestParam("id") int id) {
        try {
            providerManagementComponentService.deleteProvider(id);

            return ResponseEntity.ok().build();
        } catch (Exception e) {

            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }
    }


}