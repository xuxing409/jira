import { useState } from "react";

export const useUndo = <T>(initialPresent: T) => {
  const [past, setPast] = useState<T[]>([]);
  const [present, setPresent] = useState(initialPresent);
  const [futrue, setFuture] = useState<T[]>([]);

  const canUndo = past.length !== 0;
  const canRedo = futrue.length !== 0;
  // 撤销
  const undo = () => {
    if (!canUndo) return;

    const previous = past[past.length - 1];
    const newPast = past.slice(0, past.length - 1);

    setPast(newPast);
    setPresent(previous);
    setFuture([present, ...futrue]);
  };

  const redo = () => {
    if (!canRedo) return;

    const next = futrue[0];
    const newFuture = futrue.slice(1);

    setPast([...past, present]);
    setPresent(next);
    setFuture(newFuture);
  };
  const set = (newPresent: T) => {
    if (newPresent === present) {
      return;
    }
    setPast([...past, present]);
    setPresent(newPresent);
    setFuture([]);
  };

  const reset = (newPresent: T) => {
    setPast([]);
    setPresent(newPresent);
    setFuture([]);
  };
  return [
    { past, present, futrue },
    { set, reset, undo, redo, canUndo, canRedo },
  ];
};
