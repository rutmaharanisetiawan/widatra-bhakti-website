import { useEffect, useState } from "react";
import { createFileRoute } from "@tanstack/react-router";
import { AdminShell, AdminButton } from "@/components/admin-shell";
import { Save } from "lucide-react";
import { useCompanyProfile } from "@/hooks/use-company-profile";
import { saveCompanyProfile } from "@/lib/cms-store";
import { MediaPickerField, MediaPickerGalleryField } from "@/components/media/media-picker-field";
import { toast } from "sonner";

export const Route = createFileRoute("/admin/cms")({
  head: () => ({ meta: [{ title: "Company CMS — Admin" }] }),
  component: AdminCmsPage,
});

function AdminCmsPage() {
  const { profile, refresh } = useCompanyProfile();
  const [draft, setDraft] = useState(profile);

  useEffect(() => {
    if (profile) {
      setDraft(profile);
    }
  }, [profile]);

  async function handleSave() {
    try {
      await saveCompanyProfile(draft);
      refresh();
      toast.success("Company Profile images updated");
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Couldn't save the profile.");
    }
  }

  return (
    <AdminShell
      title="Company Profile CMS"
      subtitle="Manage About, Vision, Mission, Values, History and Certifications displayed across the public site."
      actions={<AdminButton onClick={handleSave}><Save className="w-4 h-4" /> Save changes</AdminButton>}
    >
      <div className="card-elevated p-6 mb-4">
        <div className="eyebrow text-primary mb-1">About page — Hero image</div>
        <p className="text-[12px] text-corporate-gray mb-3">Shown behind the page title on /about. Sourced from the Media Library.</p>
        <MediaPickerField value={draft.heroImage} onChange={(ref) => setDraft((d) => ({ ...d, heroImage: ref }))} folder="Company Profile" />
      </div>

      <div className="card-elevated p-6 mb-4">
        <div className="eyebrow text-primary mb-1">Facility gallery</div>
        <p className="text-[12px] text-corporate-gray mb-3">
          The 3 photos in the Company Profile section (aerial, production line, QC scientist) — reused again on the video preview and footer banner.
        </p>
        <MediaPickerGalleryField
          value={draft.facilityGallery}
          onChange={(refs) => setDraft((d) => ({ ...d, facilityGallery: refs }))}
          folder="Company Profile"
        />
      </div>

      <div className="card-elevated p-6 mb-4">
        <div className="eyebrow text-primary mb-1">Leadership photos</div>
        <p className="text-[12px] text-corporate-gray mb-3">Headshots for the Management team section, in display order.</p>
        <MediaPickerGalleryField
          value={draft.leadershipPhotos}
          onChange={(refs) => setDraft((d) => ({ ...d, leadershipPhotos: refs }))}
          folder="Company Profile"
        />
      </div>

      <div className="grid lg:grid-cols-2 gap-4">
        {[
          { label: "About Widatra", value: "PT Widatra Bhakti is Indonesia's leading manufacturer of sterile infusion solutions. Founded in 1973 and part of the Otsuka Group since 1995." },
          { label: "Vision", value: "To be the most trusted pharmaceutical partner in Southeast Asia." },
          { label: "Mission", value: "Manufacture safe, effective and affordable sterile solutions that advance patient care." },
          { label: "Core values", value: "Integrity · Quality · Innovation · Sustainability · Otsuka-people" },
        ].map((f) => (
          <div key={f.label} className="card-elevated p-6">
            <div className="eyebrow text-primary mb-2">{f.label}</div>
            <textarea defaultValue={f.value} className="w-full min-h-32 p-3 border border-hairline text-sm focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/15" />
          </div>
        ))}
      </div>
      <div className="card-elevated p-6 mt-4">
        <div className="eyebrow text-primary mb-3">Certifications</div>
        <div className="flex flex-wrap gap-2">
          {["GMP", "ISO 9001", "ISO 14001", "Halal MUI", "BPOM", "Otsuka Group"].map((c) => (
            <span key={c} className="inline-flex h-9 px-4 border border-hairline text-[11px] font-semibold uppercase tracking-[0.2em]">{c}</span>
          ))}
        </div>
      </div>
    </AdminShell>
  );
}
