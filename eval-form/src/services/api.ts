import type { Sentence, SentenceEvaluation, EvaluatorInfo } from '../types/evaluation';

const WEBHOOK_URL = 'https://aisla.taptan.space/webhook/getsentences';
const RESULTS_WEBHOOK_URL = 'https://aisla.taptan.space/webhook/thesisresults';

export async function submitResults(
  evaluator: EvaluatorInfo,
  evaluations: SentenceEvaluation[],
  pdfBase64?: string,
): Promise<void> {
  const payload: Record<string, unknown> = {
    evaluator,
    evaluations,
    submittedAt: new Date().toISOString(),
  };

  if (pdfBase64) {
    payload.pdfFile = pdfBase64;
  }

  const response = await fetch(RESULTS_WEBHOOK_URL, {
    method: 'POST',
    headers: {
      'Accept': 'application/json',
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(payload),
  });

  if (!response.ok) {
    throw new Error(`Failed to submit results: ${response.status} ${response.statusText}`);
  }

  const data = await response.json();

  if (data?.response !== 'SUCCESS') {
    throw new Error('Server did not confirm submission. Please try again.');
  }
}

export async function fetchSentences(): Promise<Sentence[]> {
  const response = await fetch(WEBHOOK_URL, {
    method: 'POST',
    headers: {
      'Accept': 'application/json',
      'Content-Type': 'application/json',
    },
  });

  if (!response.ok) {
    throw new Error(`Failed to fetch sentences: ${response.status} ${response.statusText}`);
  }

  const data: Sentence[] = await response.json();

  if (!Array.isArray(data) || data.length === 0) {
    throw new Error('No sentences returned from the webhook.');
  }

  return data;
}

export function exportEvaluationsAsJSON(data: unknown, filename: string = 'evaluation_results.json') {
  const json = JSON.stringify(data, null, 2);
  const blob = new Blob([json], { type: 'application/json' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = filename;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
}

export function exportEvaluationsAsCSV(data: Record<string, unknown>[], filename: string = 'evaluation_results.csv') {
  if (data.length === 0) return;

  const headers = Object.keys(data[0]);
  const csvContent = [
    headers.join(','),
    ...data.map(row =>
      headers.map(h => {
        const val = row[h];
        const str = typeof val === 'string' ? val : JSON.stringify(val);
        return `"${str.replace(/"/g, '""')}"`;
      }).join(',')
    ),
  ].join('\n');

  const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = filename;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
}
