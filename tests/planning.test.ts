import { test } from 'node:test';
import assert from 'node:assert';
import { PlanningEntry } from '../src/lib/planningService';

export function checkOverlap(
  entries: PlanningEntry[],
  technician: string,
  date: string,
  start: string,
  end: string,
  excludeId?: string
): PlanningEntry | null {
  const overlap = entries.find(e => {
    if (e.id === excludeId) return false;
    if (e.technician !== technician || e.date !== date) return false;
    
    // Simple time overlap logic: (StartA < EndB) and (EndA > StartB)
    return (start < e.endTime) && (end > e.startTime);
  });
  return overlap || null;
}

test('checkOverlap controleert correct of events overlappen', (t) => {
  const existingEvents: PlanningEntry[] = [
    {
      id: 'e1',
      technician: 'tech1',
      date: '2025-01-01',
      startTime: '10:00',
      endTime: '12:00',
      projectId: 'p1',
      projectName: 'P1',
      client: 'C1',
      status: 'Ingepland',
      type: 'Installatie'
    },
    {
      id: 'e2',
      technician: 'tech2',
      date: '2025-01-01',
      startTime: '14:00',
      endTime: '16:00',
      projectId: 'p2',
      projectName: 'P2',
      client: 'C2',
      status: 'Ingepland',
      type: 'Installatie'
    }
  ];

  // Geen overlap: andere technici
  let overlap = checkOverlap(
    existingEvents,
    'tech3',
    '2025-01-01',
    '10:00',
    '12:00'
  );
  assert.strictEqual(overlap, null, 'Andere technicus = geen overlap');

  // Geen overlap: zelfde technicus, andere tijd
  overlap = checkOverlap(
    existingEvents,
    'tech1',
    '2025-01-01',
    '08:00',
    '10:00'
  );
  assert.strictEqual(overlap, null, 'Zelfde technicus, voorgaande tijd (aansluitend) = geen overlap');

  // Overlap: zelfde technicus, exact zelfde tijd
  overlap = checkOverlap(
    existingEvents,
    'tech1',
    '2025-01-01',
    '10:00',
    '12:00'
  );
  assert.strictEqual(overlap?.id, 'e1', 'Zelfde tijd en technicus = overlap');

  // Overlap: zelfde technicus, start valt er midden in
  overlap = checkOverlap(
    existingEvents,
    'tech1',
    '2025-01-01',
    '11:00',
    '13:00'
  );
  assert.strictEqual(overlap?.id, 'e1', 'Starttijd valt in bestaand event = overlap');

  // Overlap: negeer self
  overlap = checkOverlap(
    existingEvents,
    'tech1',
    '2025-01-01',
    '10:00',
    '12:00',
    'e1'
  );
  assert.strictEqual(overlap, null, 'Negeer eigen event id bij update');
});