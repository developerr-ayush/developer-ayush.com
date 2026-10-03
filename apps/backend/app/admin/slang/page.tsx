import type { Metadata } from "next";
import { Suspense } from "react";
import { PageHeader } from "../../../components/admin/PageHeader";
import { TableSkeleton } from "../../../components/ui/skeleton";
import SlangModeration from "./slang-moderation";

export const metadata: Metadata = { title: "Slang" };

export default function SlangPage() {
  return (
    <div className="space-y-6">
      <PageHeader eyebrow="Apps" title="Slang" description="Every term in the dictionary: approve, reject, feature or remove." />
      <Suspense fallback={<TableSkeleton rows={8} cols={5} />}>
        <SlangModeration defaultStatus="all" />
      </Suspense>
    </div>
  );
}
