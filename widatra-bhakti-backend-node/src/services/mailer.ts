import nodemailer, { type Transporter } from "nodemailer";

export interface MailOptions {
  to: string;
  subject: string;
  text?: string;
  html?: string;
  replyTo?: string;
}

export interface PvReportEmailData {
  id: string;
  name: string;
  organization?: string | null;
  email: string;
  phone?: string | null;
  subject: string;
  message: string;
  receivedAt: string;
}

let transporterInstance: Transporter | null = null;

function getTransporter(): Transporter | null {
  if (transporterInstance) return transporterInstance;

  const host = process.env.SMTP_HOST;
  const port = Number(process.env.SMTP_PORT || 587);
  const user = process.env.SMTP_USER;
  const pass = process.env.SMTP_PASS;

  if (!host || !user || !pass) {
    return null;
  }

  transporterInstance = nodemailer.createTransport({
    host,
    port,
    secure: port === 465,
    auth: { user, pass },
  });

  return transporterInstance;
}

export async function sendMail(options: MailOptions): Promise<boolean> {
  const transporter = getTransporter();
  const from =
    process.env.SMTP_FROM ||
    `"PT Widatra Bhakti" <${process.env.SMTP_USER || "no-reply@widatra.com"}>`;

  if (!transporter) {
    console.log(
      `[Mailer Mock/Dev] SMTP credentials not fully configured in .env.`
    );
    console.log(`[Mailer Mock/Dev] Would send email:`);
    console.log(`  To: ${options.to}`);
    console.log(`  Subject: ${options.subject}`);
    if (options.text) {
      console.log(`  Body Preview:\n${options.text.slice(0, 300)}...`);
    }
    return true;
  }

  try {
    const info = await transporter.sendMail({
      from,
      to: options.to,
      subject: options.subject,
      text: options.text,
      html: options.html,
      replyTo: options.replyTo,
    });
    console.log(`[Mailer Success] Email sent: ${info.messageId} to ${options.to}`);
    return true;
  } catch (error) {
    console.error("[Mailer Error] Failed to send email via SMTP:", error);
    return false;
  }
}

/**
 * Dispatches a formatted notification email to the Pharmacovigilance (PV) unit
 * whenever a new Adverse Drug Reaction report is submitted.
 */
export async function sendPvReportEmail(data: PvReportEmailData): Promise<boolean> {
  const pvRecipient =
    process.env.PV_NOTIFICATION_EMAIL ||
    process.env.SMTP_USER ||
    "pv@widatra.com";

  const adminDashboardUrl = `${
    process.env.APP_URL || "http://localhost:5173"
  }/admin/contact`;

  const emailSubject = `[URGENT PV / ADR REPORT] ${data.subject} (${data.id})`;

  const plainText = `
===================================================================
PT WIDATRA BHAKTI — NOTIFIKASI LAPORAN FARMAKOVIGILANS BARU
===================================================================
Kode Referensi  : ${data.id}
Waktu Lapor     : ${data.receivedAt}
Pelapor         : ${data.name}
Kontak Pelapor  : ${data.phone || "-"} / ${data.email}
Faskes/Instansi : ${data.organization || "-"}
Perihal         : ${data.subject}

DETAIL ISI LAPORAN:
-------------------------------------------------------------------
${data.message}

-------------------------------------------------------------------
Tindakan Selanjutnya:
Silakan buka dashboard admin untuk menindaklanjuti atau membalas laporan:
${adminDashboardUrl}

Email ini digenerate secara otomatis oleh Sistem Farmakovigilans PT Widatra Bhakti.
===================================================================
`.trim();

  const htmlContent = `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <title>${emailSubject}</title>
  <style>
    body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; color: #1e293b; background-color: #f8fafc; margin: 0; padding: 24px; }
    .card { max-width: 680px; margin: 0 auto; background: #ffffff; border-radius: 16px; border: 1px solid #e2e8f0; overflow: hidden; box-shadow: 0 4px 16px rgba(0,0,0,0.06); }
    .header { background: linear-gradient(135deg, #e11d48, #be123c); color: #ffffff; padding: 24px 28px; }
    .badge { display: inline-block; background: rgba(255,255,255,0.25); color: #ffffff; padding: 4px 10px; border-radius: 9999px; font-size: 11px; font-weight: 700; text-transform: uppercase; letter-spacing: 0.1em; margin-bottom: 8px; }
    .title { font-size: 20px; font-weight: 700; margin: 0 0 6px 0; color: #ffffff; }
    .subtitle { font-size: 13px; opacity: 0.9; margin: 0; color: #ffffff; }
    .body { padding: 28px; }
    .meta-table { width: 100%; border-collapse: collapse; margin-bottom: 24px; }
    .meta-table th { text-align: left; padding: 10px 12px; background: #f1f5f9; font-size: 12px; font-weight: 600; color: #64748b; text-transform: uppercase; border-bottom: 1px solid #e2e8f0; width: 30%; }
    .meta-table td { padding: 10px 12px; border-bottom: 1px solid #e2e8f0; font-size: 13px; color: #0f172a; }
    .section-title { font-size: 14px; font-weight: 700; color: #0e3192; text-transform: uppercase; letter-spacing: 0.05em; margin: 24px 0 12px 0; padding-bottom: 6px; border-bottom: 2px solid #e2e8f0; }
    .content-box { background: #f8fafc; border: 1px solid #e2e8f0; border-radius: 8px; padding: 16px; font-family: monospace; font-size: 12.5px; line-height: 1.6; white-space: pre-wrap; color: #334155; }
    .btn-wrap { margin-top: 28px; text-align: center; }
    .btn { display: inline-block; background: #0e3192; color: #ffffff !important; text-decoration: none; padding: 12px 28px; border-radius: 9999px; font-weight: 700; font-size: 13px; letter-spacing: 0.05em; }
    .footer { padding: 20px 28px; background: #f8fafc; border-top: 1px solid #e2e8f0; font-size: 11.5px; color: #94a3b8; text-align: center; }
  </style>
</head>
<body>
  <div class="card">
    <div class="header">
      <span class="badge">Pharmacovigilance Alert</span>
      <h1 class="title">Laporan Efek Samping Obat (ADR) Baru</h1>
      <p class="subtitle">Laporan baru telah diterima dan tersimpan di database administrasi.</p>
    </div>
    <div class="body">
      <table class="meta-table">
        <tr>
          <th>Kode Laporan</th>
          <td><strong>${data.id}</strong></td>
        </tr>
        <tr>
          <th>Tanggal & Jam</th>
          <td>${data.receivedAt}</td>
        </tr>
        <tr>
          <th>Nama Pelapor</th>
          <td><strong>${data.name}</strong></td>
        </tr>
        <tr>
          <th>Instansi / Faskes</th>
          <td>${data.organization || "-"}</td>
        </tr>
        <tr>
          <th>Kontak Pelapor</th>
          <td>${data.phone || "-"} &middot; <a href="mailto:${data.email}">${data.email}</a></td>
        </tr>
        <tr>
          <th>Perihal Laporan</th>
          <td>${data.subject}</td>
        </tr>
      </table>

      <div class="section-title">Dokumentasi Pelaporan Lengkap</div>
      <div class="content-box">${escapeHtml(data.message)}</div>

      <div class="btn-wrap">
        <a href="${adminDashboardUrl}" class="btn">Buka Dashboard Admin Kontak</a>
      </div>
    </div>
    <div class="footer">
      Sistem Monitoring Farmakovigilans &middot; PT Widatra Bhakti (Otsuka Group Indonesia)<br>
      Pandaan Plant: Jl. Stadion No. 1, Pandaan, Pasuruan &middot; Head Office: Jakarta
    </div>
  </div>
</body>
</html>
`.trim();

  return sendMail({
    to: pvRecipient,
    subject: emailSubject,
    text: plainText,
    html: htmlContent,
    replyTo: data.email,
  });
}

function escapeHtml(str: string): string {
  return str
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#039;");
}
