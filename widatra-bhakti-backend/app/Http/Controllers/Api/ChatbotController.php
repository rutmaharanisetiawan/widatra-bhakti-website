<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Http;
use Illuminate\Support\Facades\Log;

class ChatbotController extends Controller
{
    /**
     * System instruction and guardrails for Wida-Bot.
     */
    protected string $systemInstruction = <<<TEXT
Kamu adalah "Coby", maskot botol infus dan asisten virtual resmi PT Widatra Bhakti (anggota Otsuka Group Indonesia, produsen cairan infus medis dan peralatan steril berkualitas tinggi terdepan di Indonesia).

ATURAN & LINGKUP PENGETAHUAN RESMI:
1. Kepribadian:
   - Ramah, ceria, sopan, profesional, dan edukatif seperti karakter maskot botol infus kami (Coby).
   - Gunakan sapaan hangat seperti "Halo!", "Salam sehat dari Coby!", serta bahasa Indonesia yang santun dan terstruktur rapi. Jika pengguna bertanya dalam bahasa Inggris, jawab dengan ramah dalam bahasa Inggris yang fasih.

2. Lingkup Materi yang BOLEH dijawab secara LENGKAP:
   a. Profil & Sejarah Perusahaan:
      - PT Widatra Bhakti didirikan pada tahun 1986 di Pandaan, Pasuruan, Jawa Timur.
      - Bagian dari keluarga farmasi multinasional Otsuka Group (filosofi: "Otsuka-people creating new products for better health worldwide").
      - Nilai utama: Integritas, Ko-kreasi, Organisasi Pembelajar, dan Kemanusiaan.
   b. Fasilitas Pabrik & Standar Kualitas:
      - Pabrik modern seluas >5 hektar di Jl. Raya Pandaan - Bangil KM 1.5, Pandaan, Pasuruan, Jawa Timur.
      - Mengadopsi teknologi Grade A Closed-System Filling, Water for Injection (WFI) loop berkelanjutan, dan sterilisasi autoklaf termal terminal otomatis.
      - 100% leak testing & continuous visual inspection, apyrogenic, kemasan polietilen (PE) medis ramah lingkungan bebas DEHP/PVC dan bebas lateks.
      - Sertifikasi: CPOB / PIC/S GMP internasional, ISO 9001:2015, ISO 14001:2015, ISO 45001:2018, dan Sertifikat Halal MUI/BPJPH.
   c. Portofolio Produk Lengkap:
      - Larutan Dasar (Large Volume Parenterals / LVP): Sodium Chloride 0.9% (WIDA NS), Ringer Lactate (WIDA RL), Dextrose 5% & 10% (WIDA D5, WIDA D10), WIDA HSD, dll.
      - Nutrisi Khusus: AMIPAREN (nutrisi parenteral asam amino), WIDASOL, KA-EN Series (KA-EN 1B, 3A, 3B, 4A, 4B untuk rumatan elektrolit dan karbohidrat dari pediatrik hingga geriatri).
      - Larutan Irigasi & Alat Medis: WIDA WI (Water for Irrigation steril bebas pirogen) dan WidaSet (IV Administration Set steril).
   d. KARIER, REKRUTMEN & BUDAYA KERJA (JAWAB SECARA LENGKAP JIKA DITANYA):
      - Lowongan & Cara Melamar:
        * Pelamar dapat melihat posisi terbuka dan melamar langsung melalui menu "Careers" di website resmi kami (/careers).
        * Pengiriman CV & berkas lamaran dapat ditujukan ke email resmi rekrutmen: recruitment@widatra.com atau hrd@widatra.com (dengan subjek: Posisi_Nama Pelamar).
        * Akun LinkedIn resmi: PT Widatra Bhakti (Otsuka Group).
      - Departemen yang Tersedia:
        1. Produksi (Pengisian steril Grade A, formulasi cairan infus, pengawasan lini).
        2. Mutu (Quality Assurance / QA, Quality Control / QC analis kimia & mikrobiologi, validasi CPOB).
        3. R&D (Formulasi parenteral, kemasan botol polietilen, studi stabilitas).
        4. Engineering & Maintenance (Utilitas, WFI, HVAC cleanroom, otomasi & mekatronika).
        5. Supply Chain Management (PPIC, pengadaan bahan steril, logistik farmasi).
        6. Sales & Marketing (Medical Representative / Ethical Sales untuk kemitraan rumah sakit).
        7. Korporat (Regulatory Affairs, HRD, Finance & Accounting, Legal, IT).
        8. Program Magang (Internship mahasiswa tingkat akhir Farmasi, Kimia, Teknik, dll.).
      - Benefit & Fasilitas Karyawan:
        * BPJS Kesehatan & Ketenagakerjaan lengkap untuk karyawan dan keluarga.
        * Asuransi kesehatan swasta (rawat inap & jalan).
        * Bonus kinerja tahunan berbasis KPI.
        * Pelatihan GMP/CPOB berkelanjutan & peluang mobilitas karier lintas fungsi di Otsuka Group.
        * Tunjangan shift/lembur operasional pabrik.
        * Family gathering tahunan & dukungan legalitas/SIP bagi Apoteker.
      - Alur Seleksi: 1) Lamar Online -> 2) Screening CV -> 3) Tes Psikometri & Teknis -> 4) Wawancara HR & User -> 5) Penawaran & MCU -> 6) Onboarding.
      - PERINGATAN PENIPUAN (FRAUD DISCLAIMER): PT Widatra Bhakti TIDAK PERNAH memungut biaya apa pun (biaya tiket perjalanan, hotel, akomodasi, atau biaya tes) dalam seluruh proses rekrutmen. Seluruh proses 100% gratis dan transparan.
   e. Kontak & Kemitraan:
      - Pabrik Pandaan: Jl. Raya Pandaan - Bangil KM 1.5, Pandaan, Pasuruan. Telp: (0343) 631575 / 631777.
      - Kantor Pusat Jakarta: Pondok Indah Office Tower 1 Lt. 9, Jakarta Selatan. Telp: (021) 7592-3057.
      - Email: info@widatra.com | recruitment@widatra.com

3. BATASAN KETAT (GUARDRAIL TOPIC - WAJIB DIPATUHI):
   - Jika pengguna bertanya topik di LUAR PT Widatra Bhakti, produk cairan infus medis, fasilitas pabrik, kerja sama faskes, dan informasi karier kami (contoh: politik/pilkada, coding/scripting pemrograman, rumus matematika, resep masakan, gosip selebriti, rekomendasi anime/game, ramalan, kripto/judi, dll.), KAMU WAJIB MENOLAK DENGAN SANTUN:
     "Mohon maaf, sebagai asisten virtual dan maskot resmi PT Widatra Bhakti, saya (Coby) hanya dapat membantu pertanyaan seputar profil perusahaan, produk cairan infus medis, fasilitas pabrik, layanan kesehatan, dan informasi karier kami. Ada yang bisa Coby bantu terkait Widatra?"
   - DILARANG memberikan resep medis mandiri atau diagnosa klinis spesifik untuk pasien. Selalu ingatkan bahwa pemakaian cairan infus wajib atas indikasi dan di bawah pengawasan dokter/tenaga medis berwenang di fasilitas kesehatan.

4. FORMAT PENULISAN PESAN (SANGAT PENTING - WAJIB ALAMI & BEBAS SIMBOL MARKDOWN):
   - DILARANG menggunakan tanda bintang (* atau **teks**), tanda pagar (#, ##, ###), backtick (`kode`), atau simbol markdown mentah lainnya.
   - Tulis dalam bahasa Indonesia yang alami, rapi, bersih, dan mengalir seperti percakapan manusia profesional di WhatsApp atau Customer Service resmi.
   - Untuk poin-poin, gunakan nomor biasa (1., 2., 3.) atau simbol titik bulat (•) tanpa format bintang.
   - Untuk nama halaman, email, atau istilah penting, gunakan tanda petik biasa (contoh: menu "Careers" atau email recruitment@widatra.com), JANGAN gunakan tanda bintang atau backtick.
TEXT;

    /**
     * Handle incoming chat message.
     */
    public function chat(Request $request): JsonResponse
    {
        @set_time_limit(60);
        $validated = $request->validate([
            'message' => 'required|string|max:1000',
            'history' => 'nullable|array|max:30',
            'history.*.role' => 'required_with:history|string|in:user,model,assistant',
            'history.*.parts' => 'required_with:history|array',
            'history.*.parts.*.text' => 'required_with:history|string',
        ]);

        $userMessage = trim($validated['message']);
        $rawHistory = $validated['history'] ?? [];

        // Check for quick off-topic keywords to enforce instant local guardrail
        if ($this->isExplicitlyOffTopic($userMessage)) {
            return response()->json([
                'success' => true,
                'reply' => 'Mohon maaf, sebagai asisten virtual dan maskot resmi PT Widatra Bhakti, saya (Coby) hanya dapat membantu pertanyaan seputar profil perusahaan, produk cairan infus, fasilitas pabrik, dan layanan kami. Ada yang bisa Coby bantu terkait produk Widatra?',
                'model' => 'guardrail-local',
            ]);
        }

        $apiKey = env('GEMINI_API_KEY');

        // If Gemini API Key is configured, query Gemini API
        if (!empty($apiKey) && $apiKey !== 'YOUR_GEMINI_API_KEY') {
            try {
                $geminiResult = $this->callGeminiApi($apiKey, $userMessage, $rawHistory);
                if (!empty($geminiResult['reply'])) {
                    return response()->json([
                        'success' => true,
                        'reply' => $this->sanitizeNaturalText($geminiResult['reply']),
                        'model' => $geminiResult['model'] ?? 'gemini-ai',
                    ]);
                }
            } catch (\Throwable $e) {
                Log::warning('Gemini API call failed, falling back to knowledge engine: ' . $e->getMessage());
            }
        }

        // Fallback knowledge response engine when API key is pending or network fails
        $fallbackReply = $this->generateKnowledgeFallback($userMessage);

        return response()->json([
            'success' => true,
            'reply' => $this->sanitizeNaturalText($fallbackReply),
            'model' => 'wida-knowledge-engine',
            'note' => empty($apiKey) ? 'Set GEMINI_API_KEY in backend .env to enable direct Gemini AI generation' : null,
        ]);
    }

    /**
     * Call Google Gemini API with fallback models.
     *
     * @return array{reply: string, model: string}|null
     */
    protected function callGeminiApi(string $apiKey, string $message, array $history): ?array
    {
        // Format history into Gemini API contents structure
        $contents = [];

        foreach ($history as $h) {
            $role = ($h['role'] === 'assistant' || $h['role'] === 'model') ? 'model' : 'user';
            $text = '';
            foreach ($h['parts'] ?? [] as $part) {
                $text .= ($part['text'] ?? '') . ' ';
            }
            $text = trim($text);
            if (!empty($text)) {
                $contents[] = [
                    'role' => $role,
                    'parts' => [['text' => $text]],
                ];
            }
        }

        // Append current message
        $contents[] = [
            'role' => 'user',
            'parts' => [['text' => $message]],
        ];

        $payload = [
            'systemInstruction' => [
                'parts' => [
                    ['text' => $this->systemInstruction],
                ],
            ],
            'contents' => $contents,
            'generationConfig' => [
                'temperature' => 0.65,
                'topK' => 40,
                'topP' => 0.95,
                'maxOutputTokens' => 1000,
            ],
        ];

        // Sequence of models to try in order of speed and current availability
        $candidateModels = [
            'gemini-3.5-flash-lite',
            'gemini-flash-latest',
            'gemini-1.5-flash',
        ];

        foreach ($candidateModels as $model) {
            try {
                $endpoint = "https://generativelanguage.googleapis.com/v1beta/models/{$model}:generateContent?key={$apiKey}";

                $response = Http::timeout(8)
                    ->withHeaders(['Content-Type' => 'application/json'])
                    ->post($endpoint, $payload);

                if ($response->successful()) {
                    $data = $response->json();
                    $candidateText = $data['candidates'][0]['content']['parts'][0]['text'] ?? null;
                    if ($candidateText) {
                        return [
                            'reply' => trim($candidateText),
                            'model' => $model,
                        ];
                    }
                } else {
                    Log::info("Gemini model {$model} returned {$response->status()}: " . substr($response->body(), 0, 150));
                }
            } catch (\Throwable $e) {
                Log::warning("Gemini model {$model} request exception: " . $e->getMessage());
            }
        }

        return null;
    }

    /**
     * Check obvious out-of-scope topics.
     */
    protected function isExplicitlyOffTopic(string $msg): bool
    {
        $lower = strtolower($msg);
        $offKeywords = [
            'coding', 'python', 'javascript', 'php', 'html', 'css', 'react', 'laravel', 'sql',
            'presiden', 'pemilu', 'partai', 'pilkada', 'politik',
            'resep ayam', 'masak nasi', 'gorengan', 'bikin kue',
            'anime', 'manga', 'naruto', 'one piece', 'genshin',
            'hitung matematika', 'rumus kalkulus', 'aljabar', 'integral',
            'ramalan zodiak', 'horoskop', 'crypto', 'bitcoin', 'slot', 'judi'
        ];

        foreach ($offKeywords as $kw) {
            if (str_contains($lower, $kw)) {
                return true;
            }
        }

        return false;
    }

    /**
     * Knowledge-base fallback for common Widatra questions.
     */
    protected function generateKnowledgeFallback(string $msg): string
    {
        $lower = strtolower($msg);

        if (str_contains($lower, 'siapa kamu') || str_contains($lower, 'kamu siapa') || str_contains($lower, 'halo') || str_contains($lower, 'hai') || str_contains($lower, 'pagi') || str_contains($lower, 'siang') || str_contains($lower, 'sore')) {
            return "Halo! Saya Coby, maskot botol infus dan asisten virtual resmi PT Widatra Bhakti (Otsuka Group). Senang bisa menyapa Anda! Ada yang bisa Coby bantu seputar profil perusahaan, produk cairan infus berkualitas tinggi kami, info karier, atau informasi kerja sama rumah sakit?";
        }

        if (str_contains($lower, 'profil') || str_contains($lower, 'sejarah') || str_contains($lower, 'tentang widatra') || str_contains($lower, 'otsuka')) {
            return "PT Widatra Bhakti adalah produsen cairan infus dasar dan larutan medis terkemuka di Indonesia yang berdiri sejak tahun 1986 dan beroperasi di bawah naungan Otsuka Group. Pabrik kami berlokasi di Pandaan, Pasuruan di atas lahan lebih dari 5 hektar dengan komitmen standar mutu global PIC/S GMP dan sertifikasi Halal MUI.";
        }

        if (str_contains($lower, 'produk') || str_contains($lower, 'infus') || str_contains($lower, 'nacl') || str_contains($lower, 'ringer') || str_contains($lower, 'dextrose')) {
            return "PT Widatra Bhakti memproduksi portofolio lengkap cairan parenteral terstandar internasional:\n1. Larutan Dasar (LVP): WIDA NS (NaCl 0.9%), WIDA RL (Ringer Lactate), WIDA D5 & D10 (Dextrose).\n2. Nutrisi Khusus: AMIPAREN, WIDASOL, KA-EN series untuk kebutuhan elektrolit spesifik.\n3. Irigasi & Alat Medis: WIDA WI (Water for Irrigation) dan WidaSet (IV Administration Set).\nSeluruh produk diproduksi menggunakan closed-system filling dalam botol PE steril bebas PVC.";
        }

        if (str_contains($lower, 'pabrik') || str_contains($lower, 'pandaan') || str_contains($lower, 'fasilitas') || str_contains($lower, 'tour')) {
            return "Fasilitas manufaktur PT Widatra Bhakti berlokasi di Jl. Raya Pandaan - Bangil KM 1.5, Pandaan, Pasuruan, Jawa Timur. Pabrik kami mengadopsi Grade A Laminar Flow Sterile Filling, Water for Injection (WFI) loop berkelanjutan, dan sterilisasi autoklaf otomatis termal penuh. Anda juga dapat mengajukan Kunjungan Pabrik (Factory Tour) melalui formulir di website kami.";
        }

        if (str_contains($lower, 'kontak') || str_contains($lower, 'telepon') || str_contains($lower, 'email') || str_contains($lower, 'alamat') || str_contains($lower, 'hubungi')) {
            return "Anda dapat menghubungi kami melalui:\n• Pabrik Pandaan: (0343) 631575 / 631777\n• Kantor Pusat Jakarta: Pondok Indah Office Tower 1 Lt. 9, Jakarta Selatan. Telp: (021) 7592-3057\n• Email Layanan: info@widatra.com\nTim Customer Care kami siap membantu kebutuhan rumah sakit dan instansi Anda.";
        }

        if (str_contains($lower, 'karir') || str_contains($lower, 'karier') || str_contains($lower, 'career') || str_contains($lower, 'loker') || str_contains($lower, 'lowongan') || str_contains($lower, 'kerja') || str_contains($lower, 'rekrutmen') || str_contains($lower, 'melamar') || str_contains($lower, 'magang') || str_contains($lower, 'internship')) {
            return "Informasi Karier & Rekrutmen PT Widatra Bhakti (Otsuka Group):\n\n" .
                "• Portal Karier Resmi: Anda dapat melihat lowongan yang tersedia dan melamar langsung melalui menu 'Careers' di website ini (/careers).\n\n" .
                "• Pengiriman Lamaran: Silakan kirimkan CV dan berkas pendukung Anda ke email recruitment@widatra.com atau hrd@widatra.com dengan subjek [Posisi_Nama Anda].\n\n" .
                "• Departemen Utama: Produksi Steril (Pengisian Grade A), Pemastian & Kontrol Mutu (QA/QC Kimia & Mikrobiologi), R&D Formulasi, Teknik Otomasi & WFI, Rantai Pasok/Logistik, serta Medical Representative.\n\n" .
                "• Benefit: BPJS lengkap keluarga, asuransi swasta, bonus kinerja tahunan, pelatihan CPOB berkelanjutan, dan peluang pengembangan karier di Otsuka Group.\n\n" .
                "• Catatan Keamanan: PT Widatra Bhakti TIDAK PERNAH memungut biaya apa pun dalam seluruh tahapan seleksi rekrutmen.";
        }

        if (str_contains($lower, 'kerja sama') || str_contains($lower, 'vendor') || str_contains($lower, 'beli') || str_contains($lower, 'pesan') || str_contains($lower, 'rs') || str_contains($lower, 'rumah sakit')) {
            return "Untuk pengajuan kerja sama pasokan rumah sakit, tender faskes, atau kemitraan OEM/kontrak manufaktur, silakan kirimkan permohonan melalui email info@widatra.com atau isi formulir di halaman Kontak website kami. Tim representatif medis Widatra akan segera menindaklanjuti proposal Anda.";
        }

        return "Terima kasih atas pertanyaannya! Sebagai maskot dan asisten resmi PT Widatra Bhakti, saya (Coby) dapat membantu informasi seputar profil perusahaan, produk cairan infus (WIDA NS, RL, D5, Amiparen, WidaSet), fasilitas steril pabrik Pandaan, serta info karier dan tata cara kerja sama faskes. Silakan tanyakan hal spesifik yang ingin Anda ketahui!";
    }

    /**
     * Clean unnatural markdown characters (*, #, `, etc.) and produce clean natural prose.
     */
    protected function sanitizeNaturalText(string $text): string
    {
        // Remove markdown heading hashes: ### Title -> Title
        $text = preg_replace('/^#{1,6}\s*/m', '', $text);

        // Remove backtick-wrapped text: `code` -> code
        $text = preg_replace('/`+([^`]+)`+/', '$1', $text);
        $text = str_replace('`', '', $text);

        // Remove asterisks bold/italic markers: **text** -> text, *text* -> text
        $text = preg_replace('/\*{1,3}([^\*]+?)\*{1,3}/', '$1', $text);
        $text = str_replace('*', '', $text);

        // Convert list dashes or symbols at start of lines into clean bullet •
        $text = preg_replace('/^\s*[-]\s+/m', '• ', $text);

        // Remove horizontal lines (---, ***, ___ )
        $text = preg_replace('/^[-*_]{3,}\s*$/m', '', $text);

        // Normalize excessive newlines
        $text = preg_replace("/\n{3,}/", "\n\n", $text);

        return trim($text);
    }
}
