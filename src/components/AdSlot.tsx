import { trpc } from "@/providers/trpc";

interface AdSlotProps {
  slotId: string;
  className?: string;
  fallback?: React.ReactNode;
}

export default function AdSlot({ slotId, className = "", fallback }: AdSlotProps) {
  const { data } = trpc.ad.getBySlotId.useQuery({ slotId });

  if (!data || !data.isActive) {
    if (fallback) return <div className={className}>{fallback}</div>;
    return (
      <div
        className={`bg-slate-900/50 border border-dashed border-slate-700 rounded-lg flex items-center justify-center text-slate-500 text-sm ${className}`}
      >
        <span className="px-2 py-1">广告位：{data?.name || slotId}</span>
      </div>
    );
  }

  return (
    <div className={className}>
      <div
        className="w-full"
        dangerouslySetInnerHTML={{ __html: data.htmlCode || "" }}
      />
    </div>
  );
}
