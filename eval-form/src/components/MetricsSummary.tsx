import type { SentenceEvaluation, Sentence } from '../types/evaluation';
import { PERIOD_COLORS } from '../types/evaluation';
import { TrendingUp, Award, CheckCircle, BarChart3, Download, FileJson, FileSpreadsheet } from 'lucide-react';
import { exportEvaluationsAsJSON, exportEvaluationsAsCSV } from '../services/api';
import { translations, getPeriodLabel } from '../locales/translations';
import './MetricsSummary.css';

interface MetricsSummaryProps {
  evaluations: SentenceEvaluation[];
  lang: 'en' | 'tl';
}

export default function MetricsSummary({ evaluations, lang }: MetricsSummaryProps) {
  const total = evaluations.length;
  if (total === 0) return null;

  const t = translations[lang];

  // Mean Score
  const overallMean = evaluations.reduce((sum, e) => sum + e.averageScore, 0) / total;

  // Cultural Fidelity Score (CFS): % rated ≥4 on Cultural Authenticity
  const cfsCount = evaluations.filter(e => e.scores.culturalAuthenticity >= 4).length;
  const cfsPercent = (cfsCount / total) * 100;

  // Expert Acceptance Rate: % with avg ≥ 4.0
  const acceptedCount = evaluations.filter(e => e.averageScore >= 4.0).length;
  const acceptanceRate = (acceptedCount / total) * 100;

  // Scores by criteria
  const criteriaData = [
    { label: t.criteriaLinguisticLabel, avg: evaluations.reduce((s, e) => s + e.scores.linguisticAccuracy, 0) / total },
    { label: t.criteriaCulturalLabel, avg: evaluations.reduce((s, e) => s + e.scores.culturalAuthenticity, 0) / total },
    { label: t.criteriaComprehensibilityLabel, avg: evaluations.reduce((s, e) => s + e.scores.comprehensibility, 0) / total },
    { label: t.criteriaCompletenessLabel, avg: evaluations.reduce((s, e) => s + e.scores.completeness, 0) / total },
  ];

  // Scores by period
  const periodGroups = evaluations.reduce((acc, e) => {
    const p = e.sentence.Period;
    if (!acc[p]) acc[p] = [];
    acc[p].push(e);
    return acc;
  }, {} as Record<string, SentenceEvaluation[]>);

  // Error analysis summary
  const errorEvals = evaluations.filter(e => e.errorAnalysis);
  const errorSummary = {
    linguisticError: errorEvals.filter(e => e.errorAnalysis?.linguisticError).length,
    culturalMisrepresentation: errorEvals.filter(e => e.errorAnalysis?.culturalMisrepresentation).length,
    comprehensibilityIssue: errorEvals.filter(e => e.errorAnalysis?.comprehensibilityIssue).length,
    temporalMisalignment: errorEvals.filter(e => e.errorAnalysis?.temporalMisalignment).length,
  };

  const handleExportJSON = () => {
    const exportData = {
      metadata: {
        exportDate: new Date().toISOString(),
        totalSentences: total,
        overallMeanScore: overallMean,
        culturalFidelityScore: cfsPercent / 100,
        expertAcceptanceRate: acceptanceRate / 100,
      },
      evaluations,
    };
    exportEvaluationsAsJSON(exportData);
  };

  const handleExportCSV = () => {
    const rows = evaluations.map(e => ({
      passage_number: e.sentence.row_number - 1,
      row_number: e.sentence.row_number,
      period: e.sentence.Period,
      original: e.sentence.Original,
      modern: e.sentence.Modern,
      linguistic_accuracy: e.scores.linguisticAccuracy,
      cultural_authenticity: e.scores.culturalAuthenticity,
      comprehensibility: e.scores.comprehensibility,
      completeness: e.scores.completeness,
      average_score: e.averageScore,
      has_errors: e.errorAnalysis ? 'Yes' : 'No',
      error_linguistic: e.errorAnalysis?.linguisticError ? 'Yes' : 'No',
      error_cultural: e.errorAnalysis?.culturalMisrepresentation ? 'Yes' : 'No',
      error_comprehensibility: e.errorAnalysis?.comprehensibilityIssue ? 'Yes' : 'No',
      error_temporal: e.errorAnalysis?.temporalMisalignment ? 'Yes' : 'No',
      error_notes: e.errorAnalysis?.notes || '',
      timestamp: e.timestamp,
    }));
    exportEvaluationsAsCSV(rows);
  };

  return (
    <div className="metrics-summary">
      <div className="metrics-header">
        <BarChart3 size={28} />
        <div>
          <h2 className="metrics-title">{t.metricsTitle}</h2>
          <p className="metrics-subtitle">{total} {t.metricsSubtitle}</p>
        </div>
      </div>

      {/* Top-line Metrics */}
      <div className="metrics-grid">
        <div className="metric-card">
          <div className="metric-icon mean-icon">
            <TrendingUp size={22} />
          </div>
          <div className="metric-value">{overallMean.toFixed(2)}</div>
          <div className="metric-label">{t.metricMeanScore}</div>
          <div className="metric-scale">{lang === 'en' ? 'out of 5.0' : 'sa kabuoang 5.0'}</div>
        </div>

        <div className="metric-card">
          <div className={`metric-icon cfs-icon ${cfsPercent >= 80 ? 'target-met' : 'target-missed'}`}>
            <Award size={22} />
          </div>
          <div className="metric-value">{cfsPercent.toFixed(1)}%</div>
          <div className="metric-label">{t.metricCulturalFidelity}</div>
          <div className={`metric-target ${cfsPercent >= 80 ? 'met' : 'missed'}`}>
            Target: ≥80% {cfsPercent >= 80 ? '✓' : '✗'}
          </div>
        </div>

        <div className="metric-card">
          <div className={`metric-icon acceptance-icon ${acceptanceRate >= 80 ? 'target-met' : 'target-missed'}`}>
            <CheckCircle size={22} />
          </div>
          <div className="metric-value">{acceptanceRate.toFixed(1)}%</div>
          <div className="metric-label">{t.metricAcceptanceRate}</div>
          <div className={`metric-target ${acceptanceRate >= 80 ? 'met' : 'missed'}`}>
            Target: ≥80% {acceptanceRate >= 80 ? '✓' : '✗'}
          </div>
        </div>
      </div>

      {/* Criteria Breakdown */}
      <div className="breakdown-section">
        <h3 className="breakdown-title">{t.dimensionPerformanceTitle}</h3>
        <div className="criteria-bars">
          {criteriaData.map(({ label, avg }) => (
            <div key={label} className="criteria-bar-row">
              <span className="criteria-bar-label">{label}</span>
              <div className="criteria-bar-track">
                <div
                  className="criteria-bar-fill"
                  style={{ width: `${(avg / 5) * 100}%` }}
                />
              </div>
              <span className="criteria-bar-value">{avg.toFixed(2)}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Period Breakdown */}
      <div className="breakdown-section">
        <h3 className="breakdown-title">{lang === 'en' ? 'Scores by Linguistic Period' : 'Marka sa Bawat Panahong Lingguwistiko'}</h3>
        <div className="period-grid">
          {Object.entries(periodGroups).map(([period, evals]) => {
            const periodAvg = evals.reduce((s, e) => s + e.averageScore, 0) / evals.length;
            const periodKey = period as Sentence['Period'];
            return (
              <div key={period} className="period-card" style={{ borderLeftColor: PERIOD_COLORS[periodKey] }}>
                <div className="period-card-name" style={{ color: PERIOD_COLORS[periodKey] }}>
                  {getPeriodLabel(periodKey, lang)}
                </div>
                <div className="period-card-score">{periodAvg.toFixed(2)}</div>
                <div className="period-card-count">
                  {evals.length} {lang === 'en' ? 'passages' : 'talata'}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Error Summary */}
      {errorEvals.length > 0 && (
        <div className="breakdown-section error-breakdown">
          <h3 className="breakdown-title">{lang === 'en' ? 'Error Analysis Summary' : 'Buod ng Pagsusuri ng Pagkakamali'}</h3>
          <p className="error-total">
            {errorEvals.length} {t.ofLabel} {total} {lang === 'en' ? 'passages flagged for errors' : 'talata ang nakitaan ng pagkakamali'}
          </p>
          <div className="error-type-grid">
            {Object.entries(errorSummary).map(([key, count]) => {
              const labels: Record<string, string> = {
                linguisticError: t.errorLinguisticLabel,
                culturalMisrepresentation: t.errorCulturalLabel,
                comprehensibilityIssue: t.errorComprehensibilityLabel,
                temporalMisalignment: t.errorTemporalLabel,
              };
              return (
                <div key={key} className="error-type-item">
                  <span className="error-type-count">{count}</span>
                  <span className="error-type-label">{labels[key]}</span>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Export Buttons */}
      <div className="export-section">
        <h3 className="breakdown-title">
          <Download size={18} />
          {lang === 'en' ? 'Export Results' : 'I-export ang mga Resulta'}
        </h3>
        <div className="export-buttons">
          <button className="export-btn export-json" onClick={handleExportJSON}>
            <FileJson size={18} />
            {t.btnExportJSON}
          </button>
          <button className="export-btn export-csv" onClick={handleExportCSV}>
            <FileSpreadsheet size={18} />
            {t.btnExportCSV}
          </button>
        </div>
      </div>
    </div>
  );
}
