import { strict as assert } from 'node:assert';
import { invoicesData } from './mock';
import { computeInvoiceCounts, filterInvoices } from './utils';

const counts = computeInvoiceCounts(invoicesData);

assert.equal(counts.all, 5);
assert.equal(counts.Concept, 4);
assert.equal(counts.Goedgekeurd, 1);

assert.equal(filterInvoices({ rows: invoicesData, statusFilter: 'Alles', query: '' }).length, 5);
assert.equal(filterInvoices({ rows: invoicesData, statusFilter: 'Concept', query: '' }).length, 4);
assert.equal(filterInvoices({ rows: invoicesData, statusFilter: 'Goedgekeurd', query: '' }).length, 1);

assert.equal(filterInvoices({ rows: invoicesData, statusFilter: 'Alles', query: 'gabriel' }).length, 3);
assert.equal(filterInvoices({ rows: invoicesData, statusFilter: 'Alles', query: 'patrick' }).length, 1);
assert.equal(filterInvoices({ rows: invoicesData, statusFilter: 'Alles', query: 'ov-2510765' }).length, 1);
assert.equal(filterInvoices({ rows: invoicesData, statusFilter: 'Alles', query: 'inv-82' }).length, 0);
assert.equal(filterInvoices({ rows: invoicesData, statusFilter: 'Alles', query: '14' }).length, 5);
assert.equal(filterInvoices({ rows: invoicesData, statusFilter: 'Alles', query: '82' }).length, 1);

console.log('invoices utils tests: ok');
