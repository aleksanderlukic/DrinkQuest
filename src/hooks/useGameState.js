import { useState, useCallback, useRef, useMemo } from "react";
import { getNextQuestion, randomItem } from "../utils/randomizer";

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

  // Use a ref for history so next() always reads the latest value
  // without needing history in its dependency array (avoids stale closure).
  const historyRef = useRef([]);

  const pool = useMemo(() => {
    let p = [];
    if (contentMode === "builtin" || contentMode === "mixed") {
      p = [...p, ...builtinQuestions];
    }
    if (
      (contentMode === "custom" || contentMode === "mixed") &&
      customQuestions.length > 0
    ) {
      p = [...p, ...customQuestions];
    }
    if (p.length === 0 && contentMode !== "builtin") {
      p = [...builtinQuestions];
    }
    if (difficulty !== "all") {
      p = p.filter((q) => q.difficulty === difficulty);
    }
    if (activeTypes && activeTypes.length > 0) {
      p = p.filter((q) => activeTypes.includes(q.type));
    }
    return p;
  }, [builtinQuestions, customQuestions, difficulty, contentMode, activeTypes]);

  const next = useCallback(
    (forcedType = null) => {
      let p = pool;
      if (forcedType) {
        p = p.filter((q) => q.type === forcedType);
      }
      if (p.length === 0) return;

      const question = getNextQuestion(p, historyRef.current);
      if (!question) return;

      historyRef.current = [...historyRef.current, question.id];
      setHistoryLength(historyRef.current.length);
      setCurrentQuestion(question);
      setRoundCount((c) => c + 1);

      if (players.length > 0) {
        setCurrentPlayer(players[Math.floor(Math.random() * players.length)]);
      } else {
        setCurrentPlayer(null);
      }
    },
    [pool, players],
  );

  const reset = useCallback(() => {
    historyRef.current = [];
    setHistoryLength(0);
    setCurrentQuestion(null);
    setCurrentPlayer(null);
    setRoundCount(0);
  }, []);

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
