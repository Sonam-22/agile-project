package com.frauas.agile_development.service;

import com.frauas.agile_development.model.MasterAgreementType;

import java.util.List;

public interface MasterAgreementTypeService {
    List<MasterAgreementType> getMasterAgreements();

    MasterAgreementType getMasterAgreement(int masterAgreementTypeId);

    MasterAgreementType addMasterAgreement(MasterAgreementType masterAgreementType);

    MasterAgreementType updateMasterAgreement(int id, MasterAgreementType updatedMasterAgreement) throws MasterAgreeTypeNotFoundException;

    void deleteMasterAgreement(int id);
}
