import { useState, useCallback, useMemo, useEffect } from 'react';
import { actions } from '../data/actions';
import { savePledge, getTotalPledged } from '../utils/supabase';
import { ANIMATION_DURATIONS } from '../utils/constants';

// Module-level debounce timer for Supabase efficiency
let debounceTimer: ReturnType<typeof setTimeout>;

export function usePledges() {
  const [pledgedActions, setPledgedActions] = useState<number[]>([]);
  const [globalTotal, setGlobalTotal] = useState<number | null>(null);

  // Fetch global total on mount
  useEffect(() => {
    getTotalPledged().then((total) => {
      if (total !== null) setGlobalTotal(total);
    });
  }, []);

  const pledgedTotal = useMemo(() => {
    return pledgedActions.reduce((sum, id) => {
      const action = actions.find((a) => a.id === id);
      return sum + (action?.kgSavedPerYear ?? 0);
    }, 0);
  }, [pledgedActions]);

  const handleTogglePledge = useCallback(
    (actionId: number) => {
      let newPledged: number[];

      if (pledgedActions.includes(actionId)) {
        newPledged = pledgedActions.filter((id) => id !== actionId);
      } else {
        newPledged = [...pledgedActions, actionId];
      }

      setPledgedActions(newPledged);

      const newTotal = newPledged.reduce((sum, id) => {
        const action = actions.find((a) => a.id === id);
        return sum + (action?.kgSavedPerYear ?? 0);
      }, 0);

      // Fire-and-forget Supabase save
      savePledge(newPledged, newTotal);

      // Debounce the aggregate refetch (1000ms)
      clearTimeout(debounceTimer);
      debounceTimer = setTimeout(() => {
        getTotalPledged().then((total) => {
          if (total !== null) setGlobalTotal(total);
        });
      }, ANIMATION_DURATIONS.SUPABASE_DEBOUNCE);
    },
    [pledgedActions]
  );

  return {
    pledgedActions,
    setPledgedActions,
    globalTotal,
    pledgedTotal,
    handleTogglePledge,
  };
}
