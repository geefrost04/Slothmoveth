'use client';

import { useCallback, useEffect, useMemo, useState } from 'react';
import { buildDistinctRandomSession, distinctScope, shuffleArray } from '@/lib/randomization';

/**
 * Shared match-game state — used by MatchGame and AuthorityGame.
 *
 * Phase D behavior:
 *  - Round-based: groups of GROUP_SIZE pairs presented at a time.
 *  - Right column shuffled independently each round (Fisher–Yates).
 *  - Score carried across rounds; reset on full clear.
 *  - When all items in a round are matched → auto-advance to next round.
 */
export type MatchItem = { left: string; right: string };

const GROUP_SIZE = 5;
const WRONG_FLASH_MS = 700;

export function useMatchGame(items: MatchItem[]) {
  const sessionScope = useMemo(
    () => distinctScope('match', items.map((item) => `${item.left}→${item.right}`).join('|')),
    [items]
  );

  const [sessionItems, setSessionItems] = useState<MatchItem[]>(items);
  const totalRounds = Math.max(1, Math.ceil(sessionItems.length / GROUP_SIZE));

  const [round, setRound] = useState(0);
  const [score, setScore] = useState(0);
  const [wrong, setWrong] = useState<{ left: number; right: number } | null>(null);
  const [picks, setPicks] = useState<{ left?: number; right?: number }>({});
  const [matched, setMatched] = useState<Set<number>>(new Set());
  const [rightOrder, setRightOrder] = useState<number[]>(
    Array.from({ length: Math.min(GROUP_SIZE, items.length) }, (_, i) => i)
  );
  const [done, setDone] = useState(false);

  // Re-shuffle on mount and whenever the item set changes.
  useEffect(() => {
    const nextSession = buildDistinctRandomSession(
      sessionScope,
      () => shuffleArray(items),
      {
        signature: (pool) => pool.map((item) => `${item.left}→${item.right}`)
      }
    );
    setSessionItems(nextSession);
    setRound(0);
    setScore(0);
    setPicks({});
    setMatched(new Set());
    setWrong(null);
    setDone(false);
    setRightOrder(
      buildDistinctRandomSession(
        distinctScope(sessionScope, 'round', 0),
        () => shuffleArray(Array.from({ length: Math.min(GROUP_SIZE, nextSession.length) }, (_, i) => i)),
        { signature: (order) => order }
      )
    );
  }, [items, sessionScope]);

  // Slice items for current round (bounded by GROUP_SIZE)
  const roundItems = useMemo(
    () => sessionItems.slice(round * GROUP_SIZE, (round + 1) * GROUP_SIZE),
    [round, sessionItems]
  );

  // Re-shuffle right column whenever the round changes.
  // (Round 0 initial shuffle handled by the useEffect above.)
  const advanceRound = useCallback(
    (fromRound: number) => {
      const next = fromRound + 1;
      if (next >= totalRounds) {
        setDone(true);
        return;
      }
      setRound(next);
      setPicks({});
      setMatched(new Set());
      setRightOrder(
        buildDistinctRandomSession(
          distinctScope(sessionScope, 'round', next),
          () => shuffleArray(Array.from({ length: Math.min(GROUP_SIZE, sessionItems.length - next * GROUP_SIZE) }, (_, i) => i)),
          { signature: (order) => order }
        )
      );
    },
    [sessionItems.length, sessionScope, totalRounds]
  );

  const pick = useCallback(
    (side: 'left' | 'right', idx: number) => {
      if (matched.has(idx)) return;
      const next = { ...picks, [side]: idx };
      setPicks(next);
      if (next.left !== undefined && next.right !== undefined) {
        if (next.left === next.right) {
          setMatched((s) => {
            const ns = new Set(s);
            ns.add(next.left!);
            return ns;
          });
          setScore((sc) => sc + 1);
          setPicks({});
          // Auto-advance when round complete (use length check after state settles)
          if (matched.size + 1 === roundItems.length) {
            setTimeout(() => advanceRound(round), 500);
          }
        } else {
          setWrong({ left: next.left, right: next.right });
          setTimeout(() => {
            setWrong(null);
            setPicks({});
          }, WRONG_FLASH_MS);
        }
      }
    },
    [matched, picks, roundItems.length, round, advanceRound]
  );

  const reset = useCallback(() => {
    const nextSession = buildDistinctRandomSession(
      sessionScope,
      () => shuffleArray(items),
      {
        signature: (pool) => pool.map((item) => `${item.left}→${item.right}`)
      }
    );
    setSessionItems(nextSession);
    setRound(0);
    setScore(0);
    setPicks({});
    setMatched(new Set());
    setWrong(null);
    setDone(false);
    setRightOrder(
      buildDistinctRandomSession(
        distinctScope(sessionScope, 'round', 0),
        () => shuffleArray(Array.from({ length: Math.min(GROUP_SIZE, nextSession.length) }, (_, i) => i)),
        { signature: (order) => order }
      )
    );
  }, [items, sessionScope]);

  return {
    // State
    roundItems,
    rightOrder,
    picks,
    matched,
    wrong,
    score,
    round,
    totalRounds,
    done,
    // Actions
    pick,
    reset,
  };
}

export { GROUP_SIZE };
