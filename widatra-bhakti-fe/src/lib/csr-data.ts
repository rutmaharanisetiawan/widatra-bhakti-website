import csrCommunity from "@/assets/csr-community.jpg";
import csrEnvironment from "@/assets/csr-environment.jpg";
import teamImg from "@/assets/team.jpg";
import officeImg from "@/assets/office-building.jpg";
import scientistImg from "@/assets/scientist.jpg";
import productionImg from "@/assets/production-line.jpg";

export type CsrStatus = "Published" | "Draft";

export const CSR_PILLARS = [
  "Community Development",
  "Education",
  "Healthcare",
  "Environment",
  "Employee Volunteering",
  "Disaster Relief",
] as const;

export type CsrProgram = {
  slug: string;
  pillar: (typeof CSR_PILLARS)[number] | string;
  location: string;
  date: string;
  title: string;
  excerpt: string;
  img: string;
  content: string;
  gallery?: string[];
  impact?: string;
  status?: CsrStatus;
};

const RAW_PROGRAMS: CsrProgram[] = [
  {
    slug: "pembagian-paket-kesehatan-hut-ke-34",
    pillar: "Healthcare",
    location: "Jakarta & Pandaan, East Java",
    date: "August 21, 2020",
    title: "Health package distribution marks the company's 34th anniversary",
    excerpt: "To celebrate its 34th anniversary, PT Widatra Bhakti distributed health packages to several locations in Jakarta and to institutions around the Pandaan plant.",
    img: csrCommunity,
    impact: "Multiple locations in Jakarta & Pandaan",
    gallery: [csrCommunity, officeImg],
    content: `21 August 2020 marked PT Widatra Bhakti's 34th anniversary. To mark the occasion, the company carried out a CSR activity distributing health packages to several locations in Jakarta as well as institutions around the Pandaan plant.

**Community Focus**

The health package distribution reflects PT Widatra Bhakti's ongoing commitment to public health that extends beyond its role as a pharmaceutical manufacturer, reaching communities around both its Head Office and its factory.

**A Tradition of Giving Back**

Anniversary CSR activities such as this form part of PT Widatra Bhakti's broader effort to contribute relentlessly to public health, in line with the company's strategic role in Indonesia's National Health System.`,
  },
  {
    slug: "pmi-pasuruan-blood-donor-partnership",
    pillar: "Healthcare",
    location: "Pandaan Campus, East Java",
    date: "2018",
    title: "Recognized by PMI Pasuruan for sustained blood donor participation",
    excerpt: "PT Widatra Bhakti's regular employee blood donation drives, held in partnership with Palang Merah Indonesia (PMI) Pasuruan, earned recognition for consistent long-term participation.",
    img: teamImg,
    impact: "PMI Pasuruan Blood Donor Award",
    gallery: [teamImg, scientistImg],
    content: `PT Widatra Bhakti has long partnered with Palang Merah Indonesia (PMI) Pasuruan to host regular employee blood donation drives at its Pandaan campus.

**A Sustained Tradition**

This ongoing collaboration was recognized with the PMI Pasuruan Blood Donor Award in 2018, honoring the company's sustained employee participation over the years.

**How It Works**

A mobile PMI unit is hosted on-site at the Pandaan campus, with employees given the opportunity to donate as part of the company's broader commitment to community healthcare beyond its own manufacturing operations.`,
  },
  {
    slug: "iso-14001-green-campus-stewardship",
    pillar: "Environment",
    location: "Pandaan Campus, East Java",
    date: "Ongoing",
    title: "ISO 14001 environmental stewardship and a green campus",
    excerpt: "Our Pandaan campus is surrounded by a green environment, supported by an environmental management system certified to ISO 14001 — providing a pleasant and healthy working atmosphere.",
    img: csrEnvironment,
    impact: "ISO 14001:2015 certified",
    gallery: [csrEnvironment, productionImg],
    content: `PT Widatra Bhakti's Pandaan facility is set within a green industrial campus, an environment the company maintains deliberately to provide a pleasant and healthy working atmosphere for its people.

**Certified Environmental Management**

Our environmental management system is certified to ISO 14001:2015, covering how the campus manages resources, emissions, and waste as part of daily manufacturing operations.

**A Long-Term Commitment**

Environmental stewardship at Widatra is treated as a continuous responsibility rather than a one-time initiative — woven into how the Pandaan plant operates every day, in support of both the surrounding community and the people who work here.`,
  },
  {
    slug: "community-development-around-pandaan",
    pillar: "Community Development",
    location: "Pandaan, Pasuruan, East Java",
    date: "Ongoing",
    title: "Community development around our Pandaan campus",
    excerpt: "PT Widatra Bhakti supports the communities surrounding its Pandaan plant, from anniversary health packages to partnerships with local institutions.",
    img: csrCommunity,
    impact: "Pandaan sub-district communities",
    gallery: [csrCommunity, officeImg, teamImg],
    content: `As the largest manufacturer of basic intravenous solutions in Indonesia, PT Widatra Bhakti recognizes the responsibility that comes with operating a large manufacturing campus in Pandaan, Pasuruan.

**Reaching Our Neighbors**

From distributing health packages to institutions around the plant during company anniversaries, to maintaining an open relationship with local government and community groups, PT Widatra Bhakti works to be a good neighbor as well as a reliable employer.

**Part of a Bigger Family**

As a member of the Otsuka Group Indonesia, our community programs draw on the same philosophy that guides our parent company: creating value not only through products, but through the relationships we build with the people around us.`,
  },
];


export const CSR_PROGRAMS: CsrProgram[] = RAW_PROGRAMS.map((p) => ({
  status: "Published" as CsrStatus,
  ...p,
}));

export function getCsrProgram(slug: string): CsrProgram | undefined {
  return CSR_PROGRAMS.find((p) => p.slug === slug);
}

export const FEATURED_CSR = CSR_PROGRAMS[0];
