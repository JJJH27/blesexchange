export type Language = 'es' | 'en';

export interface Translation {
  nav: {
    home: string;
    token: string;
    utility: string;
    games: string;
    exchange: string;
  };
  hero: {
    subtitle: string;
    description: string;
    cta: string;
  };
  tokenSection: {
    title: string;
    propsTitle: string;
    propName: string;
    propSymbol: string;
    propType: string;
    propSupply: string;
    propContract: string;
    explorerText: string;
    tokenomicsTitle: string;
    tokLiquidity: string;
    tokUtility: string;
    tokSocial: string;
    tokProject: string;
    addNetworkBtn: string;
    addTokenBtn: string;
    holdersLabel: string;
    transfersLabel: string;
  };
  utilitySection: {
    title: string;
    p1: string;
    p2: string;
    p3: string;
    p4: string;
    walletWeb: string;
    walletAndroid: string;
  };
  gamesSection: {
    title: string;
    introText: string;
    poolTitle: string;
    poolDesc: string;
    poolPoint1: string;
    poolPoint2: string;
    poolPoint3: string;
    poolPoint4: string;
    poolLink: string;
  };
  exchangeSection: {
    title: string;
    p1: string;
    p2: string;
    p3: string;
    imageLabel: string;
  };
  features: {
    socialImpactTitle: string;
    socialImpactDesc: string;
    entertainmentTitle: string;
    entertainmentDesc: string;
    communityTitle: string;
    communityDesc: string;
    economyTitle: string;
    economyDesc: string;
  };
  staking: {
    title: string;
    description: string;
    featuresTitle: string;
    feature1: string;
    feature2: string;
    feature3?: string;
    ctaButton: string;
  };
  prediction: {
    title: string;
    description: string;
    featuresTitle: string;
    feature1: string;
    feature2: string;
    feature3: string;
    ctaButton: string;
  };
  contact: {
    title: string;
    subtitle: string;
  };
  commerce: {
    title: string;
    subtitle: string;
  };
  footer: {
    copyright: string;
  };
}