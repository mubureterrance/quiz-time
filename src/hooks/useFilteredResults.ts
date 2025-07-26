import { useMemo } from "react";
import type { QuizResult } from "../hooks/useUserResults";

type FilterType = "all" | "recent" | "best";

export function useFilteredResults(results: QuizResult[], filter: FilterType) {
  return useMemo(() => {
    switch (filter) {
      case "recent":
        return results.slice(0, 10);
      case "best":
        return [...results].sort((a, b) => b.percentage - a.percentage).slice(0, 10);
      default:
        return results;
    }
  }, [results, filter]);
}