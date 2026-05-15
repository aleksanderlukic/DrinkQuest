import { useState, useCallback } from 'react';
import { getNextQuestion, randomItem, generateId } from '../utils/randomizer';

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
  difficulty = 'all',
  contentMode = 'mixed',
  activeTypes = null,
}) {
  const [history, setHistory] = useState([]);
  const [currentQuestion, setCurrentQuestion] = useState(null);
  const [currentPlayer, setCurrentPlayer] = useState(null);
  const [roundCount, setRoundCount] = useState(0);

  const getPool = useCallback(() => {
    let pool = [];

    if (contentMode === 'builtin' || contentMode === 'mixed') {
      pool = [...pool, ...builtinQuestions];
    }
    if ((contentMode === 'custom' || contentMode === 'mixed') && customQuestions.length > 0) {
      pool = [...pool, ...customQuestions];
    }
    if (pool.length === 0 && contentMode !== 'builtin') {
      pool = [...builtinQuestions];
    }

    if (difficulty !== 'all') {
      pool = pool.filter((q) => q.difficulty === difficulty);
    }

    if (activeTypes && activeTypes.length > 0) {
      pool = pool.filter((q) => activeTypes.includes(q.type));
    }

    return pool;
  }, [builtinQuestions, customQuestions, difficulty, contentMode, activeTypes]);

  const next = useCallback(
    (forcedType = null) => {
      let pool = getPool();
      if (forcedType) {
        pool = pool.filter((q) => q.type === forcedType);
      }
      if (pool.length === 0) return;

      const question = getNextQuestion(pool, history);
      if (!question) return;

      setHistory((prev) => [...prev, question.id]);
      setCurrentQuestion(question);
      setRoundCount((c) => c + 1);

      if (players.length > 0) {
        setCurrentPlayer(players[Math.floor(Math.random() * players.length)]);
      } else {
        setCurrentPlayer(null);
      }
    },
    [getPool, history, players]
  );

  const reset = useCallback(() => {
    setHistory([]);
    setCurrentQuestion(null);
    setCurrentPlayer(null);
    setRoundCount(0);
  }, []);

  const pool = getPool();
  const totalQuestions = pool.length;
  const usedCount = history.length;
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
