import React, { useMemo, useRef, useState } from 'react';

export type ResizableColumnDef<K extends string> = {
  key: K;
  width: number;
  minWidth: number;
  resizable?: boolean;
};

export function useResizableColumns<K extends string>(columns: ReadonlyArray<ResizableColumnDef<K>>) {
  const [columnWidths, setColumnWidths] = useState<Record<K, number>>(() => {
    return columns.reduce((acc, col) => {
      acc[col.key] = col.width;
      return acc;
    }, {} as Record<K, number>);
  });

  const activeResizeRef = useRef<{
    key: K;
    startX: number;
    startWidth: number;
    minWidth: number;
  } | null>(null);

  const tableMinWidth = useMemo(() => {
    return columns.reduce((total, col) => total + (columnWidths[col.key] ?? col.width), 0);
  }, [columnWidths, columns]);

  const startResize = (key: K) => (e: React.PointerEvent) => {
    const col = columns.find((c) => c.key === key);
    if (!col || !col.resizable) return;

    e.preventDefault();
    e.stopPropagation();

    const startX = e.clientX;
    const startWidth = columnWidths[key] ?? col.width;
    const minWidth = col.minWidth;
    activeResizeRef.current = { key, startX, startWidth, minWidth };

    document.body.style.cursor = 'col-resize';
    document.body.style.userSelect = 'none';

    const onPointerMove = (evt: PointerEvent) => {
      const active = activeResizeRef.current;
      if (!active) return;
      const nextWidth = Math.max(active.minWidth, active.startWidth + (evt.clientX - active.startX));
      setColumnWidths((prev) => ({ ...prev, [active.key]: nextWidth }));
    };

    const onPointerUp = () => {
      activeResizeRef.current = null;
      document.body.style.cursor = '';
      document.body.style.userSelect = '';
      window.removeEventListener('pointermove', onPointerMove);
    };

    window.addEventListener('pointermove', onPointerMove);
    window.addEventListener('pointerup', onPointerUp, { once: true });
  };

  return {
    columnWidths,
    setColumnWidths,
    startResize,
    tableMinWidth,
  };
}

