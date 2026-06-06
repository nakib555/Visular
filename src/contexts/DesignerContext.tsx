import React, { createContext, useContext } from "react";
import { useDesignerState } from "../hooks/useDesignerState";

type DesignerStateFnType = ReturnType<typeof useDesignerState>;

const DesignerContext = createContext<DesignerStateFnType | null>(null);

export function DesignerProvider({ children }: { children: React.ReactNode }) {
  const state = useDesignerState();
  return (
    <DesignerContext.Provider value={state}>
      {children}
    </DesignerContext.Provider>
  );
}

export function useDesigner() {
  const context = useContext(DesignerContext);
  if (!context) {
    throw new Error("useDesigner must be used within DesignerProvider");
  }
  return context;
}
