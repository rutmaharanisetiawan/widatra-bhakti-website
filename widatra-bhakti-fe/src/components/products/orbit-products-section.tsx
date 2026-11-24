import { useState, useRef, useEffect, useCallback, useMemo } from "react";
import { SubNavbar } from "@/components/sub-navbar";
import { MediaImage } from "@/components/media/media-image";
import { useLanguage } from "@/hooks/use-language";
import type { Product } from "@/lib/products-data";
import {
  ChevronLeft,
  ChevronRight,
  ShieldCheck,
  CheckCircle2,
  ArrowUpRight,
  Sparkles,
  RotateCcw,
  Layers,
  FileText,
} from "lucide-react";
import ivBagCutout from "@/assets/iv-bag-cutout.png";
import vialCutout from "@/assets/vial-cutout.png";
import suppliesCutout from "@/assets/supplies-cutout.png";

// Resolve transparent 3D cutout image for each product so there is NO rectangular photo background
function getProductCutout(p: Product): string {
  if (
    p.code.includes("NACL") ||
    p.code.includes("vial") ||
    p.name.toLowerCase().includes("sodium chloride") ||
    p.name.toLowerCase().includes("vial")
  ) {
    return vialCutout;
  }
  if (
    p.category === "Medical Device" ||
    p.code.includes("ADMIN") ||
    p.code.includes("SET") ||
    p.name.toLowerCase().includes("set")
  ) {
    return suppliesCutout;
  }
  return ivBagCutout;
}

interface OrbitProductsSectionProps {
  products: Product[];
  activeFilter: string;
  onFilterChange: (val: string) => void;
  onOpenDetail: (code: string) => void;
}

export function OrbitProductsSection({
  products,
  activeFilter,
  onFilterChange,
  onOpenDetail,
}: OrbitProductsSectionProps) {
  const { t, language } = useLanguage();
  const isId = language === "id";

  const containerRef = useRef<HTMLDivElement>(null);
  const cardElementsRef = useRef<(HTMLDivElement | null)[]>([]);

  const filteredProducts = useMemo(() => {
    if (activeFilter === "All") return products;
    return products.filter((p) => p.brand === activeFilter);
  }, [products, activeFilter]);

  const N = filteredProducts.length;
  const angleStep = N > 0 ? (2 * Math.PI) / N : 0;

  // Active product state for the right-hand detail card
  const [activeIndex, setActiveIndex] = useState<number>(0);
  const activeProduct = filteredProducts[activeIndex] || filteredProducts[0] || null;

  // Physics refs (running outside React state for 60 FPS)
  const currentAngleRef = useRef<number>(0);
  const targetAngleRef = useRef<number | null>(null);
  const velocityRef = useRef<number>(0);
  const isDraggingRef = useRef<boolean>(false);
  const isWheelingRef = useRef<boolean>(false);
  const wheelTimerRef = useRef<number | null>(null);
  const lastPointerXRef = useRef<number>(0);
  const animFrameIdRef = useRef<number | null>(null);

  // Configuration for 3D Orbit
  const orbitConfig = useRef({
    radiusX: 295,
    radiusY: 55,
    depthZ: 200,
    kemiringanTilt: 0.32,
    friction: 0.93,
    snapSpring: 0.08,
  });

  // Responsive radius adjustments
  useEffect(() => {
    const handleResize = () => {
      const w = window.innerWidth;
      if (w < 640) {
        orbitConfig.current.radiusX = 150;
        orbitConfig.current.radiusY = 32;
        orbitConfig.current.depthZ = 115;
      } else if (w < 1024) {
        orbitConfig.current.radiusX = 230;
        orbitConfig.current.radiusY = 46;
        orbitConfig.current.depthZ = 160;
      } else {
        orbitConfig.current.radiusX = 295;
        orbitConfig.current.radiusY = 55;
        orbitConfig.current.depthZ = 200;
      }
    };
    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  // Update card CSS 3D transforms directly on DOM nodes
  const updateCardTransforms = useCallback(() => {
    if (N === 0) return 0;
    const currentAngle = currentAngleRef.current;
    const { radiusX, radiusY, depthZ, kemiringanTilt } = orbitConfig.current;

    // Hitung index produk yang persis di posisi depan tengah
    const normalizedRawIndex = Math.round(-currentAngle / angleStep);
    const frontIndex = ((normalizedRawIndex % N) + N) % N;

    cardElementsRef.current.forEach((el, i) => {
      if (!el) return;

      const itemAngle = currentAngle + i * angleStep;
      const wrapped =
        ((((itemAngle + Math.PI) % (2 * Math.PI)) + 2 * Math.PI) % (2 * Math.PI)) - Math.PI;

      const sinVal = Math.sin(wrapped);
      const cosVal = Math.cos(wrapped);

      const x = sinVal * radiusX;
      const y = -cosVal * radiusY * kemiringanTilt + 32; // Memberikan clearance luas dari toggle bar
      const z = cosVal * depthZ;

      const normalizedDepth = (cosVal + 1) / 2;
      const scale = 0.72 + normalizedDepth * 0.38; // 0.72 to 1.10
      const opacity = 0.45 + Math.pow(normalizedDepth, 1.8) * 0.55;
      const zIndex = Math.round((z + depthZ) * 10);
      const rotY = -sinVal * 24;

      el.style.transform = `translate3d(${x}px, ${y}px, ${z}px) rotateY(${rotY}deg) scale(${scale})`;
      el.style.opacity = `${opacity}`;
      el.style.zIndex = `${zIndex}`;

      if (i === frontIndex) {
        el.dataset.active = "true";
      } else {
        el.dataset.active = "false";
      }
    });

    return frontIndex;
  }, [angleStep, N]);

  // Main RAF loop
  useEffect(() => {
    let lastReportedIndex = -1;

    const renderLoop = () => {
      const cfg = orbitConfig.current;

      if (isDraggingRef.current) {
        // Dragging kursor: ikuti pointer langsung tanpa snap
        targetAngleRef.current = null;
      } else if (isWheelingRef.current) {
        // Trackpad/mouse wheel sedang bergulir aktif: rotasi meluncur bebas tanpa magnetic snap prematur!
        targetAngleRef.current = null;
        currentAngleRef.current += velocityRef.current;
        velocityRef.current *= cfg.friction;
      } else if (targetAngleRef.current !== null) {
        // Magnetic spring snap ke produk tengah
        const diff = targetAngleRef.current - currentAngleRef.current;
        if (Math.abs(diff) > 0.0004) {
          currentAngleRef.current += diff * cfg.snapSpring;
        } else {
          currentAngleRef.current = targetAngleRef.current;
          targetAngleRef.current = null;
        }
      } else {
        // Peluncuran inersia pasca-drag atau pasca-wheel
        if (Math.abs(velocityRef.current) > 0.0002) {
          currentAngleRef.current += velocityRef.current;
          velocityRef.current *= cfg.friction;
        } else if (N > 0) {
          velocityRef.current = 0;
          const nearestStep = Math.round(-currentAngleRef.current / angleStep);
          targetAngleRef.current = -nearestStep * angleStep;
        }
      }

      const currentFront = updateCardTransforms();

      if (currentFront !== lastReportedIndex) {
        lastReportedIndex = currentFront;
        setActiveIndex(currentFront);
      }

      animFrameIdRef.current = requestAnimationFrame(renderLoop);
    };

    animFrameIdRef.current = requestAnimationFrame(renderLoop);
    return () => {
      if (animFrameIdRef.current) cancelAnimationFrame(animFrameIdRef.current);
    };
  }, [angleStep, N, updateCardTransforms]);

  // Reset when filter changes
  useEffect(() => {
    currentAngleRef.current = 0;
    targetAngleRef.current = null;
    velocityRef.current = 0;
    isWheelingRef.current = false;
    setActiveIndex(0);
  }, [activeFilter]);

  // Drag interaction handlers
  const handlePointerDown = (e: React.PointerEvent) => {
    isDraggingRef.current = true;
    lastPointerXRef.current = e.clientX;
    velocityRef.current = 0;
    targetAngleRef.current = null;
    isWheelingRef.current = false;
    if (wheelTimerRef.current) clearTimeout(wheelTimerRef.current);

    if (containerRef.current) {
      containerRef.current.setPointerCapture(e.pointerId);
    }
  };

  const handlePointerMove = (e: React.PointerEvent) => {
    if (!isDraggingRef.current) return;
    const currentX = e.clientX;
    const deltaX = currentX - lastPointerXRef.current;
    lastPointerXRef.current = currentX;

    const dragSensitivity = 0.004;
    currentAngleRef.current += deltaX * dragSensitivity;
    velocityRef.current = deltaX * dragSensitivity;
  };

  const handlePointerUp = (e: React.PointerEvent) => {
    if (!isDraggingRef.current) return;
    isDraggingRef.current = false;
    if (containerRef.current) {
      try {
        containerRef.current.releasePointerCapture(e.pointerId);
      } catch {
        // ignore
      }
    }
  };

  // Native wheel listener untuk trackpad & mouse wheel sehalus sutra
  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;

    const onNativeWheel = (e: WheelEvent) => {
      // Hanya tangani jika gestur sengaja horizontal (swipe 2 jari kiri-kanan atau tahan Shift)
      const isHorizontal = Math.abs(e.deltaX) > Math.abs(e.deltaY);
      if (!isHorizontal && !e.shiftKey) {
        // Scroll vertikal murni: biarkan halaman bergulir normal tanpa tersendat/bergetar
        return;
      }

      // Cegah scroll browser hanya saat swipe horizontal di area carousel
      e.preventDefault();

      const rawDelta = isHorizontal ? e.deltaX : e.deltaY;

      // Normalisasi akselerasi: responsif untuk micro-delta trackpad Mac & mouse notch
      const sign = rawDelta > 0 ? 1 : -1;
      const mag = Math.min(Math.abs(rawDelta), 60);
      const impulse = -sign * Math.pow(mag, 0.94) * 0.0006;

      isWheelingRef.current = true;
      targetAngleRef.current = null;
      velocityRef.current += impulse;

      // Batasi kecepatan maksimal agar tidak berputar liar
      if (velocityRef.current > 0.065) velocityRef.current = 0.065;
      if (velocityRef.current < -0.065) velocityRef.current = -0.065;

      // Reset debounce timer: baru aktifkan magnetic snap setelah jari berhenti menggulir
      if (wheelTimerRef.current) clearTimeout(wheelTimerRef.current);
      wheelTimerRef.current = window.setTimeout(() => {
        isWheelingRef.current = false;
      }, 140);
    };

    el.addEventListener("wheel", onNativeWheel, { passive: false });
    return () => {
      el.removeEventListener("wheel", onNativeWheel);
      if (wheelTimerRef.current) clearTimeout(wheelTimerRef.current);
    };
  }, []);

  // Rotate to specific product index
  const rotateToProductIndex = (targetIdx: number) => {
    if (N === 0) return;
    const currentAngle = currentAngleRef.current;
    const currentNearestStep = Math.round(-currentAngle / angleStep);
    const currentFrontIdx = ((currentNearestStep % N) + N) % N;

    let stepDiff = targetIdx - currentFrontIdx;
    if (stepDiff > N / 2) stepDiff -= N;
    if (stepDiff < -N / 2) stepDiff += N;

    targetAngleRef.current = -(currentNearestStep + stepDiff) * angleStep;
    velocityRef.current = 0;
  };

  return (
    <div className="w-full">
      {/* Top Header + SubNavbar Filter */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-10 sm:mb-12">
        <div>
          <span className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-brand-tint dark:bg-white/[0.06] text-primary text-[10px] font-bold uppercase tracking-[0.22em] mb-4">
            (08) {isId ? "PRODUK KAMI" : "OUR PRODUCTS"}
          </span>
          <h2 className="text-[28px] sm:text-[36px] lg:text-[44px] font-semibold leading-[1.12] tracking-[-0.025em] text-corporate-black dark:text-white">
            {activeFilter === "All" ? (
              <>
                The full{" "}
                <span className="font-serif-italic font-normal text-primary">
                  portfolio.
                </span>
              </>
            ) : activeFilter === "Generic" ? (
              <>
                <span className="font-serif-italic font-normal text-primary">
                  Generic
                </span>{" "}
                products.
              </>
            ) : (
              <>
                <span className="font-serif-italic font-normal text-primary">
                  Branded
                </span>{" "}
                products.
              </>
            )}
          </h2>
        </div>

        <SubNavbar
          activeId={activeFilter}
          onSelect={(val) => onFilterChange(val)}
          items={[
            { id: "All", label: `All (${products.length})` },
            {
              id: "Generic",
              label: `Generic (${products.filter((p) => p.brand === "Generic").length})`,
            },
            {
              id: "Branded",
              label: `Branded (${products.filter((p) => p.brand === "Branded").length})`,
            },
          ]}
        />
      </div>

      {/* Main Split Layout: 3D Orbit on Left, Product Detail on Right */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-10 items-start">
        {/* =========================================================
            LEFT COLUMN (7 COLS): 3D DRAG-TO-ORBIT WHEEL
        ========================================================= */}
        <div className="lg:col-span-7 flex flex-col justify-between rounded-[32px] bg-gradient-to-b from-brand-soft/40 via-surface to-white dark:from-white/[0.02] dark:to-card border border-black/[0.06] dark:border-white/[0.08] p-4 sm:p-7 shadow-sm relative overflow-hidden">
          {/* Subtle Ambient Background Floor Ring */}
          <div className="absolute inset-0 pointer-events-none flex items-center justify-center">
            <div className="w-[85%] h-[280px] rounded-[50%] border-2 border-dashed border-primary/20 dark:border-primary/25 [transform:rotateX(74deg)]" />
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-64 h-32 bg-primary/10 blur-3xl rounded-full" />
          </div>

          {/* Top Instruction Pill */}
          <div className="relative z-10 flex items-center justify-between gap-3 text-xs text-corporate-gray pb-2.5 mb-2 border-b border-black/5 dark:border-white/10">
            <div className="flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-primary animate-pulse" />
              <span className="font-bold uppercase tracking-wider text-[10px] text-corporate-black dark:text-white">
                3D Drag-to-Orbit Wheel
              </span>
            </div>
            <span className="text-[11px] font-mono text-corporate-gray/80 hidden sm:inline-block">
              {isId ? "Tarik atau geser untuk memutar" : "Drag or swipe to rotate"}
            </span>
          </div>

          {/* Orbit Viewport Container */}
          <div
            ref={containerRef}
            onPointerDown={handlePointerDown}
            onPointerMove={handlePointerMove}
            onPointerUp={handlePointerUp}
            onPointerCancel={handlePointerUp}
            className="relative w-full h-[480px] sm:h-[530px] flex items-center justify-center cursor-grab active:cursor-grabbing touch-none select-none mt-4"
            style={{ perspective: "1200px", transformStyle: "preserve-3d" }}
          >
            {filteredProducts.map((p, idx) => {
              const isFront = idx === activeIndex;

              return (
                <div
                  key={p.code}
                  ref={(el) => {
                    cardElementsRef.current[idx] = el;
                  }}
                  onClick={() => {
                    if (idx !== activeIndex) {
                      rotateToProductIndex(idx);
                    } else {
                      onOpenDetail(p.code);
                    }
                  }}
                  className={`absolute w-[240px] sm:w-[270px] h-[370px] sm:h-[410px] rounded-[30px] p-5 flex flex-col justify-between transition-[border-color,box-shadow,background-color] duration-300 cursor-pointer group pointer-events-auto ${
                    isFront
                      ? "bg-gradient-to-b from-white via-blue-50/80 to-white/95 dark:from-white/15 dark:via-blue-950/25 dark:to-card border-2 border-primary shadow-[0_25px_50px_-10px_rgba(14,49,146,0.35)] ring-4 ring-primary/10"
                      : "bg-white/85 dark:bg-card/85 border border-black/10 dark:border-white/10 shadow-md hover:border-primary/40 backdrop-blur-xs"
                  }`}
                  style={{ transformStyle: "preserve-3d", willChange: "transform, opacity" }}
                >
                  {/* Left Brand Color Accent Bar */}
                  <span
                    className={`absolute -left-[2px] top-6 h-8 w-[4px] rounded-r-full transition-[height] duration-300 ${
                      idx % 2 === 0 ? "bg-primary" : "bg-rose-500"
                    } ${isFront ? "h-14" : ""}`}
                  />

                  {/* Top Badges */}
                  <div className="flex items-center justify-between gap-1.5 text-[10px] font-bold uppercase tracking-wider relative z-20">
                    <span className="px-2.5 py-0.5 rounded-full bg-brand-tint dark:bg-white/10 text-primary truncate">
                      {p.category}
                    </span>
                    <span
                      className={`px-2 py-0.5 rounded-full ${
                        p.brand === "Generic"
                          ? "bg-surface dark:bg-white/5 text-corporate-gray"
                          : "bg-amber-50 dark:bg-amber-500/15 text-amber-700 dark:text-amber-400"
                      }`}
                    >
                      {p.brand}
                    </span>
                  </div>

                  {/* 3D Pop-Out Cutout Product Image (Menerobos keluar dari kartu!) */}
                  <div className="relative my-auto h-[210px] sm:h-[230px] flex items-center justify-center">
                    {/* Circular Cleanroom Studio Glow inside the card */}
                    <div
                      className={`absolute w-44 h-44 rounded-full blur-xl transition-opacity duration-300 pointer-events-none ${
                        isFront
                          ? "bg-gradient-to-tr from-primary/20 via-blue-400/20 to-sky-300/30 opacity-100 scale-110"
                          : "bg-primary/10 opacity-40 scale-90"
                      }`}
                    />
                    <img
                      src={getProductCutout(p)}
                      alt={p.name}
                      className={`h-[210px] sm:h-[235px] w-auto object-contain select-none pointer-events-none filter drop-shadow-[0_20px_25px_rgba(14,49,146,0.35)] transition-transform duration-300 ${
                        isFront ? "-translate-y-7 scale-110" : "scale-100"
                      }`}
                      draggable={false}
                    />
                  </div>

                  {/* Bottom Meta */}
                  <div className="pt-2 border-t border-black/5 dark:border-white/10 flex items-center justify-between text-xs relative z-20">
                    <div className="truncate pr-2">
                      <h4 className="font-bold text-corporate-black dark:text-white truncate">
                        {p.name}
                      </h4>
                      <span className="text-[10px] font-mono text-corporate-gray">
                        {p.sizes[0] || "500 mL"}
                      </span>
                    </div>
                    <span className="text-[11px] font-bold text-primary flex items-center gap-0.5 shrink-0 group-hover:translate-x-0.5 transition-transform">
                      VIEW ↗
                    </span>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Bottom Carousel Controls Bar */}
          <div className="relative z-10 flex items-center justify-between pt-4 mt-2 border-t border-black/5 dark:border-white/10">
            <span className="text-xs text-corporate-gray font-mono">
              Produk {activeIndex + 1} / {N}
            </span>

            {/* Navigation Arrows + Dots */}
            <div className="flex items-center gap-3">
              <button
                type="button"
                onClick={() => rotateToProductIndex((activeIndex - 1 + N) % N)}
                className="w-10 h-10 rounded-full bg-white dark:bg-card border border-black/10 dark:border-white/15 text-corporate-black dark:text-white hover:bg-primary hover:text-white hover:border-primary transition-all flex items-center justify-center shadow-xs cursor-pointer active:scale-95"
                aria-label="Previous Product"
              >
                <ChevronLeft className="w-5 h-5" />
              </button>

              <div className="flex items-center gap-1.5 px-3 py-2 rounded-full bg-white dark:bg-card border border-black/10 dark:border-white/10 shadow-xs">
                {filteredProducts.map((_, dotIdx) => (
                  <button
                    key={dotIdx}
                    type="button"
                    onClick={() => rotateToProductIndex(dotIdx)}
                    className={`h-1.5 rounded-full transition-all cursor-pointer ${
                      dotIdx === activeIndex
                        ? "w-5 bg-primary"
                        : "w-1.5 bg-black/20 dark:bg-white/20 hover:bg-black/40"
                    }`}
                    aria-label={`Go to product ${dotIdx + 1}`}
                  />
                ))}
              </div>

              <button
                type="button"
                onClick={() => rotateToProductIndex((activeIndex + 1) % N)}
                className="w-10 h-10 rounded-full bg-white dark:bg-card border border-black/10 dark:border-white/15 text-corporate-black dark:text-white hover:bg-primary hover:text-white hover:border-primary transition-all flex items-center justify-center shadow-xs cursor-pointer active:scale-95"
                aria-label="Next Product"
              >
                <ChevronRight className="w-5 h-5" />
              </button>
            </div>
          </div>
        </div>

        {/* =========================================================
            RIGHT COLUMN (5 COLS): INTERACTIVE PRODUCT DETAIL CARD
        ========================================================= */}
        <div className="lg:col-span-5 lg:sticky lg:top-28">
          {activeProduct ? (
            <div className="rounded-[32px] bg-white dark:bg-card border-2 border-primary/20 dark:border-white/10 p-6 sm:p-8 shadow-xl relative overflow-hidden transition-all duration-300">
              {/* Top Accent Gradient Bar */}
              <div className="absolute top-0 inset-x-0 h-1.5 bg-gradient-to-r from-primary via-brand-deep to-rose-500" />

              {/* Status Header */}
              <div className="flex items-center justify-between gap-2 mb-4">
                <div className="flex items-center gap-2">
                  <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse" />
                  <span className="text-[10px] font-bold uppercase tracking-wider text-emerald-600 dark:text-emerald-400">
                    Fokus Produk Terpilih
                  </span>
                </div>
                <span className="px-2.5 py-0.5 rounded-full bg-brand-tint dark:bg-white/[0.08] text-primary text-[10px] font-bold uppercase tracking-wider">
                  {activeProduct.category}
                </span>
              </div>

              {/* Product Headline */}
              <h3 className="text-2xl sm:text-3xl font-extrabold text-corporate-black dark:text-white tracking-tight leading-tight mb-1">
                {activeProduct.name}
              </h3>
              <div className="font-mono text-xs font-semibold text-primary dark:text-blue-400 mb-4">
                {activeProduct.nie ? `NIE: ${activeProduct.nie}` : "Kemenkes RI Registered"}
              </div>

              {/* Indication */}
              <p className="text-xs sm:text-sm text-corporate-gray dark:text-gray-300 leading-relaxed mb-6">
                {activeProduct.indication}
              </p>

              {/* Technical Specifications Grid */}
              <div className="grid grid-cols-3 gap-2.5 p-3.5 rounded-2xl bg-surface dark:bg-white/[0.03] border border-black/5 dark:border-white/5 mb-6">
                <div>
                  <span className="text-[9px] font-bold uppercase tracking-wider text-corporate-gray block mb-0.5">
                    OSMOLARITAS
                  </span>
                  <strong className="text-xs font-bold text-corporate-black dark:text-white block truncate">
                    {activeProduct.osmolarity || "—"}
                  </strong>
                </div>
                <div>
                  <span className="text-[9px] font-bold uppercase tracking-wider text-corporate-gray block mb-0.5">
                    KALORI
                  </span>
                  <strong className="text-xs font-bold text-corporate-black dark:text-white block truncate">
                    {activeProduct.calorie || "—"}
                  </strong>
                </div>
                <div>
                  <span className="text-[9px] font-bold uppercase tracking-wider text-corporate-gray block mb-0.5">
                    KEMASAN
                  </span>
                  <strong className="text-xs font-bold text-corporate-black dark:text-white block truncate">
                    {activeProduct.sizes[0] || "500 mL"}
                  </strong>
                </div>
              </div>

              {/* Clinical Standard Guarantees */}
              <div className="space-y-2 mb-6 text-xs text-corporate-gray dark:text-gray-300">
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0" />
                  <span>Grade A Closed-System Filling (Zero Contamination)</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0" />
                  <span>Sertifikasi PIC/S GMP & ISO 9001 : 2015</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0" />
                  <span>Standar Resmi Otsuka Group & Halal MUI</span>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex flex-col sm:flex-row gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => onOpenDetail(activeProduct.code)}
                  className="flex-1 py-3 px-5 rounded-full bg-primary text-white text-xs font-bold uppercase tracking-wider hover:bg-brand-deep transition-all shadow-md flex items-center justify-center gap-2 cursor-pointer active:scale-95"
                >
                  <span>Spesifikasi Lengkap</span>
                  <ArrowUpRight className="w-4 h-4" />
                </button>
                <button
                  type="button"
                  onClick={() => rotateToProductIndex((activeIndex + 1) % N)}
                  className="py-3 px-5 rounded-full bg-surface dark:bg-white/[0.05] border border-black/10 dark:border-white/10 text-xs font-bold hover:border-primary hover:text-primary transition-all text-center cursor-pointer"
                >
                  Produk Berikutnya ❯
                </button>
              </div>
            </div>
          ) : (
            <div className="p-8 text-center text-corporate-gray border border-dashed rounded-[32px]">
              Pilih produk pada roda di kiri untuk melihat detail.
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
