"use client";

import { createContext, useContext, useReducer, useCallback, type ReactNode } from "react";
import type { Project } from "@/data/projects";

interface SiteState {
  activeProject: Project | null;
  hoveredProject: string | null;
}

type SiteAction =
  | { type: "FOCUS_PROJECT"; project: Project | null }
  | { type: "HOVER_PROJECT"; id: string | null };

const initialState: SiteState = {
  activeProject: null,
  hoveredProject: null,
};

function reducer(state: SiteState, action: SiteAction): SiteState {
  switch (action.type) {
    case "FOCUS_PROJECT":
      return { ...state, activeProject: action.project };
    case "HOVER_PROJECT":
      return { ...state, hoveredProject: action.id };
    default:
      return state;
  }
}

interface SiteContextValue {
  state: SiteState;
  focusProject: (project: Project | null) => void;
  hoverProject: (id: string | null) => void;
}

const SiteContext = createContext<SiteContextValue | null>(null);

export function SiteProvider({ children }: { children: ReactNode }) {
  const [state, dispatch] = useReducer(reducer, initialState);

  const focusProject = useCallback((project: Project | null) => {
    dispatch({ type: "FOCUS_PROJECT", project });
  }, []);

  const hoverProject = useCallback((id: string | null) => {
    dispatch({ type: "HOVER_PROJECT", id });
  }, []);

  return (
    <SiteContext.Provider value={{ state, focusProject, hoverProject }}>
      {children}
    </SiteContext.Provider>
  );
}

export function useSite() {
  const ctx = useContext(SiteContext);
  if (!ctx) throw new Error("useSite must be used within SiteProvider");
  return ctx;
}
