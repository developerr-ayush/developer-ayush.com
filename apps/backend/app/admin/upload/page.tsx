import type { Metadata } from "next";
import { PageHeader } from "../../../components/admin/PageHeader";
import UploadManager from "./upload-manager";

export const metadata: Metadata = { title: "Upload" };

export default function UploadPage() {
  return (
    <div className="space-y-6">
      <PageHeader eyebrow="Content" title="Upload" description="Send images to Cloudinary and copy the URL. Files upload one at a time." />
      <UploadManager />
    </div>
  );
}
