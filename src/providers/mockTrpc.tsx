import React, { createContext, useContext, useState } from "react";
import { demoArticles, demoAdSlots } from "@/data/demoArticles";
import type { Article, AdSlot } from "@db/schema";

// Mock tRPC for static deployment
function useMockQuery<T>(data: T) {
  return { data, isLoading: false, error: null };
}

function useMockMutation<T>(handler?: () => T) {
  const [isPending, setIsPending] = useState(false);
  const mutate = () => {
    setIsPending(true);
    setTimeout(() => {
      setIsPending(false);
      handler?.();
    }, 500);
  };
  return { mutate, isPending };
}

const mockUtils = {
  article: { list: { invalidate: () => {} } },
  ad: { list: { invalidate: () => {} } },
  stats: { dashboard: { invalidate: () => {} } },
};

const trpcContext = createContext({
  article: {
    list: { useQuery: (input?: any) => useMockQuery({ items: demoArticles, total: demoArticles.length, page: 1, limit: 12, totalPages: 1 }) },
    getById: { useQuery: ({ id }: { id: number }) => useMockQuery(demoArticles.find((a) => a.id === id) ?? null) },
    getByCategory: { useQuery: ({ category }: { category: string }) => useMockQuery(demoArticles.filter((a) => a.category === category)) },
    search: { useQuery: ({ q }: { q: string }) => useMockQuery(demoArticles.filter((a) => a.title.toLowerCase().includes(q.toLowerCase()) || (a.summary ?? "").toLowerCase().includes(q.toLowerCase()))) },
    create: { useMutation: () => useMockMutation() },
    update: { useMutation: () => useMockMutation() },
    delete: { useMutation: () => useMockMutation() },
  },
  ad: {
    list: { useQuery: () => useMockQuery(demoAdSlots) },
    getBySlotId: { useQuery: ({ slotId }: { slotId: string }) => useMockQuery(demoAdSlots.find((s) => s.slotId === slotId) ?? null) },
    update: { useMutation: () => useMockMutation() },
    toggle: { useMutation: () => useMockMutation() },
  },
  stats: {
    dashboard: { useQuery: () => useMockQuery({ total: demoArticles.length, today: 0, published: demoArticles.length, draft: 0, byCategory: [] }) },
  },
  scrape: { useMutation: () => useMockMutation() },
  useUtils: () => mockUtils,
});

export function MockTRPCProvider({ children }: { children: React.ReactNode }) {
  return <trpcContext.Provider value={trpcContext as any}>{children}</trpcContext.Provider>;
}

export function useMockTRPC() {
  return useContext(trpcContext);
}
