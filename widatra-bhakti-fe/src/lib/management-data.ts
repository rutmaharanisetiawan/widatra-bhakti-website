import suhariImg from "@/assets/management/suhari_mukti.jpg";
import nagayaImg from "@/assets/management/kazushi_nagaya.jpg";
import naitoImg from "@/assets/management/kimitaka_naito.jpg";
import bettyImg from "@/assets/management/betty_zubaida.jpg";
import evalinImg from "@/assets/management/evalin_jayakusli.jpg";

export interface ManagementLeader {
  id: string;
  name: string;
  role: string;
  roleEn: string;
  category: "komisaris" | "direksi";
  categoryLabel: string;
  photo: string;
  since?: string;
  quote: string;
  quoteEn: string;
  bio: string;
  bioEn: string;
  division?: string;
}

export const PRESIDENT_DIRECTOR_MESSAGE = {
  name: "Suhari Mukti",
  role: "Presiden Direktur",
  roleEn: "President Director",
  photo: suhariImg,
  company: "PT Widatra Bhakti (Otsuka Group)",
  location: "Pandaan, Pasuruan - Jawa Timur",
  focus: "Cairan Infus Steril & Solusi Kesehatan Terpercaya",
  standard: "Standar CPOB & WHO GMP Internasional",
  paragraphs: [
    "PT Widatra Bhakti adalah perusahaan farmasi dan anggota Grup Otsuka di Indonesia. Kami berupaya tanpa henti untuk berkontribusi pada kesehatan masyarakat dengan memproduksi produk berkualitas tinggi dengan harga yang kompetitif.",
    "Dengan kerja keras dan dedikasi tinggi, seluruh Manajemen dan karyawan selaras dengan Visi Perusahaan untuk menjadi perusahaan farmasi terkemuka di Indonesia dan memainkan peran penting di kawasan Asia. Terima kasih kepada Pemegang Saham atas kepercayaannya dan Manajemen yang telah bekerja dengan baik demi kemajuan PT Widatra Bhakti.",
    "Kami siap bekerja sama untuk meningkatkan dan mengembangkan kehidupan masyarakat Indonesia. Terima kasih telah mengunjungi situs web kami.",
  ],
  paragraphsEn: [
    "PT Widatra Bhakti is a pharmaceutical company and a member of the Otsuka Group in Indonesia. We continuously strive to contribute to public health by manufacturing high-quality products at competitive prices.",
    "Through hard work and high dedication, all Management and employees are aligned with the Company's Vision to become a leading pharmaceutical company in Indonesia and play an important role in the Asian region. We extend our sincere gratitude to Shareholders for their trust and to Management who have performed admirably for the advancement of PT Widatra Bhakti.",
    "We stand ready to cooperate in enhancing and developing the quality of life of the Indonesian people. Thank you for visiting our official website.",
  ],
  highlightQuote:
    "Kami berupaya tanpa henti untuk berkontribusi pada kesehatan masyarakat dengan memproduksi produk berkualitas tinggi demi kemajuan kesehatan Indonesia dan kawasan Asia.",
  highlightQuoteEn:
    "We continuously strive to contribute to public health by manufacturing high-quality products for the advancement of healthcare in Indonesia and Asia.",
};

export const BOARD_OF_COMMISSIONERS: ManagementLeader[] = [
  {
    id: "kazushi-nagaya",
    name: "Kazushi Nagaya",
    role: "Presiden Komisaris",
    roleEn: "President Commissioner",
    category: "komisaris",
    categoryLabel: "Dewan Komisaris",
    photo: nagayaImg,
    since: "Otsuka Group",
    quote: "Memastikan prinsip integritas dan tata kelola perusahaan yang kuat demi menjaga kepercayaan pemegang saham dan masyarakat.",
    quoteEn: "Ensuring strong integrity and corporate governance to uphold the trust of shareholders and the community.",
    bio: "Memimpin pengawasan tata kelola korporasi, kepatuhan standar internasional Otsuka Pharmaceutical, dan arah strategis Dewan Komisaris.",
    bioEn: "Leads corporate governance supervision, adherence to Otsuka Pharmaceutical international standards, and strategic direction of the Board of Commissioners.",
    division: "Pengawasan Tata Kelola & Strategi",
  },
  {
    id: "kimitaka-naito",
    name: "Kimitaka Naito",
    role: "Komisaris",
    roleEn: "Commissioner",
    category: "komisaris",
    categoryLabel: "Dewan Komisaris",
    photo: naitoImg,
    since: "Otsuka Group",
    quote: "Sinergi yang solid dan pengawasan berkelanjutan adalah fondasi utama keberhasilan korporasi jangka panjang.",
    quoteEn: "Solid synergy and continuous oversight are the cornerstone of long-term corporate success.",
    bio: "Mengawasi pelaksanaan operasional, manajemen risiko korporasi, dan sinergi regional di kawasan Asia.",
    bioEn: "Oversees operational execution, corporate risk management, and regional synergies across the Asian region.",
    division: "Manajemen Risiko & Pengawasan Korporasi",
  },
];

export const BOARD_OF_DIRECTORS: ManagementLeader[] = [
  {
    id: "suhari-mukti",
    name: "Suhari Mukti",
    role: "Presiden Direktur",
    roleEn: "President Director",
    category: "direksi",
    categoryLabel: "Dewan Direksi",
    photo: suhariImg,
    since: "PT Widatra Bhakti",
    quote: "Kami berupaya tanpa henti untuk berkontribusi pada kesehatan masyarakat dengan memproduksi produk berkualitas tinggi dengan harga yang kompetitif.",
    quoteEn: "We continuously strive to contribute to public health by manufacturing high-quality products at competitive prices.",
    bio: "Memimpin arah strategis, kemitraan global dengan Otsuka Group, dan visi jangka panjang PT Widatra Bhakti dalam penyediaan cairan infus berkualitas tinggi.",
    bioEn: "Leads the strategic direction, global partnerships with Otsuka Group, and long-term vision of PT Widatra Bhakti in delivering premium intravenous solutions.",
    division: "Kepemimpinan Eksekutif Korporat",
  },
  {
    id: "betty-zubaida",
    name: "Betty Zubaida",
    role: "Direktur Pabrik",
    roleEn: "Factory Director",
    category: "direksi",
    categoryLabel: "Dewan Direksi",
    photo: bettyImg,
    since: "Pandaan Plant",
    quote: "Setiap botol infus yang kami produksi adalah komitmen kami terhadap keselamatan pasien dan standar sterilitas tertinggi.",
    quoteEn: "Every IV bottle we produce is our unwavering commitment to patient safety and highest sterile standards.",
    bio: "Memimpin operasional manufaktur steril di fasilitas modern Pandaan Pasuruan, memastikan standar CPOB (GMP) dan closed-system filling berjalan dengan keunggulan mutu tanpa kompromi.",
    bioEn: "Leads sterile manufacturing operations at the modern Pandaan Pasuruan facility, ensuring cGMP standards and closed-system filling operate with uncompromising quality.",
    division: "Operasional Manufaktur & Mutu Pabrik Pandaan",
  },
  {
    id: "evalin-jayakusli",
    name: "Evalin K. Jayakusli",
    role: "Direktur Keuangan & Administrasi",
    roleEn: "Director of Finance & Administration",
    category: "direksi",
    categoryLabel: "Dewan Direksi",
    photo: evalinImg,
    since: "Head Office",
    quote: "Efisiensi dan akuntabilitas keuangan yang kuat mendukung keberlanjutan investasi teknologi manufaktur farmasi modern kami.",
    quoteEn: "Robust financial efficiency and accountability sustain our continuous investment in modern pharmaceutical manufacturing technology.",
    bio: "Memimpin manajemen keuangan korporat, akuntabilitas, sistem informasi, dan administrasi strategis PT Widatra Bhakti.",
    bioEn: "Leads corporate financial management, accountability, information systems, and strategic administration for PT Widatra Bhakti.",
    division: "Keuangan, Akuntansi & Tata Kelola Administrasi",
  },
];

export const ALL_MANAGEMENT_LEADERS: ManagementLeader[] = [
  ...BOARD_OF_COMMISSIONERS,
  ...BOARD_OF_DIRECTORS,
];
