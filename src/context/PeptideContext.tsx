import React, { createContext, useContext, useState, useMemo } from "react";
import type { Peptide } from "../types/peptide";
import peptidesJson from "../data/peptides.json";

const peptides = peptidesJson as Peptide[];

export interface PeptideContextValue {
  peptides: Peptide[];
  filteredPeptides: Peptide[];
  activeFilter: string;
  searchQuery: string;
  setActiveFilter: (tag: string) => void;
  setSearchQuery: (query: string) => void;
}

export const PeptideContext = createContext<PeptideContextValue | null>(null);

export function PeptideProvider({ children }: { children: React.ReactNode }) {
  const [activeFilter, setActiveFilter] = useState<string>("All");
  const [searchQuery, setSearchQuery] = useState<string>("");

  const filteredPeptides = useMemo(() => {
    const q = searchQuery.trim().toLowerCase();
    return peptides.filter((p) => {
      const matchesTag =
        activeFilter === "All" ||
        p.tags.includes(activeFilter as Peptide["tags"][number]);
      const matchesSearch =
        q === "" ||
        p.name.toLowerCase().includes(q) ||
        p.shortDescription.toLowerCase().includes(q);
      return matchesTag && matchesSearch;
    });
  }, [activeFilter, searchQuery]);

  return (
    <PeptideContext.Provider
      value={{
        peptides,
        filteredPeptides,
        activeFilter,
        searchQuery,
        setActiveFilter,
        setSearchQuery,
      }}
    >
      {children}
    </PeptideContext.Provider>
  );
}

export function usePeptides(): PeptideContextValue {
  const ctx = useContext(PeptideContext);
  if (!ctx) throw new Error("usePeptides must be used inside PeptideProvider");
  return ctx;
}
