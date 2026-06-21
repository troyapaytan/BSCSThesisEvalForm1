import { useState, useCallback, useMemo, useEffect } from 'react';
import { ClipboardCheck, ArrowRight, CheckCircle, AlertCircle, ChevronLeft, RotateCcw } from 'lucide-react';
import {
  type Sentence,
  type EvaluationScores,
  type ErrorAnalysisData,
  type SentenceEvaluation,
  type EvaluatorInfo,
  CRITERIA,
} from './types/evaluation';
import { fetchSentences, submitResults } from './services/api';
import SentenceCard from './components/SentenceCard';
import LikertScale from './components/LikertScale';
import ErrorAnalysis from './components/ErrorAnalysis';
import ProgressBar from './components/ProgressBar';
import EvaluationDocument from './components/EvaluationDocument';
import { translations } from './locales/translations';
import './App.css';

const ERROR_THRESHOLD = 2.99;

const INITIAL_SCORES: EvaluationScores = {
  linguisticAccuracy: 0,
  culturalAuthenticity: 0,
  comprehensibility: 0,
  completeness: 0,
};

const INITIAL_ERROR: ErrorAnalysisData = {
  linguisticError: false,
  culturalMisrepresentation: false,
  comprehensibilityIssue: false,
  temporalMisalignment: false,
  notes: '',
};

type Phase = 'info' | 'loading' | 'evaluation' | 'summary' | 'submitting' | 'thankyou';

function App() {
  // Global Language State
  const [lang, setLang] = useState<'en' | 'tl'>('tl');
  const t = translations[lang];

  // Phase management
  const [phase, setPhase] = useState<Phase>('info');

  // Evaluator
  const [evaluator, setEvaluator] = useState<EvaluatorInfo>({ name: '', affiliation: '' });

  // Data
  const [sentences, setSentences] = useState<Sentence[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [loadError, setLoadError] = useState<string | null>(null);
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [pdfBlob, setPdfBlob] = useState<Blob | null>(null);

  // Current evaluation
  const [scores, setScores] = useState<EvaluationScores>(INITIAL_SCORES);
  const [errorData, setErrorData] = useState<ErrorAnalysisData>(INITIAL_ERROR);

  // All evaluations
  const [evaluations, setEvaluations] = useState<SentenceEvaluation[]>([]);

  // Scroll to top when changing passages or phases
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, [currentIndex, phase]);

  // Computed average
  const averageScore = useMemo(() => {
    const vals = Object.values(scores).filter(v => v > 0);
    if (vals.length === 0) return 0;
    return vals.reduce((a, b) => a + b, 0) / vals.length;
  }, [scores]);

  const allScored = Object.values(scores).every(v => v > 0);
  const showErrorAnalysis = allScored && averageScore <= ERROR_THRESHOLD;
  const hasAnyError = Object.entries(errorData)
    .filter(([k]) => k !== 'notes')
    .some(([, v]) => v === true);

  const canSubmit = allScored && (!showErrorAnalysis || hasAnyError);

  // Load sentences
  const handleStartEvaluation = useCallback(async () => {
    setPhase('loading');
    setLoadError(null);
    try {
      const data = await fetchSentences();
      setSentences(data);
      setCurrentIndex(0);
      setPhase('evaluation');
    } catch (err) {
      setLoadError(err instanceof Error ? err.message : t.loadErrorPrefix);
      setPhase('info');
    }
  }, [t.loadErrorPrefix]);

  // Submit current and advance
  const handleSubmit = useCallback(async () => {
    const evaluation: SentenceEvaluation = {
      sentence: sentences[currentIndex],
      scores: { ...scores },
      averageScore: Number(averageScore.toFixed(2)),
      errorAnalysis: showErrorAnalysis ? { ...errorData } : undefined,
      timestamp: new Date().toISOString(),
    };

    const newEvaluations = [...evaluations, evaluation];
    setEvaluations(newEvaluations);

    // Reset for next
    setScores(INITIAL_SCORES);
    setErrorData(INITIAL_ERROR);

    if (currentIndex < sentences.length - 1) {
      setCurrentIndex(currentIndex + 1);
    } else {
      // Go to document preview (no submission yet)
      setPhase('summary');
    }
  }, [sentences, currentIndex, scores, averageScore, showErrorAnalysis, errorData, evaluations]);

  // Sign and submit with PDF
  const handleSignAndSubmit = useCallback(async (blob: Blob) => {
    setPdfBlob(blob);
    setPhase('submitting');
    setSubmitError(null);
    try {
      // Convert PDF blob to base64
      const reader = new FileReader();
      const base64 = await new Promise<string>((resolve, reject) => {
        reader.onload = () => {
          const result = reader.result as string;
          // Strip data:application/pdf;base64, prefix
          resolve(result.split(',')[1]);
        };
        reader.onerror = reject;
        reader.readAsDataURL(blob);
      });
      await submitResults(evaluator, evaluations, base64);
      setPhase('thankyou');
    } catch (err) {
      setSubmitError(err instanceof Error ? err.message : (lang === 'en' ? 'Failed to submit results' : 'Hindi maipadala ang mga resulta'));
    }
  }, [evaluator, evaluations, lang]);

  // Retry submission (reuse stored PDF)
  const handleRetrySubmit = useCallback(async () => {
    if (!pdfBlob) return;
    setSubmitError(null);
    try {
      const reader = new FileReader();
      const base64 = await new Promise<string>((resolve, reject) => {
        reader.onload = () => {
          const result = reader.result as string;
          resolve(result.split(',')[1]);
        };
        reader.onerror = reject;
        reader.readAsDataURL(pdfBlob);
      });
      await submitResults(evaluator, evaluations, base64);
      setPhase('thankyou');
    } catch (err) {
      setSubmitError(err instanceof Error ? err.message : (lang === 'en' ? 'Failed to submit results' : 'Hindi maipadala ang mga resulta'));
    }
  }, [evaluator, evaluations, pdfBlob, lang]);

  // Go back to previous sentence
  const handleBack = useCallback(() => {
    if (currentIndex > 0 && evaluations.length > 0) {
      const prevEval = evaluations[evaluations.length - 1];
      setScores(prevEval.scores);
      setErrorData(prevEval.errorAnalysis || INITIAL_ERROR);
      setEvaluations(evaluations.slice(0, -1));
      setCurrentIndex(currentIndex - 1);
    }
  }, [currentIndex, evaluations]);

  // Reset everything
  const handleRestart = useCallback(() => {
    setPhase('info');
    setSentences([]);
    setCurrentIndex(0);
    setScores(INITIAL_SCORES);
    setErrorData(INITIAL_ERROR);
    setEvaluations([]);
    setLoadError(null);
  }, []);

  // Update single score
  const updateScore = useCallback((key: keyof EvaluationScores, value: number) => {
    setScores(prev => ({ ...prev, [key]: value }));
  }, []);

  // Criteria Dynamic Labels
  const criterionLabel = (key: string) => {
    switch (key) {
      case 'linguisticAccuracy': return t.criteriaLinguisticLabel;
      case 'culturalAuthenticity': return t.criteriaCulturalLabel;
      case 'comprehensibility': return t.criteriaComprehensibilityLabel;
      case 'completeness': return t.criteriaCompletenessLabel;
      default: return '';
    }
  };

  const criterionDesc = (key: string) => {
    switch (key) {
      case 'linguisticAccuracy': return t.criteriaLinguisticDesc;
      case 'culturalAuthenticity': return t.criteriaCulturalDesc;
      case 'comprehensibility': return t.criteriaComprehensibilityDesc;
      case 'completeness': return t.criteriaCompletenessDesc;
      default: return '';
    }
  };

  // Floating Language switcher component (globally persistent)
  const renderLanguageSwitcher = () => (
    <div className="language-selector no-print">
      <button
        className={`lang-btn ${lang === 'en' ? 'active' : ''}`}
        onClick={() => setLang('en')}
      >
        EN
      </button>
      <button
        className={`lang-btn ${lang === 'tl' ? 'active' : ''}`}
        onClick={() => setLang('tl')}
      >
        TL
      </button>
    </div>
  );

  // Render evaluator info form
  if (phase === 'info') {
    return (
      <div className="app-container">
        {renderLanguageSwitcher()}
        <header className="app-header">
          <div className="app-logo">
            <ClipboardCheck size={28} />
          </div>
          <h1 className="app-title">{t.appTitle}</h1>
          <p className="app-subtitle">
            {t.appSubtitle}
          </p>
          <div className="thesis-info">
            <p className="thesis-title">
              {t.thesisTitle}
            </p>
            <p className="thesis-authors">
              {t.thesisAuthors}
            </p>
            <p className="thesis-institution">{t.thesisInstitution}</p>
            <div className="thesis-note">
              {t.thesisNote}
            </div>
          </div>
        </header>

        {loadError && (
          <div className="error-container">
            <div className="error-icon">
              <AlertCircle size={24} />
            </div>
            <p className="error-message">{loadError}</p>
            <button className="btn-primary" onClick={handleStartEvaluation}>
              <RotateCcw size={16} />
              {lang === 'en' ? 'Retry' : 'Subukan Muli'}
            </button>
          </div>
        )}

        <div className="evaluator-form">
          <h3>{t.evaluatorInfoTitle}</h3>
          <div className="form-group">
            <label className="form-label" htmlFor="eval-name">{t.fullNameLabel}</label>
            <input
              id="eval-name"
              className="form-input"
              type="text"
              placeholder={t.fullNamePlaceholder}
              value={evaluator.name}
              onChange={(e) => setEvaluator(prev => ({ ...prev, name: e.target.value }))}
            />
          </div>
          <div className="form-group">
            <label className="form-label" htmlFor="eval-affiliation">{t.affiliationLabel}</label>
            <input
              id="eval-affiliation"
              className="form-input"
              type="text"
              placeholder={t.affiliationPlaceholder}
              value={evaluator.affiliation}
              onChange={(e) => setEvaluator(prev => ({ ...prev, affiliation: e.target.value }))}
            />
          </div>
          <button
            className="btn-primary"
            disabled={!evaluator.name.trim() || !evaluator.affiliation.trim()}
            onClick={handleStartEvaluation}
          >
            {t.beginButton}
            <ArrowRight size={18} />
          </button>
        </div>
      </div>
    );
  }

  // Loading
  if (phase === 'loading') {
    return (
      <div className="app-container">
        {renderLanguageSwitcher()}
        <div className="loading-container">
          <div className="loading-spinner" />
          <p className="loading-text">{t.loadingSentences}</p>
        </div>
      </div>
    );
  }

  // Document preview (sign before submitting)
  if (phase === 'summary') {
    return (
      <>
        {renderLanguageSwitcher()}
        <EvaluationDocument
          evaluator={evaluator}
          evaluations={evaluations}
          onRestart={handleRestart}
          onSignAndSubmit={handleSignAndSubmit}
          lang={lang}
        />
      </>
    );
  }

  // Submitting results with PDF
  if (phase === 'submitting') {
    return (
      <div className="app-container">
        {renderLanguageSwitcher()}
        <div className="loading-container">
          {submitError ? (
            <>
              <div className="error-icon">
                <AlertCircle size={32} />
              </div>
              <p className="error-message">{submitError}</p>
              <button className="btn-primary" onClick={handleRetrySubmit}>
                <RotateCcw size={16} />
                {lang === 'en' ? 'Retry Submission' : 'Isumiteng Muli'}
              </button>
            </>
          ) : (
            <>
              <div className="loading-spinner" />
              <p className="loading-text">{lang === 'en' ? 'Submitting evaluation and PDF…' : 'Ipinapadala ang pagsusuri at PDF…'}</p>
            </>
          )}
        </div>
      </div>
    );
  }

  // Thank you page
  if (phase === 'thankyou') {
    return (
      <div className="app-container">
        {renderLanguageSwitcher()}
        <div className="thankyou-container">
          <div className="thankyou-icon">
            <CheckCircle size={48} />
          </div>
          <h1 className="thankyou-title">{t.thankYouTitle}</h1>
          <p className="thankyou-text">
            {t.thankYouMessage}
          </p>
          <p className="thankyou-subtext">
            {lang === 'en' ? 'Evaluated by' : 'Sinuri ni'} <strong>{evaluator.name}</strong> • {evaluator.affiliation}
          </p>
          {pdfBlob && (
            <button
              className="btn-primary thankyou-download"
              onClick={() => {
                const url = URL.createObjectURL(pdfBlob);
                const link = document.createElement('a');
                link.href = url;
                link.download = `evaluation_${evaluator.name.replace(/\s+/g, '_')}.pdf`;
                document.body.appendChild(link);
                link.click();
                document.body.removeChild(link);
                URL.revokeObjectURL(url);
              }}
            >
              {lang === 'en' ? 'Download Evaluation PDF' : 'I-download ang Ulat na PDF'}
            </button>
          )}
          <button className="btn-secondary" onClick={handleRestart} style={{ marginTop: '12px' }}>
            <RotateCcw size={16} />
            {lang === 'en' ? 'Start New Evaluation' : 'Magsimula ng Bagong Pagsusuri'}
          </button>
        </div>
      </div>
    );
  }

  // Evaluation phase
  const currentSentence = sentences[currentIndex];

  return (
    <div className="app-container">
      {renderLanguageSwitcher()}
      <header className="app-header">
        <div className="app-logo">
          <ClipboardCheck size={28} />
        </div>
        <h1 className="app-title">{t.appTitle}</h1>
      </header>

      <ProgressBar current={currentIndex + 1} total={sentences.length} lang={lang} />

      <div className="evaluation-page">
        {/* Sentence Display */}
        <SentenceCard sentence={currentSentence} lang={lang} />

        {/* Likert Scoring */}
        <div>
          <h3 className="evaluation-section-title">
            <ClipboardCheck size={18} />
            {lang === 'en' ? 'Evaluation Criteria' : 'Mga Pamantayan sa Pagsusuri'}
          </h3>
          <div className="likert-grid">
            {CRITERIA.map((criterion) => (
              <LikertScale
                key={criterion.key}
                criterionKey={criterion.key}
                label={criterionLabel(criterion.key)}
                description={criterionDesc(criterion.key)}
                value={scores[criterion.key]}
                onChange={(val) => updateScore(criterion.key, val)}
                lang={lang}
              />
            ))}
          </div>
        </div>

        {/* Average Score Indicator */}
        {allScored && (
          <div style={{ textAlign: 'center' }}>
            <div className={`avg-score-indicator ${averageScore >= 4 ? 'good' : averageScore >= 3 ? 'warning' : 'poor'}`}>
              {lang === 'en' ? 'Average Score' : 'Average na Marka'}: {averageScore.toFixed(2)} / 5.00
            </div>
          </div>
        )}

        {/* Conditional Error Analysis */}
        {showErrorAnalysis && (
          <ErrorAnalysis
            data={errorData}
            onChange={setErrorData}
            averageScore={averageScore}
            lang={lang}
          />
        )}

        {/* Navigation */}
        <div className="eval-footer">
          <div className="eval-footer-info">
            {t.passageBadge} <strong>{currentSentence.row_number - 1}</strong> • {lang === 'en' ? 'Progress' : 'Katayuan'}: <strong>{currentIndex + 1}</strong> {t.ofLabel} <strong>{sentences.length}</strong>
          </div>
          <div className="eval-footer-actions">
            {currentIndex > 0 && (
              <button className="btn-secondary" onClick={handleBack}>
                <ChevronLeft size={16} />
                {t.btnPrevious}
              </button>
            )}
            <button
              className={`btn-next ${currentIndex === sentences.length - 1 ? 'btn-finish' : ''}`}
              disabled={!canSubmit}
              onClick={handleSubmit}
            >
              {currentIndex === sentences.length - 1 ? (
                <>
                  {lang === 'en' ? 'Finish' : 'Tapusin'}
                  <CheckCircle size={16} />
                </>
              ) : (
                <>
                  {t.btnNext}
                  <ArrowRight size={16} />
                </>
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default App;
