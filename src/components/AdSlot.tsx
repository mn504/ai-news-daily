import { trpc } from "@/providers/trpc";
import { demoAdSlots } from "@/data/demoArticles";

interface AdSlotProps {
  slotId: string;
  className?: string;
  fallback?: React.ReactNode;
}

export default function AdSlot({ slotId, className = "", fallback }: AdSlotProps) {
  const { data } = trpc.ad.getBySlotId.useQuery({ slotId });

  // Use API data if available, otherwise use demo data
  const adData = data ?? demoAdSlots.find((s) => s.slotId === slotId);

  if (!adData || !adData.isActive) {
    if (fallback) return <div className={className}>{fallback}</div>;
    // Don't show placeholder — just render nothing
    return null;
  }

  return (
    <div className={className}>
      <div
        className="w-full"
        dangerouslySetInnerHTML={{ __html: adData.htmlCode || "" }}
      />
    </div>
  );
}
