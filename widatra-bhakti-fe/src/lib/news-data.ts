import officeImg from "@/assets/office-building.jpg";
import scientistImg from "@/assets/scientist.jpg";
import productionImg from "@/assets/production-line.jpg";
import csrCommunity from "@/assets/csr-community.jpg";
import aerialImg from "@/assets/factory-aerial.jpg";
import teamImg from "@/assets/team.jpg";

export type ArticleStatus = "Published" | "Draft";

export type Article = {
  slug: string;
  cat: string;
  date: string;
  read?: string;
  title: string;
  excerpt: string;
  img: string;
  content: string;
  gallery?: string[];
  tags?: string[];
  author?: string;
  authorRole?: string;
  status?: ArticleStatus;
  views?: number;
};

export const NEWS_CATEGORIES = ["Corporate", "Science", "Sustainability", "People", "Events"] as const;

const RAW_ARTICLES: Article[] = [
  {
    slug: "grand-opening-new-head-office",
    cat: "Corporate",
    date: "November 08, 2024",
    read: "3 min read",
    title: "Grand Opening: PT Widatra Bhakti's new Head Office",
    excerpt: "After 21 years at Wisma Tugu Raden Saleh in Cikini, our Head Office has relocated to Pondok Indah Office Tower 1, Jakarta Selatan.",
    img: officeImg,
    author: "Corporate Communications",
    authorRole: "PT Widatra Bhakti",
    tags: ["Corporate", "Head Office", "Otsuka Group"],
    gallery: [officeImg, aerialImg],
    views: 428,
    content: `Wednesday, 8 November 2023, marked a historic moment for PT Widatra Bhakti. After 21 years based at Wisma Tugu Raden Saleh, Cikini, Menteng, Central Jakarta, management decided to move the company's Head Office to Pondok Indah Office Tower 1, 9th Floor Suite 902, South Jakarta.

**A New Chapter**

Quoting the remarks delivered by our President Director on the occasion, the company has gone through significant organizational change, and while the new office is smaller, the team remains committed to working with the right people in the right places.

**Closer to the Otsuka Group Family**

With this move, PT Widatra Bhakti now shares a building with several other Otsuka Group Indonesia companies — PT Amerta Indah Otsuka, PT Otsuka Distribution Indonesia, and PT Otsuka Indonesia — making coordination across the group faster and easier.

**Shared Celebration**

The Board of Directors from across Otsuka Group Indonesia's companies, including PT Otsuka Indonesia, PT Otsuka Distribution Indonesia, PT Amerta Indah Otsuka, and PT Merapi Utama Pharma, joined the celebration. Management hopes the new office will help employees feel comfortable at work and support PT Widatra Bhakti's continued growth.`,
  },
  {
    slug: "widatra-academy-2024-otsuka-dna",
    cat: "Corporate",
    date: "January 22, 2025",
    read: "3 min read",
    title: "Widatra Academy 2025: growing the “Otsuka DNA” in every employee",
    excerpt: "The first 2025 batch of Widatra Academy brought Department Heads, Division Heads, and the Factory Director together to explore the Otsuka DNA principles of ryukan-godo, jissho, and sozosei.",
    img: scientistImg,
    author: "Human Resources",
    authorRole: "PT Widatra Bhakti",
    tags: ["Training", "Otsuka DNA", "People Development"],
    gallery: [scientistImg, teamImg],
    views: 312,
    content: `On 22 January 2024, PT Widatra Bhakti held the first 2024 batch of Widatra Academy, a training program built around growing the "Otsuka DNA" — ryukan-godo, jissho, and sozosei — in every employee.

**Who Attended**

The session was attended by Department Heads, Division Heads, and the Factory Director from across the Pandaan plant.

**The Facilitator**

The material was delivered by Ibu Dian Anggraeny, Technical Department Head at PT Widatra Bhakti, who had the opportunity to study at the Human Resource and Development Institute during a one-year training program in Japan.

**An Engaged Session**

Participants responded enthusiastically to the Otsuka DNA material, taking an active part in the question-and-answer session and sharing their own perspectives throughout the training. The session also included interactive activities designed to reinforce the core concepts in a memorable way.

**Looking Ahead**

Widatra Academy continues as part of PT Widatra Bhakti's ongoing commitment to developing its people, ensuring every employee carries forward the values that have guided the company since it joined the Otsuka Group.`,
  },
  {
    slug: "family-gathering-2024-goes-to-jogja",
    cat: "People",
    date: "December 24, 2024",
    read: "3 min read",
    title: "Family Gathering 2024 — Widatra Bhakti Goes to Jogja",
    excerpt: "More than 1,300 employees and family members joined this year's Family Gathering in Yogyakarta, held across two batches under the theme “One Team One Dream.”",
    img: teamImg,
    author: "Human Resources",
    authorRole: "PT Widatra Bhakti",
    tags: ["Family Gathering", "People", "Yogyakarta"],
    gallery: [teamImg, officeImg],
    views: 890,
    content: `PT Widatra Bhakti held its "Family Gathering 2024 | Goes To Jogja" event on 22–24 November 2024 (batch 1) and 29 November–01 December 2024 (batch 2) in Yogyakarta, under the theme "One Team One Dream."

**A Record Turnout**

More than 1,300 people took part across both batches, made up of employees and their families from both the Head Office and the Pandaan plant.

**A Special Edition**

This year's Family Gathering was especially meaningful, as for the first time it brought together every employee and family member from both the Head Office and the factory in a single program.

**Exploring Yogyakarta**

Participants visited several popular destinations around Yogyakarta, including a VW Tour that took guests around the countryside by classic Volkswagen to visit local small businesses (UMKM), alongside other activities set against the region's scenic natural surroundings.`,
  },
  {
    slug: "perayaan-hut-ke-38-widatra-bhakti",
    cat: "Corporate",
    date: "August 21, 2024",
    read: "2 min read",
    title: "Celebrating PT Widatra Bhakti's 38th Anniversary",
    excerpt: "PT Widatra Bhakti marked its 38th anniversary on 21 August 2024, celebrating nearly four decades as a reliable partner for better health.",
    img: officeImg,
    author: "Corporate Communications",
    authorRole: "PT Widatra Bhakti",
    tags: ["Anniversary", "Corporate"],
    gallery: [officeImg, aerialImg, teamImg],
    views: 654,
    content: `On 21 August 2024, PT Widatra Bhakti celebrated its 38th anniversary since being licensed to manufacture basic intravenous solutions in 1986.

**Looking Back**

Across 38 years, PT Widatra Bhakti has grown from a single manufacturing license into the largest producer of basic intravenous solutions and a market leader in Indonesia, standing alongside the Otsuka Group Indonesia family since 1995.

**A Shared Celebration**

Employees at both the Head Office and the Pandaan plant marked the occasion together, reflecting on the milestones reached and reaffirming the company's commitment to its Vision of becoming a leading pharmaceutical company in Indonesia with an important role across the Asian region.`,
  },
  {
    slug: "pembagian-paket-kesehatan-hut-ke-34",
    cat: "Sustainability",
    date: "August 21, 2024",
    read: "2 min read",
    title: "Health package distribution marks PT Widatra Bhakti's Anniversary CSR",
    excerpt: "PT Widatra Bhakti carried out a CSR activity distributing health packages and medical essentials to healthcare centers around the Pandaan plant.",
    img: csrCommunity,
    author: "Corporate Communications",
    authorRole: "PT Widatra Bhakti",
    tags: ["CSR", "Anniversary", "Community"],
    gallery: [csrCommunity, officeImg],
    views: 521,
    content: `To mark our anniversary milestones, PT Widatra Bhakti carried out a comprehensive CSR activity distributing health packages to community health clinics in Pasuruan and East Java.

**Community Focus**

The health package distribution reflects PT Widatra Bhakti's ongoing commitment to public health that extends beyond its role as a pharmaceutical manufacturer, reaching the communities that surround both its Head Office and its factory.

**A Tradition of Giving Back**

Anniversary CSR activities such as this form part of PT Widatra Bhakti's broader effort to contribute relentlessly to public health, in line with the company's role in Indonesia's National Health System.`,
  },
  {
    slug: "cleanroom-grade-a-sterility-upgrade",
    cat: "Science",
    date: "February 14, 2025",
    read: "4 min read",
    title: "Innovations in Grade-A Sterile Cleanroom Automation & Particle Control",
    excerpt: "Widatra Bhakti upgrades particle monitoring systems and automated closed-system filling to achieve zero-contamination benchmark.",
    img: productionImg,
    author: "Quality Assurance",
    authorRole: "Technical Operations",
    tags: ["Cleanroom", "Sterility", "Automation"],
    gallery: [productionImg, scientistImg],
    views: 742,
    content: `Our Pandaan facility has successfully commissioned upgraded Grade-A cleanroom filling lines equipped with continuous laser particle counters and automated laminar airflow verification.

This milestone ensures every bottle and bag of IV solution produced complies with PIC/S GMP sterile manufacturing annexes.`,
  },
  {
    slug: "national-symposium-infusion-therapy-2025",
    cat: "Events",
    date: "March 05, 2025",
    read: "3 min read",
    title: "National Symposium on Fluid & Electrolyte Therapy in Critical Care",
    excerpt: "Over 450 intensivists and pharmacists attended Widatra's medical symposium exploring best practices in fluid balance resuscitation.",
    img: scientistImg,
    author: "Medical Affairs",
    authorRole: "Clinical Division",
    tags: ["Symposium", "Medical Affairs", "Events"],
    gallery: [scientistImg, officeImg],
    views: 395,
    content: `PT Widatra Bhakti hosted its annual Medical Symposium focused on intravenous fluid management in emergency and intensive care units, featuring key opinion leaders from the Indonesian Society of Intensive Care Medicine.`,
  },
  {
    slug: "renewable-energy-solar-panel-expansion",
    cat: "Sustainability",
    date: "January 10, 2025",
    read: "3 min read",
    title: "Pandaan Solar PV Installation Cuts Carbon Emissions by 24%",
    excerpt: "Phase 2 of our rooftop photovoltaic installation at the Pandaan manufacturing complex generates clean solar electricity.",
    img: aerialImg,
    author: "Engineering & ESG",
    authorRole: "PT Widatra Bhakti",
    tags: ["ESG", "Solar", "Green Factory"],
    gallery: [aerialImg, productionImg],
    views: 468,
    content: `As part of our commitment to sustainable pharmaceutical production, PT Widatra Bhakti has expanded its solar photovoltaic capacity to supply up to 24% of daytime electricity needs for our sterile manufacturing facility.`,
  },
];


export const ARTICLES: Article[] = RAW_ARTICLES.map((a) => ({
  status: "Published" as ArticleStatus,
  ...a,
}));

export function getArticle(slug: string): Article | undefined {
  return ARTICLES.find((a) => a.slug === slug);
}

export const FEATURE = ARTICLES[0];
