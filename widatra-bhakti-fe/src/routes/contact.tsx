import { useState } from "react";
import { createFileRoute, Link, redirect } from "@tanstack/react-router";
import { PageHero } from "@/components/page-hero";
import { useLanguage } from "@/hooks/use-language";
import { SubNavbar } from "@/components/sub-navbar";
import { CheckCircle2, Mail, Phone, MapPin, Clock, ArrowUpRight, ArrowRight, MessageSquare } from "lucide-react";
import { addContactInquiry } from "@/lib/contact-store";
import officeImg from "@/assets/office-building.jpg";
import aerialImg from "@/assets/factory-aerial.jpg";
import { ScrollReveal } from "@/components/ui/scroll-reveal";

export const Route = createFileRoute("/contact")({
  validateSearch: (search: Record<string, unknown>): { tab?: string } => ({
    tab: (search.tab as string) || undefined,
  }),
  beforeLoad: ({ search }) => {
    if (search.tab === "reporting") {
      throw redirect({ to: "/contact/reporting" });
    }
  },
  head: () => ({
    meta: [
      { title: "Our Contact — PT Widatra Bhakti" },
      {
        name: "description",
        content:
          "Reach Widatra Bhakti's Jakarta head office and Pandaan manufacturing plant. Sales, partnerships, media, pharmacovigilance and frequently asked questions.",
      },
      { property: "og:title", content: "Contact PT Widatra Bhakti" },
    ],
  }),
  component: ContactPage,
});

const FAQ = [
  [
    "How do I place an order for WIDATRA products?",
    "Hospitals and procurement teams should contact our Sales team at sales@widatra.com. Distributor partners can reach out via our regional offices.",
  ],
  [
    "Where can I report an adverse drug reaction?",
    "Use the Pharmacovigilance form at https://bit.ly/Formulir_Pelaporan_ESO or contact our 24/7 hotline below. Reports are confidential and reviewed by our PV team within 24 hours.",
  ],
  [
    "Are factory visits available?",
    "Yes. Book a guided tour via our Factory Tour page. Visits are subject to availability and safety briefing.",
  ],
  [
    "Do you accept OEM or contract manufacturing?",
    "Yes — please contact partners@widatra.com with a brief project scope and we will respond within 5 working days.",
  ],
  [
    "What certifications does Widatra hold?",
    "ISO 9001:2015, ISO 14001:2015, ISO 45001:2018, PIC/S GMP via BPOM, and Halal certification, among others.",
  ],
  [
    "How can I apply for a job?",
    "All open positions are listed on our Careers page with an online application form.",
  ],
];

const QUICK_CONTACTS = [
  ["Sales", "sales@widatra.com", "Hospitals & distributors"],
  ["Partnerships", "partners@widatra.com", "OEM & licensing"],
  ["Media", "press@widatra.com", "Press & interviews"],
  ["Careers", "careers@widatra.com", "Recruitment inquiries"],
] as const;

const DEPARTMENTS_DIR = [
  ["Customer Service", "cs@widatra.com", "+62-21-7592-3057"],
  ["Regulatory Affairs", "ra@widatra.com", "+62-21-7592-3057"],
  ["Quality Assurance", "qa@widatra.com", "+62-343-631575"],
  ["Procurement", "procurement@widatra.com", "+62-343-631575"],
  ["Human Resources", "hr@widatra.com", "+62-21-7592-3057"],
  ["Finance", "finance@widatra.com", "+62-21-7592-3057"],
] as const;

function ContactPage() {
  const { t, language } = useLanguage();
  const isId = language === "id";
  const [activeOfficeTab, setActiveOfficeTab] = useState<number>(0);

  const navItems = [
    { id: "contact-offices", label: "Offices & Plants", href: "#contact-offices" },
    { id: "contact-departments", label: "Departments", href: "#contact-departments" },
    { id: "contact-pv", label: "Pharmacovigilance", href: "#contact-pv" },
    { id: "contact-form", label: "Send a Message", href: "#contact-form" },
    { id: "contact-faq", label: "FAQ", href: "#contact-faq" },
  ];

  return (
    <>
      <PageHero
        variant="contact"
        eyebrow="(Contact) Reach Us"
        title="Start a"
        italic="conversation."
        description="Sales, partnerships, media, pharmacovigilance, or a simple hello — our Jakarta head office and Pandaan plant are at your service."
        image={officeImg}
      />

      {/* Quick contact strip — Interactive Rounded Cards */}
      <section className="py-10 sm:py-14 bg-surface border-b border-black/5 dark:border-white/5">
        <div className="max-w-[1240px] 2xl:max-w-[1360px] mx-auto px-4 sm:px-6 lg:px-8 xl:px-10">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-3.5 sm:gap-5">
            {QUICK_CONTACTS.map(([title, email, desc], idx) => (
              <ScrollReveal key={title} animation="fade-up" delay={idx * 70}>
                <a
                  href={`mailto:${email}`}
                  className="group relative rounded-[20px] sm:rounded-[24px] bg-white dark:bg-card border-2 border-black/[0.06] dark:border-white/[0.08] p-5 sm:p-6 shadow-sm hover:border-primary/40 hover:shadow-[0_18px_36px_-12px_rgba(9,42,125,0.18)] hover:-translate-y-1 transition-all duration-300 block"
                >
                  <span
                    className={`absolute -left-[2px] top-5 h-7 w-[4px] rounded-r-full transition-all group-hover:h-11 ${
                      idx % 2 === 0 ? "bg-primary" : "bg-accent"
                    }`}
                  />
                  <div className="flex items-center justify-between mb-3">
                    <span className="px-3 py-1 rounded-full bg-brand-tint dark:bg-white/[0.08] text-[10px] font-bold uppercase tracking-wider text-primary">
                      {title}
                    </span>
                    <ArrowUpRight className="w-4 h-4 text-corporate-gray group-hover:text-primary transition-colors" />
                  </div>
                  <div className="text-sm sm:text-base font-semibold tracking-tight mb-1 break-all group-hover:text-primary transition-colors">
                    {email}
                  </div>
                  <div className="text-xs text-corporate-gray">{desc}</div>
                </a>
              </ScrollReveal>
            ))}
          </div>
        </div>
      </section>

      {/* OFFICES + PLANTS — Header + SubNavbar matching Screenshot */}
      <section id="contact-offices" className="py-16 sm:py-24 bg-white dark:bg-card scroll-mt-32">
        <div className="max-w-[1240px] 2xl:max-w-[1360px] mx-auto px-4 sm:px-6 lg:px-8 xl:px-10">
          <ScrollReveal animation="fade-up" className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-10 sm:mb-12">
            <div>
              <span className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-brand-tint dark:bg-white/[0.06] text-primary text-[10px] font-bold uppercase tracking-[0.22em] mb-4">
                (01) Offices & Plants
              </span>
              <h2 className="text-[28px] sm:text-[36px] lg:text-[44px] font-semibold leading-[1.12] tracking-[-0.025em]">
                Two doors,{" "}
                <span className="font-serif-italic font-normal text-primary">one company.</span>
              </h2>
            </div>

            <SubNavbar
              activeId={activeOfficeTab}
              onSelect={(idx) => setActiveOfficeTab(idx)}
              items={[
                { id: 0, label: "Jakarta HQ" },
                { id: 1, label: "Pandaan Plant" },
              ]}
            />
          </ScrollReveal>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <ScrollReveal animation="fade-up" delay={0}>
              <Card
                active={activeOfficeTab === 0}
                onClick={() => setActiveOfficeTab(0)}
                img={officeImg}
                tag="Corporate Office"
                city="Jakarta HQ"
                addr={[
                  "Pondok Indah Office Tower 1, Lt. 9, Suite 902",
                  "Jl. Sultan Iskandar Muda Kav. V-TA",
                  "Jakarta Selatan 12310, Indonesia",
                ]}
                phone="+62-21-7592-3057 (Hunting)"
                hours="Mon-Fri · 08:00 – 17:00 WIB"
              />
            </ScrollReveal>
            <ScrollReveal animation="fade-up" delay={120}>
              <Card
                active={activeOfficeTab === 1}
                onClick={() => setActiveOfficeTab(1)}
                img={aerialImg}
                tag="Manufacturing Plant"
                city="Pandaan, East Java"
                addr={["Jl. Stadion No. 1", "Pandaan, Pasuruan 67156", "Jawa Timur, Indonesia"]}
                phone="+62-343-631575 (Hunting)"
                hours="Mon-Fri · 08:00 – 17:00 WIB · Plant ops 24/7"
              />
            </ScrollReveal>
          </div>
        </div>
      </section>

      {/* DEPARTMENT DIRECTORY — Interactive Rounded Cards */}
      <section
        id="contact-departments"
        className="py-16 sm:py-24 bg-surface scroll-mt-32"
      >
        <div className="max-w-[1240px] 2xl:max-w-[1360px] mx-auto px-4 sm:px-6 lg:px-8 xl:px-10 grid grid-cols-1 lg:grid-cols-12 gap-10 items-start">
          <ScrollReveal animation="fade-right" className="lg:col-span-4">
            <span className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-brand-tint dark:bg-white/[0.06] text-primary text-[10px] font-bold uppercase tracking-[0.22em] mb-4">
              (02) Department Directory
            </span>
            <h2 className="text-[28px] sm:text-[36px] lg:text-[44px] font-semibold leading-[1.12] tracking-[-0.025em] mb-4">
              Reach the{" "}
              <span className="font-serif-italic font-normal text-primary">right desk.</span>
            </h2>
            <p className="text-corporate-gray leading-relaxed text-sm sm:text-base">
              For faster response, write directly to the relevant department. All inquiries are
              acknowledged within 2 working days.
            </p>
          </ScrollReveal>
          <div className="lg:col-span-8 grid grid-cols-1 sm:grid-cols-2 gap-4">
            {DEPARTMENTS_DIR.map(([dept, email, phone], idx) => (
              <ScrollReveal key={dept} animation="fade-left" delay={idx * 60}>
                <div
                  className="group relative rounded-[20px] bg-white dark:bg-card border-2 border-black/[0.06] dark:border-white/[0.08] p-5 hover:border-primary/40 hover:shadow-md hover:-translate-y-0.5 transition-all duration-300"
                >
                  <span
                    className={`absolute -left-[2px] top-5 h-7 w-[4px] rounded-r-full ${
                      idx % 2 === 0 ? "bg-primary" : "bg-accent"
                    }`}
                  />
                  <div className="text-sm font-semibold mb-2 group-hover:text-primary transition-colors">
                    {dept}
                  </div>
                  <div className="space-y-1.5 text-xs text-corporate-gray">
                    <a
                      href={`mailto:${email}`}
                      className="flex items-center gap-2 text-primary font-medium hover:underline break-all"
                    >
                      <Mail className="w-3.5 h-3.5 flex-shrink-0" />
                      {email}
                    </a>
                    <div className="flex items-center gap-2 font-mono">
                      <Phone className="w-3.5 h-3.5 flex-shrink-0 text-corporate-gray/70" />
                      {phone}
                    </div>
                  </div>
                </div>
              </ScrollReveal>
            ))}
          </div>
        </div>
      </section>

      {/* EMERGENCY / PHARMACOVIGILANCE */}
      <section id="contact-pv" className="py-12 sm:py-16 bg-white dark:bg-card scroll-mt-32">
        <div className="max-w-[1240px] 2xl:max-w-[1360px] mx-auto px-4 sm:px-6 lg:px-8 xl:px-10">
          <ScrollReveal animation="zoom-in">
            <div className="rounded-[28px] sm:rounded-[32px] bg-gradient-to-r from-accent to-[#c90000] text-white p-7 sm:p-10 grid grid-cols-1 lg:grid-cols-12 gap-8 items-center shadow-xl">
              <div className="lg:col-span-8">
                <span className="inline-block px-3.5 py-1 rounded-full bg-white/20 text-[10px] font-bold uppercase tracking-[0.22em] mb-3">
                  Urgent &middot; 24/7
                </span>
                <h3 className="text-2xl sm:text-3xl font-semibold">
                  Pharmacovigilance Reporting
                </h3>
                <p className="mt-2.5 text-white/90 text-sm sm:text-base max-w-2xl leading-relaxed">
                  Adverse Drug Reactions (ADR) are unexpected reactions during treatment. If you
                  suspect an ADR related to a Widatra product, please report immediately using our
                  official form.
                </p>
              </div>
              <div className="lg:col-span-4 flex flex-col gap-3">
                <Link
                  to="/contact/reporting"
                  className="px-6 py-3.5 rounded-full bg-white text-accent text-xs font-bold uppercase tracking-[0.18em] text-center hover:scale-[1.02] transition-all shadow-md"
                >
                  {isId ? "Isi Formulir Pelaporan" : "Fill Reporting Form"}
                </Link>
                <a
                  href="https://wa.me/628001234567"
                  className="px-6 py-3.5 rounded-full border-2 border-white/40 text-xs font-bold uppercase tracking-[0.18em] text-center hover:bg-white/15 transition-all"
                >
                  WhatsApp PV Team
                </a>
              </div>
            </div>
          </ScrollReveal>
        </div>
      </section>

      {/* MAP */}
      <section className="py-16 sm:py-24 bg-surface">
        <div className="max-w-[1240px] 2xl:max-w-[1360px] mx-auto px-4 sm:px-6 lg:px-8 xl:px-10 grid grid-cols-1 lg:grid-cols-12 gap-10 items-center">
          <ScrollReveal animation="fade-right" className="lg:col-span-4">
            <span className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-brand-tint dark:bg-white/[0.06] text-primary text-[10px] font-bold uppercase tracking-[0.22em] mb-4">
              (03) Visit Us
            </span>
            <h2 className="text-[28px] sm:text-[36px] lg:text-[44px] font-semibold leading-[1.12] tracking-[-0.025em] mb-4">
              Jakarta and Pandaan,{" "}
              <span className="font-serif-italic font-normal text-primary">on the map.</span>
            </h2>
            <p className="text-corporate-gray leading-relaxed text-sm sm:text-base">
              Plan your visit — our Jakarta office is in Pondok Indah and our plant sits along Jl.
              Stadion in Pandaan, 60 minutes from Surabaya International Airport.
            </p>
          </ScrollReveal>
          <ScrollReveal animation="fade-left" className="lg:col-span-8 grid grid-cols-1 md:grid-cols-2 gap-5">
            <div className="rounded-[24px] overflow-hidden border-2 border-black/[0.06] dark:border-white/[0.08] shadow-md">
              <iframe
                title="Jakarta HQ"
                className="w-full aspect-square"
                loading="lazy"
                src="https://maps.google.com/maps?q=Pondok+Indah+Office+Tower+1,+Jakarta&t=&z=15&ie=UTF8&iwloc=&output=embed"
              />
            </div>
            <div className="rounded-[24px] overflow-hidden border-2 border-black/[0.06] dark:border-white/[0.08] shadow-md">
              <iframe
                title="Pandaan Plant"
                className="w-full aspect-square"
                loading="lazy"
                src="https://maps.google.com/maps?q=Jl.+Stadion+No.+1+Pandaan+Pasuruan&t=&z=14&ie=UTF8&iwloc=&output=embed"
              />
            </div>
          </ScrollReveal>
        </div>
      </section>

      {/* FORM */}
      <ScrollReveal animation="fade-up" id="contact-form" className="scroll-mt-32">
        <ContactForm />
      </ScrollReveal>

      {/* FAQ */}
      <section id="contact-faq" className="py-16 sm:py-24 bg-surface scroll-mt-32">
        <div className="max-w-[1240px] 2xl:max-w-[1360px] mx-auto px-4 sm:px-6 lg:px-8 xl:px-10 grid grid-cols-1 lg:grid-cols-12 gap-10">
          <ScrollReveal animation="fade-right" className="lg:col-span-5">
            <span className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-brand-tint dark:bg-white/[0.06] text-primary text-[10px] font-bold uppercase tracking-[0.22em] mb-4">
              (05) Frequently Asked Questions
            </span>
            <h2 className="text-[28px] sm:text-[36px] lg:text-[44px] font-semibold leading-[1.12] tracking-[-0.025em]">
              Quick{" "}
              <span className="font-serif-italic font-normal text-primary">answers.</span>
            </h2>
          </ScrollReveal>
          <div className="lg:col-span-7 space-y-3">
            {FAQ.map(([q, a], idx) => (
              <ScrollReveal key={q} animation="fade-left" delay={idx * 60}>
                <FaqRow q={q} a={a} />
              </ScrollReveal>
            ))}
          </div>
        </div>
      </section>
    </>
  );
}

function Card({
  img,
  tag,
  city,
  addr,
  phone,
  hours,
  active,
  onClick,
}: {
  img: string;
  tag: string;
  city: string;
  addr: string[];
  phone: string;
  hours: string;
  active?: boolean;
  onClick?: () => void;
}) {
  return (
    <article
      onClick={onClick}
      className={`cursor-pointer group rounded-[26px] bg-white dark:bg-card p-5 sm:p-6 transition-all duration-300 border-2 ${
        active
          ? "border-primary shadow-[0_24px_50px_-16px_rgba(14,49,146,0.22)] -translate-y-1.5"
          : "border-black/[0.06] dark:border-white/[0.08] hover:border-primary/40 hover:-translate-y-1"
      }`}
    >
      <div className="rounded-[18px] overflow-hidden mb-5 aspect-[16/9]">
        <img
          src={img}
          alt={city}
          className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
        />
      </div>
      <div className="px-1">
        <span className="inline-block px-3 py-1 rounded-full bg-brand-tint dark:bg-white/[0.08] text-[10px] font-bold uppercase tracking-wider text-primary mb-3">
          {tag}
        </span>
        <h3 className="text-2xl font-semibold mb-3 group-hover:text-primary transition-colors">
          {city}
        </h3>
        <address className="not-italic text-xs sm:text-sm text-corporate-gray leading-relaxed mb-5">
          {addr.map((l) => (
            <div key={l}>{l}</div>
          ))}
        </address>
        <div className="rounded-2xl bg-surface p-4 space-y-2 text-xs font-mono">
          <div className="flex items-center gap-2 font-semibold text-corporate-black dark:text-white">
            <Phone className="w-3.5 h-3.5 text-primary" />
            {phone}
          </div>
          <div className="flex items-center gap-2 text-corporate-gray">
            <Clock className="w-3.5 h-3.5 text-primary/70" />
            {hours}
          </div>
        </div>
      </div>
    </article>
  );
}

function FaqRow({ q, a }: { q: string; a: string }) {
  const [open, setOpen] = useState(false);
  return (
    <div
      className={`rounded-[20px] bg-white dark:bg-card border-2 transition-all duration-300 ${
        open
          ? "border-primary/40 shadow-md"
          : "border-black/[0.06] dark:border-white/[0.08] hover:border-primary/30"
      }`}
    >
      <button
        onClick={() => setOpen((v) => !v)}
        className="w-full text-left px-5 py-4 flex items-center justify-between gap-4 cursor-pointer"
      >
        <h4 className="text-sm sm:text-base font-semibold">{q}</h4>
        <span
          className={`w-7 h-7 rounded-full flex items-center justify-center font-mono font-bold text-sm flex-shrink-0 transition-all ${
            open
              ? "bg-primary text-white rotate-45"
              : "bg-brand-tint dark:bg-white/[0.08] text-primary"
          }`}
        >
          +
        </span>
      </button>
      {open && (
        <p className="px-5 pb-4 text-xs sm:text-sm text-corporate-gray leading-relaxed">
          {a}
        </p>
      )}
    </div>
  );
}

function ContactForm() {
  const [form, setForm] = useState({
    name: "",
    organization: "",
    email: "",
    phone: "",
    subject: "",
    message: "",
  });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  function set(key: keyof typeof form, value: string) {
    setForm((f) => ({ ...f, [key]: value }));
  }

  function validate(): boolean {
    const next: Record<string, string> = {};
    if (!form.name.trim()) next.name = "Full name is required.";
    if (!form.email.trim()) {
      next.email = "Email is required.";
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email.trim())) {
      next.email = "Enter a valid email address.";
    }
    if (!form.subject.trim()) next.subject = "Subject is required.";
    if (!form.message.trim()) next.message = "Please write a message.";
    setErrors(next);
    return Object.keys(next).length === 0;
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!validate()) return;
    setSubmitting(true);
    try {
      await addContactInquiry({
        name: form.name,
        organization: form.organization || undefined,
        email: form.email,
        phone: form.phone || undefined,
        subject: form.subject,
        message: form.message,
        source: "Contact Page",
      });
      setSubmitted(true);
      setForm({ name: "", organization: "", email: "", phone: "", subject: "", message: "" });
      setErrors({});
    } catch (err) {
      setErrors({
        message:
          err instanceof Error ? err.message : "Couldn't send your message. Please try again.",
      });
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <section className="py-16 sm:py-24 bg-white dark:bg-card">
      <div className="max-w-[1240px] 2xl:max-w-[1360px] mx-auto px-4 sm:px-6 lg:px-8 xl:px-10 grid grid-cols-1 lg:grid-cols-12 gap-10 items-start">
        <div className="lg:col-span-5">
          <span className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-brand-tint dark:bg-white/[0.06] text-primary text-[10px] font-bold uppercase tracking-[0.22em] mb-4">
            (04) Send a Message
          </span>
          <h2 className="text-[28px] sm:text-[36px] lg:text-[44px] font-semibold leading-[1.12] tracking-[-0.025em] mb-5">
            We read every{" "}
            <span className="font-serif-italic font-normal text-primary">single line.</span>
          </h2>
          <p className="text-corporate-gray leading-relaxed text-sm sm:text-base">
            Tell us the context — sales, partnership, media, regulatory, or technical question —
            and we'll route your message to the right team. Expect a reply within 2 working days.
          </p>
          <div className="mt-8 p-6 rounded-[22px] bg-surface border border-black/[0.06] dark:border-white/[0.08]">
            <span className="text-[10px] font-bold uppercase tracking-wider text-corporate-gray block mb-1.5">
              WhatsApp Business
            </span>
            <a
              href="https://wa.me/6281234567890"
              className="text-xl font-bold text-primary hover:underline"
            >
              +62 812-3456-7890
            </a>
          </div>
        </div>
        <div className="lg:col-span-7 rounded-[28px] bg-surface border-2 border-black/[0.06] dark:border-white/[0.08] p-6 sm:p-8 shadow-sm">
          {submitted && (
            <div className="mb-6 p-5 rounded-2xl bg-emerald-50 dark:bg-emerald-500/10 border border-emerald-200 dark:border-emerald-500/20 flex items-start gap-3">
              <CheckCircle2 className="w-5 h-5 text-emerald-600 dark:text-emerald-400 shrink-0 mt-0.5" />
              <div>
                <div className="text-sm font-semibold text-emerald-800 dark:text-emerald-300">
                  Message sent — thank you.
                </div>
                <p className="mt-1 text-sm text-emerald-700/80 dark:text-emerald-400/80">
                  We've received your message and will get back to you within 2 working days.
                </p>
              </div>
            </div>
          )}
          <form onSubmit={handleSubmit} className="grid grid-cols-1 sm:grid-cols-2 gap-5">
            <SimpleField
              label="Full name"
              value={form.name}
              onChange={(v) => set("name", v)}
              error={errors.name}
            />
            <SimpleField
              label="Organization"
              value={form.organization}
              onChange={(v) => set("organization", v)}
            />
            <SimpleField
              label="Email"
              type="email"
              value={form.email}
              onChange={(v) => set("email", v)}
              error={errors.email}
            />
            <SimpleField
              label="Phone"
              type="tel"
              value={form.phone}
              onChange={(v) => set("phone", v)}
            />
            <div className="sm:col-span-2">
              <SimpleField
                label="Subject"
                value={form.subject}
                onChange={(v) => set("subject", v)}
                error={errors.subject}
              />
            </div>
            <div className="sm:col-span-2">
              <SimpleField
                label="Your message"
                textarea
                value={form.message}
                onChange={(v) => set("message", v)}
                error={errors.message}
              />
            </div>
            <div className="sm:col-span-2 mt-2">
              <button
                type="submit"
                disabled={submitting}
                className="inline-flex items-center gap-2 px-9 py-4 rounded-full bg-gradient-to-r from-primary to-brand-deep text-white text-xs font-bold uppercase tracking-[0.2em] shadow-[0_8px_20px_-6px_rgba(14,49,146,0.5)] hover:opacity-95 transition-all disabled:opacity-60 cursor-pointer"
              >
                <span>{submitting ? "Sending…" : "Send Message"}</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </form>
        </div>
      </div>
    </section>
  );
}

function SimpleField({
  label,
  type = "text",
  textarea = false,
  value,
  onChange,
  error,
}: {
  label: string;
  type?: string;
  textarea?: boolean;
  value: string;
  onChange: (value: string) => void;
  error?: string;
}) {
  return (
    <label className="block">
      <span className="text-[11px] font-bold uppercase tracking-wider text-corporate-gray mb-2 block">
        {label}
      </span>
      {textarea ? (
        <textarea
          rows={4}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          className="w-full rounded-2xl bg-white dark:bg-card border border-black/10 dark:border-white/15 px-4 py-3 text-sm focus:outline-none focus:border-primary resize-none"
        />
      ) : (
        <input
          type={type}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          className="w-full rounded-full bg-white dark:bg-card border border-black/10 dark:border-white/15 px-4 py-3 text-sm focus:outline-none focus:border-primary"
        />
      )}
      {error && <span className="block mt-1.5 text-xs text-destructive">{error}</span>}
    </label>
  );
}
