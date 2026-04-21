import { useEffect, useState } from 'react';
import {
  onSnapshot,
  query,
  orderBy,
  where,
  limit as firestoreLimit,
  QueryConstraint,
  DocumentData,
  OrderByDirection,
} from 'firebase/firestore';
import { tenantCol } from './firebase';
import { useTenant } from './tenantContext';

export interface UseCollectionOptions {
  orderByField?: string;
  orderDir?: OrderByDirection;
  where?: Array<[string, any, any]>;
  limit?: number;
  enabled?: boolean;
}

export interface UseCollectionResult<T> {
  data: T[];
  loading: boolean;
  error: Error | null;
}

export function useCollection<T extends DocumentData = DocumentData>(
  name: string,
  opts: UseCollectionOptions = {}
): UseCollectionResult<T & { id: string }> {
  const { tenantId } = useTenant();
  const [data, setData] = useState<Array<T & { id: string }>>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  const enabled = opts.enabled !== false;
  const wheresKey = JSON.stringify(opts.where ?? []);

  useEffect(() => {
    if (!enabled || !tenantId) {
      setLoading(false);
      return;
    }
    setLoading(true);
    const constraints: QueryConstraint[] = [];
    (opts.where ?? []).forEach(([field, op, value]) => constraints.push(where(field, op, value)));
    if (opts.orderByField) constraints.push(orderBy(opts.orderByField, opts.orderDir ?? 'asc'));
    if (opts.limit) constraints.push(firestoreLimit(opts.limit));

    const q = query(tenantCol(name), ...constraints);
    const unsub = onSnapshot(
      q,
      (snap) => {
        const rows = snap.docs.map((d) => ({ id: d.id, ...(d.data() as T) }));
        setData(rows);
        setLoading(false);
      },
      (err) => {
        setError(err as Error);
        setLoading(false);
      }
    );
    return () => unsub();
  }, [tenantId, name, enabled, wheresKey, opts.orderByField, opts.orderDir, opts.limit]);

  return { data, loading, error };
}
