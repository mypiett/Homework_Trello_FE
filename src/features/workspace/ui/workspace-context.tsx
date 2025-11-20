import { useMemo, useState } from "react";
import {
  WorkspaceContext,
  WorkspaceDisplayContext,
  type WorkspaceContextType,
  type WorkspaceDisplayContextType,
} from "../shared/context";
import type { SortOption, ViewMode } from "../shared/types";
import type { Board } from "@/shared/lib/types";

export function WorkspaceProvider({ children }: { children: React.ReactNode }) {
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [sortBy, setSortBy] = useState<SortOption>("az");
  const [viewMode, setViewMode] = useState<ViewMode>("grid");
  const [boards, setBoards] = useState<Board[]>([]);

  const state: WorkspaceContextType = useMemo(
    () => ({
      searchQuery,
      sortBy,
      viewMode,
      boards,
    }),
    [searchQuery, sortBy, viewMode, boards]
  );

  const dispatch: WorkspaceDisplayContextType = useMemo(
    () => ({
      setSearchQuery,
      setSortBy,
      setViewMode,
      setBoards,
    }),
    [setSearchQuery, setSortBy, setViewMode, setBoards]
  );

  return (
    <WorkspaceContext.Provider value={state}>
      <WorkspaceDisplayContext.Provider value={dispatch}>
        {children}
      </WorkspaceDisplayContext.Provider>
    </WorkspaceContext.Provider>
  );
}