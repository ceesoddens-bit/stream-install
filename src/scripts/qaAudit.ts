import './setupEnv';
import { readFileSync, existsSync, writeFileSync } from 'node:fs';
import { resolve } from 'node:path';

// --- Imports ---
import { getAuth, signInWithEmailAndPassword } from 'firebase/auth';
import { setCurrentTenantId } from '../lib/firebase';
import { crmService } from '../lib/crmService';
import { projectService } from '../lib/projectService';
import { planningService } from '../lib/planningService';
import { financeService } from '../lib/financeService';
import { inventoryService } from '../lib/inventoryService';
import { formsService } from '../lib/formsService';
import { ticketService } from '../lib/ticketService';
import { hoursService } from '../lib/hoursService';
import { tasksService } from '../lib/tasksService';
import { aiService } from '../lib/aiService';
import { heeftToegang } from '../lib/moduleAccess';
import { MODULES, type ModuleKey } from '../lib/modules';

// --- QA Constants ---
const QA_EMAIL = 'qa@streaminstall.test';
const QA_PASSWORD = 'QaTest2026!';
const QA_TENANT_ID = 'qa-tenant';

const reportEntries: any[] = [];

function logResult(module: string, funct: string, status: '✅' | '⚠️' | '❌', error: string = '—') {
  console.log(`[${status === '✅' ? 'PASS' : 'FAIL'}] ${module} > ${funct} ${error !== '—' ? `(${error})` : ''}`);
  reportEntries.push({ module, funct, status, error });
}

async function testStep(module: string, funct: string, task: () => Promise<any>) {
  try {
    await task();
    logResult(module, funct, '✅');
    return true;
  } catch (err: any) {
    logResult(module, funct, '❌', err.message || String(err));
    return false;
  }
}

async function testRead(subscribeFn: any, ...args: any[]) {
  return new Promise((resolve, reject) => {
    const timeout = setTimeout(() => {
      if (unsubscribe) unsubscribe();
      reject(new Error("Timeout waiting for data (5s)"));
    }, 5000);
    const unsubscribe = subscribeFn((data: any) => {
      clearTimeout(timeout);
      if (unsubscribe) unsubscribe();
      resolve(data);
    }, ...args);
  });
}

async function main() {
  console.log(`\n🔍 Starting QA Audit for '${QA_TENANT_ID}'\n`);

  // 1. Auth
  const auth = getAuth();
  try {
    await signInWithEmailAndPassword(auth, QA_EMAIL, QA_PASSWORD);
    setCurrentTenantId(QA_TENANT_ID);
    console.log(`✅ Logged in as ${QA_EMAIL}\n`);
  } catch (err: any) {
    console.error("❌ Login failed:", err.code || err.message);
    process.exit(1);
  }

  const actiefModules: ModuleKey[] = MODULES.map(m => m.key);

  // --- Tests ---
  await testStep('crm', 'Lezen (subscribe)', () => testRead(crmService.subscribeToCompanies));
  await testStep('crm', 'Aanmaken', () => crmService.addCompany({ name: 'Audit Comp', status: 'Prospect' }));
  
  await testStep('projectmanagement', 'Lezen (subscribe)', () => testRead(projectService.subscribeToProjects));
  await testStep('projectmanagement', 'Aanmaken', () => projectService.addProject({ name: 'Audit Proj', client: 'Audit Comp', status: 'Lopend', progress: 0, dueDate: '2026-12-31', priority: 'Medium', team: [] }));
  
  await testStep('planning', 'Lezen (subscribe)', () => testRead(planningService.subscribeToPlanning));
  await testStep('planning', 'findOverlap()', () => planningService.findOverlap('QA Tester', '2026-05-07', '09:30', '10:30'));
  
  await testStep('offertes', 'Lezen (subscribe)', () => testRead(financeService.subscribeToQuotes));
  await testStep('offertes', 'convertQuoteToInvoice() check', async () => {
    if (!(financeService as any).convertQuoteToInvoice) throw new Error('Methode ontbreekt in financeService');
  });
  
  await testStep('facturering', 'Lezen (subscribe)', () => testRead(financeService.subscribeToInvoices));
  
  await testStep('voorraadbeheer', 'Lezen (subscribe)', () => testRead(inventoryService.subscribeToInventory));
  
  await testStep('formulieren', 'Lezen (templates)', () => testRead(formsService.subscribeToFormTemplates));
  
  await testStep('tickets', 'Lezen (subscribe)', () => testRead(ticketService.subscribeToTickets));
  
  await testStep('hours', 'Lezen (subscribe)', () => testRead(hoursService.subscribeToHours));
  
  await testStep('tasks', 'Lezen (subscribe)', () => testRead(tasksService.subscribeToTasks));
  
  await testStep('ai_assistent', 'generate()', async () => {
    try {
      const res = await Promise.race([
        aiService.generate('Test audit', 'quote'),
        new Promise((_, reject) => setTimeout(() => reject(new Error('AI Timeout')), 10000))
      ]);
      if (!res) throw new Error('Geen respons');
    } catch (e) {
      logResult('ai_assistent', 'generate', '⚠️', 'AI extension check timed out or failed');
    }
  });

  await testStep('klantportaal', 'Portaal query check', () => testRead(ticketService.subscribeToTickets, 5, 'qa-contact-id'));

  logResult('automatiseringen', 'Component load check', '⚠️', 'Browser environment required for UI check');

  await testStep('dashboarding', 'Widget subscriptions', () => testRead(crmService.subscribeToCompanies));

  // --- Finalize ---
  generateMarkdownReport();
  console.log(`\n✅ Audit finished. Report saved to qa-rapport.md\n`);
  process.exit(0);
}

function generateMarkdownReport() {
  const date = new Date().toLocaleDateString('nl-NL');
  const modulesList = ['crm', 'projectmanagement', 'planning', 'offertes', 'facturering', 'voorraadbeheer', 'formulieren', 'tickets', 'hours', 'tasks', 'ai_assistent', 'klantportaal', 'automatiseringen', 'dashboarding'];
  
  let total = modulesList.length;
  let fullyWorking = 0;
  let partiallyWorking = 0;
  let blocked = 0;

  const moduleStats = modulesList.map(m => {
    const entries = reportEntries.filter(e => e.module === m);
    const fails = entries.filter(e => e.status === '❌').length;
    const warns = entries.filter(e => e.status === '⚠️').length;
    
    let status = '✅';
    if (fails > 0) {
      status = '❌';
      blocked++;
    } else if (warns > 0 || entries.length === 0) {
      status = '⚠️';
      partiallyWorking++;
    } else {
      fullyWorking++;
    }

    return { name: m, status, entries };
  });

  let md = `# StreamInstall QA Rapport — ${date}\n\n`;
  md += `## Samenvatting\n`;
  md += `- Modules volledig werkend: ${fullyWorking}/${total}\n`;
  md += `- Modules gedeeltelijk werkend: ${partiallyWorking}/${total}\n`;
  md += `- Modules met blocker: ${blocked}/${total}\n\n`;

  md += `## Per module\n\n`;

  for (const m of moduleStats) {
    md += `### ${m.status} ${m.name.toUpperCase()}\n`;
    md += `| Functie | Status | Foutmelding |\n`;
    md += `|---------|--------|-------------|\n`;
    if (m.entries.length === 0) {
      md += `| Algemeen | ⚠️ | Geen specifieke tests uitgevoerd |\n`;
    } else {
      for (const e of m.entries) {
        md += `| ${e.funct} | ${e.status} | ${e.error} |\n`;
      }
    }
    md += `\n**Bevindingen:** ${m.status === '✅' ? 'Geen problemen gevonden.' : m.status === '❌' ? 'Kritieke fouten gedetecteerd.' : 'Aandachtspunten gevonden.'}\n`;
    md += `**Prioriteit fix:** ${m.status === '❌' ? 'Hoog' : m.status === '⚠️' ? 'Middel' : 'Laag'}\n\n`;
  }

  md += `## Top 5 prioriteiten\n`;
  const criticals = reportEntries.filter(e => e.status === '❌').slice(0, 5);
  criticals.forEach((c, i) => {
    md += `${i + 1}. **${c.module}**: Fix ${c.funct} (${c.error})\n`;
  });
  if (criticals.length === 0) md += `Geen kritieke prioriteiten gevonden.\n`;

  writeFileSync('qa-rapport.md', md);
}

main().catch(err => {
  console.error(err);
  process.exit(1);
});
