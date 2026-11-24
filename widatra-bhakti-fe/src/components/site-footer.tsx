import { Link } from "@tanstack/react-router";
import { useLanguage } from "@/hooks/use-language";
import { WavyMarqueeRibbon } from "@/components/wavy-marquee-ribbon";
import { WidatraLogo } from "@/components/ui/widatra-logo";
import { OtsukaLogo } from "@/components/ui/otsuka-logo";
import bpomLogo from "@/assets/accreditations/bpom.png";
import kemenkesLogo from "@/assets/accreditations/kemenkes.jpeg";
import iso9001Logo from "@/assets/accreditations/iso_9001.jpeg";
import iso14001Logo from "@/assets/accreditations/iso_14001.jpeg";
import iso45001Logo from "@/assets/accreditations/iso_45001.png";
import k3Logo from "@/assets/accreditations/k3.jpeg";
import {
  Mail,
  Phone,
  MapPin,
  Instagram,
  Facebook,
  Youtube,
  ExternalLink,
} from "lucide-react";

export function SiteFooter() {
  const { language } = useLanguage();
  const isId = language === "id";

  return (
    <>
      <WavyMarqueeRibbon variant="crossed" />
      <footer className="bg-surface dark:bg-[#070e1e] pt-16 sm:pt-20 pb-12 border-t border-black/5 dark:border-white/[0.06] text-corporate-black dark:text-white transition-colors duration-300">
        <div className="max-w-[1380px] mx-auto px-4 sm:px-6 lg:px-8">
          {/* Main Footer Directory */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-8 lg:gap-8 mb-16">
            {/* Col 1: Brand & Contact Info (3.5 cols) */}
            <div className="lg:col-span-3 flex flex-col justify-between">
              <div>
                <div className="mb-6 flex flex-col items-start gap-3">
                  <WidatraLogo
                    variant="horizontal"
                    size="lg"
                    subtitle={isId ? "Mitra Terpercaya untuk Kesehatan yang Lebih Baik" : "Reliable Partner for Better Health"}
                    showAccentAnimation={true}
                  />
                  <OtsukaLogo variant="badge" size="md" href="https://www.otsuka.com/en/company/group/#asia" />
                </div>

                <p className="text-xs sm:text-sm text-corporate-gray dark:text-gray-300 leading-relaxed mb-6">
                  {isId
                    ? "Produsen cairan infus dasar dan larutan medis terkemuka di Indonesia. Bagian dari Otsuka Group yang berkomitmen pada standar tertinggi PIC/S GMP dan sertifikasi Halal."
                    : "Indonesia's premier manufacturer of basic intravenous and medical solutions. Part of the Otsuka Group, committed to PIC/S GMP standards and Halal certification."}
                </p>

                {/* Direct Contact Items */}
                <div className="space-y-3 text-xs text-corporate-gray dark:text-gray-300 mb-6">
                  <a
                    href="mailto:info@widatra.com"
                    className="flex items-start gap-2.5 hover:text-primary transition-colors group"
                  >
                    <Mail className="w-4 h-4 text-primary shrink-0 mt-0.5 group-hover:scale-110 transition-transform" />
                    <span>info@widatra.com</span>
                  </a>
                  <a
                    href="tel:+62343631575"
                    className="flex items-start gap-2.5 hover:text-primary transition-colors group"
                  >
                    <Phone className="w-4 h-4 text-primary shrink-0 mt-0.5 group-hover:scale-110 transition-transform" />
                    <div>
                      <div className="font-medium text-corporate-black dark:text-white">
                        +62 343 631575 / 631777
                      </div>
                      <div className="text-[11px] text-corporate-gray">Pandaan Plant (Hunting)</div>
                    </div>
                  </a>
                  <div className="flex items-start gap-2.5">
                    <MapPin className="w-4 h-4 text-primary shrink-0 mt-0.5" />
                    <span className="leading-snug">
                      Jl. Stadion No. 1, Pandaan, Pasuruan 67156, Jawa Timur, Indonesia
                    </span>
                  </div>
                </div>

                {/* Social Media Rounded Buttons */}
                <div className="flex items-center gap-2 pt-1">
                  <SocialButton
                    href="https://www.instagram.com/widatrabhakti/"
                    label="Instagram"
                    icon={<Instagram className="w-4 h-4" />}
                    hoverClass="hover:bg-gradient-to-br hover:from-purple-600 hover:to-pink-500 hover:text-white hover:border-transparent"
                  />
                  <SocialButton
                    href="https://wa.me/628113436315"
                    label="WhatsApp"
                    icon={<WhatsAppIcon className="w-4 h-4" />}
                    hoverClass="hover:bg-emerald-600 hover:text-white hover:border-transparent"
                  />
                  <SocialButton
                    href="https://facebook.com/widatrabhakti"
                    label="Facebook"
                    icon={<Facebook className="w-4 h-4" />}
                    hoverClass="hover:bg-blue-600 hover:text-white hover:border-transparent"
                  />
                  <SocialButton
                    href="https://tiktok.com/@widatrabhakti"
                    label="TikTok"
                    icon={<TikTokIcon className="w-4 h-4" />}
                    hoverClass="hover:bg-black hover:text-white hover:border-transparent"
                  />
                  <SocialButton
                    href="https://youtube.com/@widatrabhakti"
                    label="YouTube"
                    icon={<Youtube className="w-4 h-4" />}
                    hoverClass="hover:bg-red-600 hover:text-white hover:border-transparent"
                  />
                </div>
              </div>
            </div>

            {/* Col 2: Menu Utama (2 cols) */}
            <div className="lg:col-span-2">
              <h5 className="text-xs font-bold uppercase tracking-[0.18em] text-primary mb-4 pb-1 border-b border-black/5 dark:border-white/10">
                {isId ? "Menu Utama" : "Main Navigation"}
              </h5>
              <ul className="space-y-2.5 text-xs sm:text-sm">
                <li>
                  <Link to="/" className="text-corporate-gray dark:text-gray-300 hover:text-primary transition-colors">
                    {isId ? "Beranda" : "Home"}
                  </Link>
                </li>
                <li>
                  <Link to="/about" className="text-corporate-gray dark:text-gray-300 hover:text-primary transition-colors">
                    {isId ? "Profil Perusahaan" : "About Widatra"}
                  </Link>
                </li>
                <li>
                  <Link to="/management" className="text-corporate-gray dark:text-gray-300 hover:text-primary transition-colors">
                    {isId ? "Dewan & Manajemen" : "Board & Management"}
                  </Link>
                </li>
                <li>
                  <Link to="/products" className="text-corporate-gray dark:text-gray-300 hover:text-primary transition-colors">
                    {isId ? "Produk Cairan Infus" : "Infusion Solutions"}
                  </Link>
                </li>
                <li>
                  <Link to="/factory-tour" className="text-corporate-gray dark:text-gray-300 hover:text-primary transition-colors">
                    {isId ? "Kunjungan Pabrik" : "Factory Tour"}
                  </Link>
                </li>
                <li>
                  <Link to="/careers" className="text-corporate-gray dark:text-gray-300 hover:text-primary transition-colors">
                    {isId ? "Karier & Budaya" : "Careers at Widatra"}
                  </Link>
                </li>
                <li>
                  <Link to="/contact" className="text-corporate-gray dark:text-gray-300 hover:text-primary transition-colors">
                    {isId ? "Kontak & Lokasi" : "Contact & Locations"}
                  </Link>
                </li>
              </ul>
            </div>

            {/* Col 3: Berita & Publikasi (2 cols) */}
            <div className="lg:col-span-2">
              <h5 className="text-xs font-bold uppercase tracking-[0.18em] text-primary mb-4 pb-1 border-b border-black/5 dark:border-white/10">
                {isId ? "Berita & Acara" : "News & Media"}
              </h5>
              <ul className="space-y-2.5 text-xs sm:text-sm">
                <li>
                  <Link to="/news" className="text-corporate-gray dark:text-gray-300 hover:text-primary transition-colors">
                    {isId ? "Berita Perusahaan" : "Corporate News"}
                  </Link>
                </li>
                <li>
                  <Link to="/news" className="text-corporate-gray dark:text-gray-300 hover:text-primary transition-colors">
                    {isId ? "Inovasi & Riset Medis" : "Medical Innovations"}
                  </Link>
                </li>
                <li>
                  <Link to="/csr" className="text-corporate-gray dark:text-gray-300 hover:text-primary transition-colors">
                    {isId ? "CSR & Keberlanjutan" : "CSR & Sustainability"}
                  </Link>
                </li>
                <li>
                  <Link to="/news" className="text-corporate-gray dark:text-gray-300 hover:text-primary transition-colors">
                    {isId ? "Siaran Pers Resmi" : "Press Releases"}
                  </Link>
                </li>
                <li>
                  <Link to="/about" className="text-corporate-gray dark:text-gray-300 hover:text-primary transition-colors">
                    {isId ? "Sertifikasi Mutu" : "Quality Certificates"}
                  </Link>
                </li>
                <li>
                  <Link to="/factory-tour" className="text-corporate-gray dark:text-gray-300 hover:text-primary transition-colors">
                    {isId ? "Jadwal Kunjungan" : "Tour Schedules"}
                  </Link>
                </li>
              </ul>
            </div>

            {/* Col 4: Aplikasi & Pengunjung Website (2 cols) */}
            <div className="lg:col-span-2 flex flex-col justify-between">
              <div>
                <h5 className="text-xs font-bold uppercase tracking-[0.18em] text-primary mb-4 pb-1 border-b border-black/5 dark:border-white/10">
                  {isId ? "Portal & Layanan" : "Portals & Services"}
                </h5>
                <ul className="space-y-2.5 text-xs sm:text-sm mb-6">
                  <li>
                    <Link to="/careers" className="text-corporate-gray dark:text-gray-300 hover:text-primary transition-colors flex items-center gap-1.5">
                      <span>{isId ? "Portal Pelamar" : "Job Applicant Portal"}</span>
                    </Link>
                  </li>
                  <li>
                    <Link to="/contact" className="text-corporate-gray dark:text-gray-300 hover:text-primary transition-colors">
                      <span>{isId ? "Whistleblowing (WBS)" : "Whistleblowing System"}</span>
                    </Link>
                  </li>
                  <li>
                    <Link to="/contact" className="text-corporate-gray dark:text-gray-300 hover:text-primary transition-colors">
                      <span>{isId ? "Farmakovigilans (MESO)" : "Pharmacovigilance"}</span>
                    </Link>
                  </li>
                  <li>
                    <Link to="/products" className="text-corporate-gray dark:text-gray-300 hover:text-primary transition-colors">
                      <span>{isId ? "Katalog & Lembar Data" : "Product Datasheets"}</span>
                    </Link>
                  </li>
                  <li>
                    <Link to="/contact" className="text-corporate-gray dark:text-gray-300 hover:text-primary transition-colors">
                      <span>{isId ? "Layanan Informasi Publik" : "Public Information"}</span>
                    </Link>
                  </li>
                  <li>
                    <Link to="/products" className="text-corporate-gray dark:text-gray-300 hover:text-primary transition-colors">
                      <span>{isId ? "Verifikasi Mutu & Batch" : "Batch Quality Verification"}</span>
                    </Link>
                  </li>
                </ul>
              </div>
            </div>

            {/* Col 5: Lokasi Fasilitas & Mitra / Sertifikasi (3 cols) */}
            <div className="lg:col-span-3">
              <h5 className="text-xs font-bold uppercase tracking-[0.18em] text-primary mb-4 pb-1 border-b border-black/5 dark:border-white/10 flex items-center justify-between">
                <span>{isId ? "Lokasi Fasilitas" : "Plant Location"}</span>
                <span className="text-[10px] font-mono font-normal text-corporate-gray lowercase">pandaan, id</span>
              </h5>

              {/* Map Container */}
              <div className="rounded-2xl overflow-hidden border border-black/10 dark:border-white/10 shadow-sm relative group bg-brand-soft aspect-[16/10] mb-4">
                <iframe
                  title="Peta Lokasi PT Widatra Bhakti Pandaan"
                  src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3954.9922883446864!2d112.69894487574744!3d-7.651703292364716!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x2dd7d11019672eb1%3A0xe94ff64821815fe6!2sPT.%20Widatra%20Bhakti!5e0!3m2!1sen!2sid!4v1700000000000!5m2!1sen!2sid"
                  width="100%"
                  height="100%"
                  style={{ border: 0 }}
                  allowFullScreen={false}
                  loading="lazy"
                  referrerPolicy="no-referrer-when-downgrade"
                  className="w-full h-full grayscale-[25%] group-hover:grayscale-0 transition-all duration-300"
                />
                <a
                  href="https://maps.google.com/?q=PT+Widatra+Bhakti+Pandaan"
                  target="_blank"
                  rel="noreferrer"
                  className="absolute bottom-2.5 right-2.5 z-10 px-2.5 py-1 rounded-full bg-white/95 dark:bg-card/95 text-corporate-black dark:text-white text-[10px] font-bold shadow-md hover:bg-primary hover:text-white transition-all flex items-center gap-1 backdrop-blur-xs"
                >
                  <span>Buka Peta</span>
                  <ExternalLink className="w-3 h-3" />
                </a>
              </div>

              {/* Standar & Akreditasi Resmi */}
              <div>
                <span className="text-[10px] font-bold uppercase tracking-wider text-corporate-gray dark:text-gray-400 block mb-2">
                  {isId ? "Standar & Akreditasi Resmi" : "Official Standards & Accreditations"}
                </span>
                <div className="rounded-2xl border border-black/10 dark:border-white/10 bg-white p-3 shadow-xs">
                  <div className="grid grid-cols-3 gap-2 text-center">
                    {[
                      {
                        name: "BPOM RI",
                        desc: isId ? "Izin Edar" : "Licensed",
                        logo: bpomLogo,
                        alt: "Badan Pengawas Obat dan Makanan (BPOM) RI",
                      },
                      {
                        name: "Kemenkes RI",
                        desc: isId ? "Terdaftar" : "Registered",
                        logo: kemenkesLogo,
                        alt: "Kementerian Kesehatan RI",
                      },
                      {
                        name: "ISO 9001",
                        desc: isId ? "Mutu" : "Quality",
                        logo: iso9001Logo,
                        alt: "ISO 9001:2015 Quality Management System",
                      },
                      {
                        name: "ISO 14001",
                        desc: isId ? "Lingkungan" : "Environment",
                        logo: iso14001Logo,
                        alt: "ISO 14001:2015 Environmental Management",
                      },
                      {
                        name: "ISO 45001",
                        desc: isId ? "K3 Global" : "OHSMS",
                        logo: iso45001Logo,
                        alt: "ISO 45001:2018 Occupational Health and Safety",
                      },
                      {
                        name: "SMK3",
                        desc: isId ? "K3 Nasional" : "Safety Std",
                        logo: k3Logo,
                        alt: "Sistem Manajemen Keselamatan dan Kesehatan Kerja (K3)",
                      },
                    ].map((item) => (
                      <div
                        key={item.name}
                        className="p-1.5 rounded-lg hover:bg-slate-50 transition-colors group flex flex-col items-center justify-between"
                        title={`${item.name} - ${item.alt}`}
                      >
                        <div className="w-full h-8 flex items-center justify-center">
                          <img
                            src={item.logo}
                            alt={item.alt}
                            className="max-h-7 max-w-[90%] object-contain group-hover:scale-105 transition-transform duration-200"
                            loading="lazy"
                          />
                        </div>
                        <div className="mt-1 w-full text-center">
                          <span className="block text-[9.5px] font-bold text-slate-800 tracking-tight leading-none truncate">
                            {item.name}
                          </span>
                          <span className="block text-[7.5px] text-slate-500 uppercase tracking-tighter mt-0.5 leading-none truncate font-medium">
                            {item.desc}
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Bottom Copyright Row */}
          <div className="flex flex-col md:flex-row justify-between items-center border-t border-black/5 dark:border-white/[0.06] pt-8 text-[11px] font-medium text-corporate-gray tracking-wide">
            <p>
              Copyright © {new Date().getFullYear()} PT Widatra Bhakti (Otsuka Group Indonesia). All right reserved.
            </p>
            <div className="flex flex-wrap gap-5 sm:gap-8 mt-4 md:mt-0 text-[11px] md:pr-24">
              <a href="#" className="hover:text-primary transition-colors">
                {isId ? "Kebijakan Privasi" : "Privacy Policy"}
              </a>
              <a href="#" className="hover:text-primary transition-colors">
                {isId ? "Pemberitahuan Hukum" : "Legal Terms"}
              </a>
              <a href="#" className="hover:text-primary transition-colors">
                {isId ? "Kebijakan Mutu" : "Quality Policy"}
              </a>
              <a href="#" className="hover:text-primary transition-colors">
                {isId ? "Peta Situs" : "Sitemap"}
              </a>
            </div>
          </div>
        </div>
      </footer>
    </>
  );
}

function SocialButton({
  href,
  label,
  icon,
  hoverClass,
}: {
  href: string;
  label: string;
  icon: React.ReactNode;
  hoverClass?: string;
}) {
  return (
    <a
      href={href}
      target="_blank"
      rel="noreferrer"
      aria-label={label}
      className={`w-9 h-9 rounded-full border border-black/10 dark:border-white/10 bg-white dark:bg-card text-corporate-gray hover:text-corporate-black dark:hover:text-white flex items-center justify-center transition-all duration-200 shadow-xs hover:scale-105 ${
        hoverClass || ""
      }`}
    >
      {icon}
    </a>
  );
}

function WhatsAppIcon({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" className={className}>
      <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.885-9.885 9.885m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L0 24l6.335-1.662c1.746.953 3.71 1.455 5.711 1.456h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z" />
    </svg>
  );
}

function TikTokIcon({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" className={className}>
      <path d="M12.525.02c1.31-.02 2.61-.01 3.91-.02.08 1.53.63 3.09 1.75 4.17 1.12 1.11 2.7 1.62 4.24 1.79v4.03c-1.44-.05-2.89-.35-4.2-.97-.57-.26-1.1-.59-1.62-.97v7.91c-.02 2.06-.7 4.1-1.99 5.71-1.62 2.02-4.14 3.2-6.72 3.16-2.58-.04-5.07-1.28-6.64-3.34-1.58-2.06-2.17-4.78-1.63-7.29.54-2.5 2.18-4.64 4.43-5.75 1.51-.74 3.22-1.04 4.9-.87v4.18c-1.02-.2-2.1.04-2.94.66-.84.62-1.37 1.62-1.42 2.67-.06 1.05.37 2.11 1.15 2.8 1.04.92 2.58 1.07 3.76.36 1.02-.61 1.63-1.74 1.65-2.93V.02h-.48Z" />
    </svg>
  );
}
