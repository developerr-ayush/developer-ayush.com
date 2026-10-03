import type { Metadata } from "next";
import { Suspense } from "react";
import { PageHeader } from "../../../../components/admin/PageHeader";
import { TableSkeleton } from "../../../../components/ui/skeleton";
import SlangModeration from "../slang-moderation";

export const metadata: Metadata = { title: "Slang review" };

export default function PendingSlangPage() {
  return (
    <div className="space-y-6">
      <PageHeader eyebrow="Apps" title="Review queue" description="Community submissions waiting on you. Work through them from the keyboard." />
      <Suspense fallback={<TableSkeleton rows={8} cols={5} />}>
        <SlangModeration defaultStatus="pending" />
      </Suspense>
    </div>
  );
}
