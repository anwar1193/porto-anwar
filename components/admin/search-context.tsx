"use client";

import { createContext, useContext, useState, type ReactNode } from "react";

type AdminSearchValue = {
  query: string;
  setQuery: (value: string) => void;
};

const AdminSearchContext = createContext<AdminSearchValue | null>(null);

export function AdminSearchProvider({ children }: { children: ReactNode }) {
  const [query, setQuery] = useState("");

  return (
    <AdminSearchContext.Provider value={{ query, setQuery }}>
      {children}
    </AdminSearchContext.Provider>
  );
}

export function useAdminSearch() {
  const context = useContext(AdminSearchContext);

  if (!context) {
    throw new Error("useAdminSearch must be used inside AdminSearchProvider");
  }

  return context;
}
