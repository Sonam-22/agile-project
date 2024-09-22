package com.frauas.agile_development.service;

import java.util.Map;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpEntity;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpMethod;
import org.springframework.http.MediaType;
import org.springframework.stereotype.Service;
import org.springframework.util.LinkedMultiValueMap;
import org.springframework.util.MultiValueMap;
import org.springframework.web.client.RestTemplate;

import com.fasterxml.jackson.databind.JsonNode;

@Service
public class AuthService {

  @Autowired
  private RestTemplate restTemplate;
  @Value("${auth.login-url}")
  private String loginUrl;

  public JsonNode login(final Map<String, String> credentials) {
    final HttpHeaders headers = new HttpHeaders();
    headers.setContentType(MediaType.MULTIPART_FORM_DATA);

    final MultiValueMap<String, String> multiValueMap = new LinkedMultiValueMap<>();
    multiValueMap.add("username", credentials.get("username"));
    multiValueMap.add("password", credentials.get("password"));

    final HttpEntity<MultiValueMap<String, String>> request = new HttpEntity<>(multiValueMap, headers);
    return restTemplate.exchange(loginUrl, HttpMethod.POST, request, JsonNode.class)
        .getBody();
  }
}
