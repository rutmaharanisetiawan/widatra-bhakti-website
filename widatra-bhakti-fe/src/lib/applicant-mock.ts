export type Application = {
  id: string;
  position: string;
  department: string;
  appliedDate: string;
  status: "Submitted" | "Screening" | "Interview" | "Offer" | "Rejected";
  nextStep?: string;
};

export const mockApplicant = {
  name: "Ayu Pratiwi",
  email: "ayu.pratiwi@example.com",
  phone: "+62 812 3456 7890",
  location: "Surabaya, East Java",
  profileCompletion: 78,
  photo: "",
  education: [
    { school: "Institut Teknologi Sepuluh Nopember", degree: "B.Sc. Chemical Engineering", year: "2018 – 2022" },
  ],
  experience: [
    { company: "Kalbe Farma", role: "QA Officer", period: "2022 – 2024" },
  ],
  documents: [
    { name: "CV_Ayu_Pratiwi_2026.pdf", size: "412 KB", uploaded: "2 days ago" },
    { name: "Cover_Letter.pdf", size: "88 KB", uploaded: "2 days ago" },
  ],
  notifications: [
    { title: "Interview scheduled — QA Supervisor", time: "1h ago", tone: "info" as const },
    { title: "Application received — Production Analyst", time: "3d ago", tone: "success" as const },
  ],
};

export const mockApplications: Application[] = [
  {
    id: "APP-2401",
    position: "QA Supervisor",
    department: "Quality Assurance",
    appliedDate: "2026-06-18",
    status: "Interview",
    nextStep: "On-site interview · Jul 8, 2026",
  },
  {
    id: "APP-2402",
    position: "Production Analyst",
    department: "Manufacturing",
    appliedDate: "2026-06-10",
    status: "Screening",
  },
  {
    id: "APP-2380",
    position: "Regulatory Affairs Officer",
    department: "Regulatory",
    appliedDate: "2026-05-22",
    status: "Submitted",
  },
  {
    id: "APP-2201",
    position: "BFS Machine Operator",
    department: "Production",
    appliedDate: "2026-03-01",
    status: "Rejected",
  },
];

export const mockAdmin = {
  name: "Andi Wijaya",
  role: "HR Manager",
  email: "andi.wijaya@widatra.co.id",
};

export const mockAdminStats = {
  visitorsThisMonth: 24831,
  productInquiries: 128,
  openPositions: 12,
  activeApplicants: 342,
  factoryTourBookings: 46,
  newsPublished: 18,
};

export const mockAdminApplicants = [
  { name: "Ayu Pratiwi", position: "QA Supervisor", stage: "Interview", score: 88, applied: "Jun 18" },
  { name: "Budi Santoso", position: "Production Analyst", stage: "Screening", score: 74, applied: "Jun 12" },
  { name: "Citra Melati", position: "Regulatory Affairs", stage: "Offer", score: 92, applied: "Jun 03" },
  { name: "Dedi Kurniawan", position: "BFS Operator", stage: "Applied", score: 61, applied: "Jun 22" },
  { name: "Eka Putri", position: "R&D Chemist", stage: "Interview", score: 85, applied: "Jun 15" },
];

export const mockAdminInquiries = [
  { name: "RS Premier Bintaro", subject: "Bulk supply — Infusion NaCl 0.9%", received: "2h ago", status: "New" },
  { name: "PT Kimia Farma Trading", subject: "Distribution partnership inquiry", received: "1d ago", status: "In Progress" },
  { name: "Dinas Kesehatan Jatim", subject: "Tender quotation request", received: "2d ago", status: "Replied" },
];
