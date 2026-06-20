/**
 * publicContent.ts
 * Holds rich landing, pricing, and about page content 
 * for HelixVault and molecular SaaS storage.
 */

export interface TeamMember {
  name: string;
  role: string;
  credentials: string;
  bio: string;
  initials: string;
}

export interface ValueCard {
  title: string;
  description: string;
  iconName: string;
}

export interface RoadmapMilestone {
  period: string;
  title: string;
  status: 'COMPLETED' | 'IN_PROGRESS' | 'PLANNED';
  description: string;
}

export interface StoragePreset {
  sizeTB: number;
  label: string;
  tapeCost50Y: number;
  dnaCost50Y: number;
  co2SavingsTons: number;
}

export const TEAM_MEMBERS: TeamMember[] = [
  {
    name: "Moataz Salmin",
    role: "Founder & Chief Genomics Engineer",
    credentials: "PhD Synthetic Biology, Stanford",
    bio: "Pioneered early double-helix addressing protocols. Former principal architect at molecular infrastructure groups building hardware transceivers.",
    initials: "MS"
  },
  {
    name: "Dr. Elena Rostova",
    role: "VP of Molecular Fidelity",
    credentials: "Postdoc Biochemistry, MIT",
    bio: "Specializes in codon optimization, chemical synthesis synthesis error mitigation, and homopolymer-run stabilization algorithms.",
    initials: "ER"
  },
  {
    name: "Marcus Vance",
    role: "Principal Cryptography Architect",
    credentials: "Former Cryptographer, NSA & AWS Security",
    bio: "Designed HelixVault's cascading AES-255-Molecular XOR parity standard. Dedicated to biosecurity credentialing and zero-trust key management.",
    initials: "MV"
  }
];

export const CORE_VALUES: ValueCard[] = [
  {
    title: "Centuries of Longevity",
    description: "Unlike silicon flash memory or magnetic tape which decays within 10-20 years, double-stranded DNA stored at ambient temperature maintains perfect structural fidelity for thousands of years.",
    iconName: "ShieldCheck"
  },
  {
    title: "Infinite Spatial Density",
    description: "A single gram of synthesized DNA can store up to 215 petabytes of sequence data. The entire world's cold storage archives could fit inside a mid-sized office cabinet.",
    iconName: "Maximize2"
  },
  {
    title: "Zero-Maintenance Overhead",
    description: "Standard tape archives require heavy server cooling and electricity to maintain climate parity. Encased dry biomemory requires absolute zero continuous electrical power or active cooling.",
    iconName: "Zap"
  }
];

export const ROADMAP: RoadmapMilestone[] = [
  {
    period: "Q1 - Q4 2025",
    title: "Codon Protocol V2 & Direct Provider REST Layer",
    status: "COMPLETED",
    description: "Successfully implemented automated biological REST ordering schemas connecting standard digital payloads to Twist Bioscience API terminals."
  },
  {
    period: "H1 2026 (Active)",
    title: "On-Chain Reconciliations & Parity Decay Simulator",
    status: "IN_PROGRESS",
    description: "Introducing automated parity correction engines to offset cosmic-ray micro-degradations on dry synthetic DNA cards."
  },
  {
    period: "H2 2026",
    title: "Decentralized B2B Synthesis Marketplace Network",
    status: "PLANNED",
    description: "Opening global sequence dispatch routing pool allowing commercial labs to bid dynamically on customer DNA encoding queues based on cost-per-base."
  }
];

export const STORAGE_PRESETS: StoragePreset[] = [
  { sizeTB: 10, label: "Biotech Startup Lab Archive", tapeCost50Y: 75000, dnaCost50Y: 4900, co2SavingsTons: 12.5 },
  { sizeTB: 100, label: "Standard Enterprise Healthcare Cohort", tapeCost50Y: 480000, dnaCost50Y: 24900, co2SavingsTons: 85.0 },
  { sizeTB: 1000, label: "Gov National Genomic Sequencing Bank", tapeCost50Y: 3400000, dnaCost50Y: 145000, co2SavingsTons: 640.0 }
];

export const MARKETING_FAQS = [
  {
    q: "Is synthesized DNA storage safe? Will it interfere with live biological cells?",
    a: "HelixVault deals exclusively with dry, inert, physical DNA sequences encapsulated in protective hermetic micro-capsules. There are zero biological viruses or bacteria inside, and the sequences carry extensive non-expressive buffer markers rendering them biologically inert."
  },
  {
    q: "Why do you refer to yourself as the 'Stripe of DNA Data preservation'?",
    a: "Because just as Stripe abstracts credit card networks and banks into clean REST APIs, HelixVault abstracts physical DNA synthesis providers, sequencing devices, and biological parity rules into standard JSON APIs and on-demand payment pipelines, completely avoiding custom hardware lock-in."
  },
  {
    q: "How fast is reading and writing data back from biological formats?",
    a: "Writing (Synthesis) is optimal for critical cold archives (e.g. historical medical imagery, source codes, legal ledgers), currently taking 12-48 hours. Retrieval is done via high-throughput Next-Gen Sequencing (NGS) within 4 to 12 hours based on priority routing queues."
  }
];
