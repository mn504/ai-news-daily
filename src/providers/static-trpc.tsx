// Static build: mock tRPC provider (no backend needed)
import React, { createContext, useContext, useState } from "react";
import { demoArticles, demoAdSlots } from "@/data/demoArticles";
import type { Article, AdSlot } from "@db/schema";

// --- Mock Query Hook ---
function createUseQuery<T>(getData: () => T) {
  return function useMockQuery(input?: any) {
    const [data] = useState<T>(() => getData());
    return { data, isLoading: false, error: null, isError: false, isSuccess: true };
  };
}

function createUseQueryWithInput<T, I>(getData: (input: I) => T) {
  return function useMockQuery(input: I) {
    const [data] = useState<T>(() => getData(input));
    return { data, isLoading: false, error: null, isError: false, isSuccess: true };
  };
}

// --- Mock Mutation Hook ---
function createUseMutation<T = any>() {
  return function useMockMutation() {
    const [isPending, setIsPending] = useState(false);
    const mutate = () => {
      setIsPending(true);
      setTimeout(() => setIsPending(false), 500);
    };
    const mutateAsync = async () => {
      setIsPending(true);
      setTimeout(() => setIsPending(false), 500);
    };
    return { mutate, mutateAsync, isPending, isSuccess: false, isError: false };
  };
}

// --- Mock Utils ---
const mockUtils = {
  article: { list: { invalidate: () => {}, refetch: () => {} } },
  ad: { list: { invalidate: () => {}, refetch: () => {} } },
  stats: { dashboard: { invalidate: () => {}, refetch: () => {} } },
};

// --- Mock tRPC Client ---
const mockTrpcClient = {
  article: {
    list: { useQuery: createUseQuery({ items: demoArticles, total: demoArticles.length, page: 1, limit: 12, totalPages: 1 }) },
    getById: { useQuery: createUseQueryWithInput((input: { id: number }) => demoArticles.find((a) => a.id === input.id) ?? null) },
    getByCategory: { useQuery: createUseQueryWithInput((input: { category: string }) => demoArticles.filter((a) => a.category === input.category)) },
    search: { useQuery: createUseQueryWithInput((input: { q: string }) => demoArticles.filter((a) => a.title.toLowerCase().includes(input.q.toLowerCase()) || (a.summary ?? "").toLowerCase().includes(input.q.toLowerCase()))) },
    create: { useMutation: createUseMutation() },
    update: { useMutation: createUseMutation() },
    delete: { useMutation: createUseMutation() },
  },
  ad: {
    list: { useQuery: createUseQuery(demoAdSlots) },
    getBySlotId: { useQuery: createUseQueryWithInput((input: { slotId: string }) => demoAdSlots.find((s) => s.slotId === input.slotId) ?? null) },
    update: { useMutation: createUseMutation() },
    toggle: { useMutation: createUseMutation() },
  },
  stats: {
    dashboard: { useQuery: createUseQuery({ total: demoArticles.length, today: 0, published: demoArticles.length, draft: 0, byCategory: [] }) },
  },
  scrape: { useMutation: createUseMutation() },
  useUtils: () => mockUtils,
};

// Export the mock trpc client (same interface as real trpc)
export const trpc = mockTrpcClient as any;

// Export the provider component
export function TRPCProvider({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
