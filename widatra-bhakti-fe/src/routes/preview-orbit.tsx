import { createFileRoute } from "@tanstack/react-router";
import React, { useEffect, useRef, useState, useCallback } from "react";

export const Route = createFileRoute("/preview-orbit")({
  component: OrbitWheelCarouselDemo,
});

// ==========================================
// 1. DATA DUMMY PRODUK (Sneakers Studio)
// ==========================================
interface ProductItem {
  id: number;
  name: string;
  tag: string;
  price: string;
  color: string;
  image: string;
}

const PRODUCTS: ProductItem[] = [
  {
    id: 1,
    name: "AeroPulse Cyber V1",
    tag: "Futuristic Runner",
    price: "$280",
    color: "#3B82F6",
    image: "https://images.unsplash.com/photo-1552346154-21d32810aba3?auto=format&fit=crop&w=600&q=80",
  },
  {
    id: 2,
    name: "Phantom Stealth Pro",
    tag: "Carbon Fiber Road",
    price: "$340",
    color: "#EF4444",
    image: "https://images.unsplash.com/photo-1542291026-7eec264c27ff?auto=format&fit=crop&w=600&q=80",
  },
  {
    id: 3,
    name: "HyperGlide Neon Flux",
    tag: "High-Top Court",
    price: "$310",
    color: "#10B981",
    image: "https://images.unsplash.com/photo-1606107557195-0e29a4b5b4aa?auto=format&fit=crop&w=600&q=80",
  },
  {
    id: 4,
    name: "Vortex Velocity 90",
    tag: "Ultra-Lightweight Track",
    price: "$295",
    color: "#F59E0B",
    image: "https://images.unsplash.com/photo-1595950653106-6c9ebd614d3a?auto=format&fit=crop&w=600&q=80",
  },
  {
    id: 5,
    name: "Zenith Kinetic Apex",
    tag: "Limited Studio Edition",
    price: "$420",
    color: "#8B5CF6",
    image: "https://images.unsplash.com/photo-1515955656352-a1fa3ffcd111?auto=format&fit=crop&w=600&q=80",
  },
  {
    id: 6,
    name: "Quantum Stride Shift",
    tag: "Adaptive Cushioning",
    price: "$260",
    color: "#EC4899",
    image: "https://images.unsplash.com/photo-1539185441755-769473a23570?auto=format&fit=crop&w=600&q=80",
  },
];

// ==========================================
// 2. KOMPONEN UTAMA CAROUSEL 3D ORBIT WHEEL
// ==========================================
function OrbitWheelCarouselDemo() {
  const containerRef = useRef<HTMLDivElement>(null);
  const cardElementsRef = useRef<(HTMLDivElement | null)[]>([]);

  // State untuk informasi produk aktif yang tampil di HUD bawah
  const [activeProduct, setActiveProduct] = useState<ProductItem>(PRODUCTS[0]);
  const [activeIndex, setActiveIndex] = useState<number>(0);

  // Fisika gerak & koordinat orbit disimpan dalam Ref (Direct DOM Manipulation, 60 FPS)
  const currentAngleRef = useRef<number>(0);
  const targetAngleRef = useRef<number | null>(null);
  const velocityRef = useRef<number>(0);
  const isDraggingRef = useRef<boolean>(false);
  const pointerStartXRef = useRef<number>(0);
  const lastPointerXRef = useRef<number>(0);
  const animFrameIdRef = useRef<number | null>(null);

  const N = PRODUCTS.length;
  const angleStep = (2 * Math.PI) / N;

  // Konfigurasi Radius & Dimensi Orbit
  const orbitConfig = useRef({
    radiusX: 420,       // Lebar elips horizontal
    radiusY: 80,        // Ketinggian vertikal orbit (tilt elips)
    depthZ: 260,        // Jarak kedalaman dari kamera
    kemiringanTilt: 0.35, // Kemiringan bidang roda
    friction: 0.92,     // Koefisien gesekan (momentum damping)
    snapSpring: 0.08,   // Kecepatan spring snapping
  });

  // Responsif: Sesuaikan radius pada layar HP/Tablet
  useEffect(() => {
    const handleResize = () => {
      const w = window.innerWidth;
      if (w < 640) {
        orbitConfig.current.radiusX = 180;
        orbitConfig.current.radiusY = 45;
        orbitConfig.current.depthZ = 140;
      } else if (w < 1024) {
        orbitConfig.current.radiusX = 300;
        orbitConfig.current.radiusY = 65;
        orbitConfig.current.depthZ = 200;
      } else {
        orbitConfig.current.radiusX = 440;
        orbitConfig.current.radiusY = 85;
        orbitConfig.current.depthZ = 280;
      }
    };
    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  // Update posisi visual tiap kartu menggunakan CSS Transform 3D secara langsung
  const updateCardPositions = useCallback(() => {
    const currentAngle = currentAngleRef.current;
    const { radiusX, radiusY, depthZ, kemiringanTilt } = orbitConfig.current;

    // Tentukan index produk yang paling depan
    const normalizedRawIndex = Math.round(-currentAngle / angleStep);
    const frontIndex = ((-normalizedRawIndex % N) + N) % N;

    cardElementsRef.current.forEach((el, i) => {
      if (!el) return;

      // 1. Hitung sudut absolut item
      const itemAngle = currentAngle + i * angleStep;

      // 2. Normalisasi sudut ke rentang [-PI, PI] untuk akurasi kedalaman
      const wrappedAngle =
        ((((itemAngle + Math.PI) % (2 * Math.PI)) + 2 * Math.PI) % (2 * Math.PI)) - Math.PI;

      // 3. Trigonometri Sin / Cos
      const sinVal = Math.sin(wrappedAngle);
      const cosVal = Math.cos(wrappedAngle);

      // 4. Koordinat 3D sesuai kebutuhan teknis
      const x = sinVal * radiusX;
      const y = -cosVal * radiusY * kemiringanTilt;
      const z = cosVal * depthZ;

      // 5. Normalisasi faktor kedalaman: 0 (paling belakang) s/d 1 (paling depan)
      const normalizedDepth = (cosVal + 1) / 2;

      // 6. Skala & Opacity:
      // - Depan (cosVal mendekati 1): scale ~1.1, opacity 1
      // - Belakang (cosVal mendekati -1): scale ~0.7, opacity 0.45
      const scale = 0.7 + normalizedDepth * 0.4; // 0.70 s/d 1.10
      const opacity = 0.45 + Math.pow(normalizedDepth, 1.8) * 0.55;

      // Z-Index: Berdasarkan Z kedalaman agar kartu depan selalu menumpuk di atas
      const zIndex = Math.round((z + depthZ) * 10);

      // Rotasi Y lembut mengikuti lengkungan orbit roda silinder
      const rotY = -sinVal * 28;

      // Terapkan langsung ke transform GPU (tanpa re-render React)
      el.style.transform = `translate3d(${x}px, ${y}px, ${z}px) rotateY(${rotY}deg) scale(${scale})`;
      el.style.opacity = `${opacity}`;
      el.style.zIndex = `${zIndex}`;

      // Highlight visual kartu yang sedang aktif di depan
      if (i === frontIndex) {
        el.dataset.active = "true";
      } else {
        el.dataset.active = "false";
      }
    });

    return frontIndex;
  }, [angleStep, N]);

  // Main Loop requestAnimationFrame (Fisika Inersia & Magnetic Snap)
  useEffect(() => {
    let lastReportedIndex = -1;

    const renderLoop = () => {
      const cfg = orbitConfig.current;

      if (isDraggingRef.current) {
        // Saat ditarik pengguna: target snap dinonaktifkan
        targetAngleRef.current = null;
      } else if (targetAngleRef.current !== null) {
        // Mode Magnetic Snapping ke target sudut terdekat
        const diff = targetAngleRef.current - currentAngleRef.current;
        if (Math.abs(diff) > 0.0005) {
          currentAngleRef.current += diff * cfg.snapSpring;
        } else {
          currentAngleRef.current = targetAngleRef.current;
          targetAngleRef.current = null;
        }
      } else {
        // Mode Inersia / Momentum Damping saat drag dilepas
        if (Math.abs(velocityRef.current) > 0.0008) {
          currentAngleRef.current += velocityRef.current;
          velocityRef.current *= cfg.friction;
        } else {
          // Ketika velocity melambat habis, kunci (snap) ke item terdekat
          velocityRef.current = 0;
          const nearestStep = Math.round(-currentAngleRef.current / angleStep);
          targetAngleRef.current = -nearestStep * angleStep;
        }
      }

      // Render posisi frame baru
      const currentFrontIndex = updateCardPositions();

      // Sinkronkan UI React state hanya jika index produk aktif berubah
      if (currentFrontIndex !== lastReportedIndex) {
        lastReportedIndex = currentFrontIndex;
        setActiveIndex(currentFrontIndex);
        setActiveProduct(PRODUCTS[currentFrontIndex]);
      }

      animFrameIdRef.current = requestAnimationFrame(renderLoop);
    };

    animFrameIdRef.current = requestAnimationFrame(renderLoop);
    return () => {
      if (animFrameIdRef.current) cancelAnimationFrame(animFrameIdRef.current);
    };
  }, [angleStep, updateCardPositions]);

  // ==========================================
  // 3. INTERAKSI: POINTER EVENTS (DRAG / TOUCH)
  // ==========================================
  const handlePointerDown = (e: React.PointerEvent) => {
    isDraggingRef.current = true;
    pointerStartXRef.current = e.clientX;
    lastPointerXRef.current = e.clientX;
    velocityRef.current = 0;
    targetAngleRef.current = null;

    if (containerRef.current) {
      containerRef.current.setPointerCapture(e.pointerId);
    }
  };

  const handlePointerMove = (e: React.PointerEvent) => {
    if (!isDraggingRef.current) return;
    const currentX = e.clientX;
    const deltaX = currentX - lastPointerXRef.current;

    // Sensitivitas drag: konversi perpindahan pixel kursor ke radian sudut rotasi
    const dragSensitivity = 0.004;
    currentAngleRef.current += deltaX * dragSensitivity;

    // Simpan kecepatan seketika untuk momentum inersia saat dilepas
    velocityRef.current = deltaX * dragSensitivity;
    lastPointerXRef.current = currentX;
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

  // ==========================================
  // 4. INTERAKSI: TRACKPAD / SCROLL WHEEL
  // ==========================================
  const handleWheel = (e: React.WheelEvent) => {
    e.preventDefault();
    const delta = Math.abs(e.deltaX) > Math.abs(e.deltaY) ? e.deltaX : e.deltaY;
    velocityRef.current += delta * -0.0003;
    targetAngleRef.current = null;
  };

  // ==========================================
  // 5. KLIK KARTU / TOMBOL: ROTATE PRODUK KE DEPAN
  // ==========================================
  const rotateToProductIndex = (targetIdx: number) => {
    const currentAngle = currentAngleRef.current;
    const currentNearestStep = Math.round(-currentAngle / angleStep);
    const currentFrontIdx = ((-currentNearestStep % N) + N) % N;

    // Hitung jarak rotasi terpendek (antara putar kiri atau kanan)
    let stepDiff = targetIdx - currentFrontIdx;
    if (stepDiff > N / 2) stepDiff -= N;
    if (stepDiff < -N / 2) stepDiff += N;

    targetAngleRef.current = -(currentNearestStep + stepDiff) * angleStep;
    velocityRef.current = 0;
  };

  return (
    <div className="relative min-h-screen bg-[#07090e] text-white flex flex-col justify-between overflow-hidden select-none font-sans">
      {/* Dynamic Background: Ambient Studio Glow & Neon Floor Spotlight */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        {/* Top subtle ambient spotlight */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[700px] h-[350px] bg-blue-600/10 blur-[130px] rounded-full" />
        {/* Floor Neon Oval Glow underneath the Orbit Wheel */}
        <div className="absolute top-[62%] left-1/2 -translate-x-1/2 -translate-y-1/2 w-[850px] h-[340px] bg-gradient-to-tr from-blue-700/20 via-indigo-500/15 to-purple-600/10 blur-[90px] rounded-[50%]" />
        {/* 3D Wireframe Orbit Ring Reference */}
        <div className="absolute top-[60%] left-1/2 -translate-x-1/2 -translate-y-1/2 w-[860px] h-[360px] rounded-[50%] border border-cyan-500/20 shadow-[0_0_50px_rgba(6,182,212,0.12)] [transform:rotateX(72deg)]" />
      </div>

      {/* Top Header / Branding */}
      <header className="relative z-20 max-w-7xl mx-auto w-full px-6 pt-8 flex items-center justify-between">
        <div>
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-cyan-400 animate-ping" />
            <span className="text-[10px] font-mono font-bold tracking-[0.25em] text-cyan-400 uppercase">
              3D ORBIT ENGINE · 60 FPS
            </span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-black tracking-tight text-white mt-1">
            VELOCITY <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-blue-500">LABS</span>
          </h1>
        </div>

        {/* Quick Helper Pill */}
        <div className="hidden sm:flex items-center gap-3 px-4 py-2 rounded-full bg-white/[0.04] border border-white/10 backdrop-blur-md text-xs text-slate-300">
          <span className="w-1.5 h-1.5 rounded-full bg-blue-400" />
          <span>Tarik horizontal atau scroll untuk memutar orbit</span>
        </div>
      </header>

      {/* Main 3D Orbit Stage */}
      <main className="relative z-10 flex-1 flex items-center justify-center my-4">
        <div
          ref={containerRef}
          onPointerDown={handlePointerDown}
          onPointerMove={handlePointerMove}
          onPointerUp={handlePointerUp}
          onPointerCancel={handlePointerUp}
          onWheel={handleWheel}
          className="relative w-full max-w-6xl h-[520px] sm:h-[580px] flex items-center justify-center cursor-grab active:cursor-grabbing touch-none"
          style={{ perspective: "1300px", transformStyle: "preserve-3d" }}
        >
          {PRODUCTS.map((product, idx) => {
            return (
              <div
                key={product.id}
                ref={(el) => { cardElementsRef.current[idx] = el; }}
                onClick={() => rotateToProductIndex(idx)}
                className="absolute w-[270px] sm:w-[310px] h-[390px] sm:h-[430px] rounded-[32px] p-6 flex flex-col justify-between backdrop-blur-xl border border-white/15 bg-gradient-to-b from-white/[0.08] to-white/[0.02] shadow-[0_30px_70px_rgba(0,0,0,0.8)] cursor-pointer will-change-transform data-[active=true]:border-cyan-400/80 data-[active=true]:shadow-[0_0_60px_rgba(6,182,212,0.35)] transition-[border-color,box-shadow] duration-300 group"
                style={{
                  transformStyle: "preserve-3d",
                  backfaceVisibility: "visible",
                }}
              >
                {/* Top Badge: Tag & Index */}
                <div className="flex items-center justify-between text-xs">
                  <span className="px-3 py-1 rounded-full bg-white/[0.08] border border-white/10 text-[10px] font-bold tracking-wider uppercase text-cyan-300">
                    {product.tag}
                  </span>
                  <span className="font-mono text-[11px] text-slate-400">
                    0{idx + 1}
                  </span>
                </div>

                {/* Floating Product Image with Dynamic 3D Lift */}
                <div className="relative my-auto flex items-center justify-center py-4">
                  {/* Sneaker Pedestal Glow */}
                  <div
                    className="absolute w-36 h-36 rounded-full blur-2xl opacity-40 transition-opacity duration-300 group-hover:opacity-75"
                    style={{ backgroundColor: product.color }}
                  />
                  <img
                    src={product.image}
                    alt={product.name}
                    className="relative z-10 w-full h-44 object-contain filter drop-shadow-[0_20px_25px_rgba(0,0,0,0.65)] transform transition-transform duration-500 group-hover:scale-110 group-hover:-rotate-3"
                    loading="lazy"
                    draggable={false}
                  />
                </div>

                {/* Product Meta & Pricing */}
                <div className="pt-3 border-t border-white/10">
                  <h3 className="text-lg font-bold tracking-tight text-white line-clamp-1 group-hover:text-cyan-300 transition-colors">
                    {product.name}
                  </h3>
                  <div className="flex items-center justify-between mt-2">
                    <span className="text-xl font-black text-transparent bg-clip-text bg-gradient-to-r from-white via-slate-100 to-cyan-300">
                      {product.price}
                    </span>
                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        rotateToProductIndex(idx);
                      }}
                      className="px-3.5 py-1.5 rounded-full bg-cyan-500 text-slate-950 text-xs font-bold hover:bg-cyan-400 active:scale-95 transition-all shadow-[0_0_20px_rgba(6,182,212,0.5)]"
                    >
                      VIEW
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </main>

      {/* Bottom Control Bar & Active Item HUD */}
      <footer className="relative z-20 max-w-7xl mx-auto w-full px-6 pb-8 flex flex-col sm:flex-row items-center justify-between gap-4">
        {/* Active Product Preview HUD */}
        <div className="flex items-center gap-3">
          <div
            className="w-3.5 h-3.5 rounded-full transition-colors duration-300 shadow-[0_0_12px_currentColor]"
            style={{ color: activeProduct.color }}
          />
          <div>
            <div className="text-[10px] font-mono uppercase tracking-widest text-slate-400">
              Active Focus ({activeIndex + 1}/{N})
            </div>
            <div className="text-sm font-extrabold text-white">
              {activeProduct.name} · <span className="text-cyan-400">{activeProduct.price}</span>
            </div>
          </div>
        </div>

        {/* Navigation Arrows & Dot Indicators */}
        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={() => rotateToProductIndex((activeIndex - 1 + N) % N)}
            className="w-11 h-11 rounded-full bg-white/[0.06] border border-white/15 text-white hover:bg-cyan-500 hover:text-slate-950 hover:border-cyan-400 transition-all flex items-center justify-center active:scale-95 shadow-lg"
            aria-label="Previous Product"
          >
            ❮
          </button>

          {/* Dots Indicator */}
          <div className="flex items-center gap-1.5 px-3 py-2 rounded-full bg-white/[0.05] border border-white/10 backdrop-blur-md">
            {PRODUCTS.map((_, i) => (
              <button
                key={i}
                type="button"
                onClick={() => rotateToProductIndex(i)}
                className={`h-1.5 rounded-full transition-all duration-300 ${
                  i === activeIndex
                    ? "w-6 bg-cyan-400 shadow-[0_0_10px_#22d3ee]"
                    : "w-1.5 bg-white/20 hover:bg-white/40"
                }`}
                aria-label={`Go to slide ${i + 1}`}
              />
            ))}
          </div>

          <button
            type="button"
            onClick={() => rotateToProductIndex((activeIndex + 1) % N)}
            className="w-11 h-11 rounded-full bg-white/[0.06] border border-white/15 text-white hover:bg-cyan-500 hover:text-slate-950 hover:border-cyan-400 transition-all flex items-center justify-center active:scale-95 shadow-lg"
            aria-label="Next Product"
          >
            ❯
          </button>
        </div>
      </footer>
    </div>
  );
}


