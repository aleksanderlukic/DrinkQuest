import { useState, useCallback, useRef } from "react";
import { getNextQuestion } from "../utils/randomizer";

/**
 * Generic game state hook.
 * builtinQuestions: array of { id, text, type, difficulty, requiresNames }
 * customQuestions: array of the same shape
 * players: string[]
 * difficulty: 'all' | 'soft' | 'normal' | 'brutal'
 * contentMode: 'builtin' | 'custom' | 'mixed'
 * activeTypes: string[] — filter by type (e.g. ['truth'] or ['dare'] or ['truth','dare'])
 */
export function useGameState({
  builtinQuestions = [],
  customQuestions = [],
  players = [],
  difficulty = "all",
  contentMode = "mixed",
  activeTypes = null,
}) {
  const [currentQuestion, setCurrentQuestion] = useState(null);
  const [currentPlayer, setCurrentPlayer] = useState(null);
  const [roundCount, setRoundCount] = useState(0);
  const [historyLength, setHistoryLength] = useState(0);

  // historyRef lets next() always see the latest history without it
  // being a stale closure dependency.
  const historyRef = useRef([]);

  // paramsRef lets next() always read the latest pool params so the
  // callback never needs to be recreated when params change.
  const paramsRef = useRef({
    builtinQuestions,
    customQuestions,
    players,
    difficulty,
    contentMode,
    activeTypes,
  });
  // Sync every render — safe because next() is only called from event handlers
  // which run after the render is committed.
  paramsRef.current = {
    builtinQuestions,
    customQuestions,
    players,
    difficulty,
    contentMode,
    activeTypes,
  };

  // Stable helper: always computes from paramsRef.current
  const computePool = useCallback((forcedType = null) => {
    const {
      builtinQuestions: bq,
      customQuestions: cq,
      difficulty: diff,
      contentMode: cm,
      activeTypes: at,
    } = paramsRef.current;

    let p = [];
    if (cm === "builtin" || cm === "mixed") {
      p = [...p, ...(bq || [])];
    }
    if ((cm === "custom" || cm === "mixed") && (cq || []).length > 0) {
      p = [...p, ...(cq || [])];
    }
    if (p.length === 0 && cm !== "builtin") {
      p = [...(bq || [])];
    }
    if (diff !== "all") {
      p = p.filter((q) => q.difficulty === diff);
    }
    if (at && at.length > 0) {
      p = p.filter((q) => at.includes(q.type));
    }
    if (forcedType) {
      p = p.filter((q) => q.type === forcedType);
    }
    return p;
  }, []); // empty deps — always reads from paramsRef

  // Stable next — never recreated, always operates on latest data via refs
  const next = useCallback(
    (forcedType = null) => {
      // Guard: only treat string values as a type filter (ignore DOM events / other objects)
      const typeFilter = typeof forcedType === "string" ? forcedType : null;
      const p = computePool(typeFilter);
      if (p.length === 0) return;

      const question = getNextQuestion(p, historyRef.current);
      if (!question) return;

      historyRef.current = [...historyRef.current, question.id];
      setHistoryLength(historyRef.current.length);
      setCurrentQuestion(question);
      setRoundCount((c) => c + 1);

      const { players: pl } = paramsRef.current;
      if (pl && pl.length > 0) {
        setCurrentPlayer(pl[Math.floor(Math.random() * pl.length)]);
      } else {
        setCurrentPlayer(null);
      }
    },
    [computePool],
  );

  const reset = useCallback(() => {
    historyRef.current = [];
    setHistoryLength(0);
    setCurrentQuestion(null);
    setCurrentPlayer(null);
    setRoundCount(0);
  }, []);

  // Pool for rendering (allUsed, totalQuestions etc.)
  const pool = computePool();
  const totalQuestions = pool.length;
  const usedCount = historyLength;
  const allUsed = totalQuestions > 0 && usedCount >= totalQuestions * 1.5;

  return {
    currentQuestion,
    currentPlayer,
    roundCount,
    totalQuestions,
    usedCount,
    allUsed,
    next,
    reset,
    pool,
  };
}
