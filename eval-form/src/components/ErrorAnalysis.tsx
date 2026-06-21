import type { ErrorAnalysisData } from '../types/evaluation';
import { AlertTriangle } from 'lucide-react';
import { translations } from '../locales/translations';
import './ErrorAnalysis.css';

interface ErrorAnalysisProps {
  data: ErrorAnalysisData;
  onChange: (data: ErrorAnalysisData) => void;
  averageScore: number;
  lang: 'en' | 'tl';
}

export default function ErrorAnalysis({ data, onChange, averageScore, lang }: ErrorAnalysisProps) {
  const toggleCategory = (key: keyof Omit<ErrorAnalysisData, 'notes'>) => {
    onChange({ ...data, [key]: !data[key] });
  };

  const t = translations[lang];

  const categories = [
    {
      key: 'linguisticError' as const,
      label: t.errorLinguisticLabel,
      description: t.errorLinguisticDesc,
    },
    {
      key: 'culturalMisrepresentation' as const,
      label: t.errorCulturalLabel,
      description: t.errorCulturalDesc,
    },
    {
      key: 'comprehensibilityIssue' as const,
      label: t.errorComprehensibilityLabel,
      description: t.errorComprehensibilityDesc,
    },
    {
      key: 'temporalMisalignment' as const,
      label: t.errorTemporalLabel,
      description: t.errorTemporalDesc,
    },
  ];

  return (
    <div className="error-analysis">
      <div className="error-analysis-header">
        <div className="error-alert-icon">
          <AlertTriangle size={22} />
        </div>
        <div>
          <h3 className="error-title">{t.errorModalTitle}</h3>
          <p className="error-subtitle">
            {lang === 'en' 
              ? `Average score ${averageScore.toFixed(2)} is below the 3.0 threshold. Please identify the type(s) of error present:`
              : `Ang average na marka na ${averageScore.toFixed(2)} ay mas mababa sa limitasyong 3.0. Tukuyin ang uri ng pagkakamali:`}
          </p>
        </div>
      </div>

      <div className="error-categories">
        {categories.map((cat) => (
          <label
            key={cat.key}
            className={`error-category ${data[cat.key] ? 'checked' : ''}`}
          >
            <div className="error-checkbox">
              <input
                type="checkbox"
                checked={data[cat.key]}
                onChange={() => toggleCategory(cat.key)}
              />
              <span className="checkmark">
                {data[cat.key] && (
                  <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
                    <path d="M3 7L6 10L11 4" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                )}
              </span>
            </div>
            <div className="error-category-text">
              <span className="error-category-label">{cat.label}</span>
              <span className="error-category-desc">{cat.description}</span>
            </div>
          </label>
        ))}
      </div>

      <div className="error-notes">
        <label className="error-notes-label" htmlFor="error-notes-input">{t.errorNotesLabel}</label>
        <textarea
          id="error-notes-input"
          className="error-notes-textarea"
          placeholder={t.errorNotesPlaceholder}
          value={data.notes}
          onChange={(e) => onChange({ ...data, notes: e.target.value })}
          rows={3}
        />
      </div>
    </div>
  );
}
