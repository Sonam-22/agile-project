export type Offer = {
  id: number;
  roleName: string;
  experienceLevel: string;
  technologiesCatalog: string;
  domainId: number;
  domainName: string;
  masterAgreementTypeId: number;
  masterAgreementTypeName: string;
  provider: OfferProvider[];
};


export enum Action {
  ACCPET = "ACCEPT",
  REJECT = "REJECT",
}

export type OfferProvider = {
  id: number;
  offerId: string;
  name: string;
  quotePrice: number;
  isAccepted?: boolean;
  cycle: number;
}

export type OfferPayload = {
  provider: OfferProvider;
  offer: Offer;
  rating?: number;
  action: Action;
}
