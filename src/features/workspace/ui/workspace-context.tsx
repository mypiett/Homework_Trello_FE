import { useMemo, useReducer } from "react";
import { WorkspaceContext, WorkspaceDispatchContext } from "../shared/context";
import type { SortOption, ViewMode } from "@/features/workspace/shared/types";
import type { Board } from "@/shared/lib/types";
import { useBoardStore } from "@/shared/stores/useBoardStore";
import { useParams } from "react-router";


function reducer(state: {
    searchQuery: string;
    sortBy: SortOption;
    viewMode: ViewMode;
    boards: Board[];
}, action: {
    type: string;
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    payload: any;
}) {
    switch (action.type) {
        case 'SET_SEARCH_QUERY':
            return { ...state, searchQuery: action.payload };
        case 'SET_SORT_BY':
            return { ...state, sortBy: action.payload };
        case 'SET_VIEW_MODE':
            return { ...state, viewMode: action.payload };
        case 'SET_BOARDS':
            return { ...state, boards: action.payload };
        default:
            return state;
    }
}

export function WorkspaceContextProvider({ children }: { children: React.ReactNode }) {
    console.log("%cWorkspaceContextProvider rendered", "color: green");

    const { workspaceId } = useParams<{ workspaceId: string }>();
    const { boards } = useBoardStore();

    const [state, dispatch] = useReducer(reducer, {
        searchQuery: "",
        sortBy: "recent" as SortOption,
        viewMode: "grid" as ViewMode,
        boards: [],
    });

    // Get boards for this workspace
    const workspaceBoards = useMemo(() => 
        boards.filter((board) => board.workspaceId === workspaceId),
        [boards, workspaceId]
    );

    // Filter and sort boards based on current state
    const filteredAndSortedBoards = useMemo(() => {
        const filtered = workspaceBoards.filter(
            (board) =>
                board.title.toLowerCase().includes(state.searchQuery.toLowerCase()) ||
                board.description
                    ?.toLowerCase()
                    .includes(state.searchQuery.toLowerCase())
        );

        switch (state.sortBy) {
            case "az":
                return filtered.sort((a, b) => a.title.localeCompare(b.title));
            case "za":
                return filtered.sort((a, b) => b.title.localeCompare(a.title));
            case "recent":
                return filtered.sort(
                    (a, b) =>
                        new Date(b.createdAt).getTime() -
                        new Date(a.createdAt).getTime()
                );
            case "oldest":
                return filtered.sort(
                    (a, b) =>
                        new Date(a.createdAt).getTime() -
                        new Date(b.createdAt).getTime()
                );
            default:
                return filtered;
        }
    }, [workspaceBoards, state.searchQuery, state.sortBy]);

    // Create context value with filtered boards
    const contextValue = useMemo(() => ({
        ...state,
        boards: filteredAndSortedBoards,
    }), [state, filteredAndSortedBoards]);

    return (
        <WorkspaceContext value={contextValue}>
            <WorkspaceDispatchContext value={dispatch}>
            {children}
            </WorkspaceDispatchContext>
        </WorkspaceContext>
    )
}