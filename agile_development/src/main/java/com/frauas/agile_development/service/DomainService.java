package com.frauas.agile_development.service;

import java.util.List;

import com.frauas.agile_development.model.StandardDomains;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.frauas.agile_development.repository.DomainRepository;

@Service
public class DomainService {

  @Autowired
  private DomainRepository domainRepository;

  public List<StandardDomains> getAllDomains() {
    return domainRepository.findAll();
  }

  public List<StandardDomains> addDomains(List<StandardDomains> domains) {

    return domainRepository.saveAll(domains);
  }
}
