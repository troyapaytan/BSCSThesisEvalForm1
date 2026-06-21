import './ProgressBar.css';
import { translations } from '../locales/translations';

interface ProgressBarProps {
  current: number;
  total: number;
  lang: 'en' | 'tl';
}

export default function ProgressBar({ current, total, lang }: ProgressBarProps) {
  const progress = total > 0 ? (current / total) * 100 : 0;
  const t = translations[lang];

  return (
    <div className="progress-container">
      <div className="progress-info">
        <span className="progress-label">
          {t.passageBadge} <strong>{current}</strong> {t.ofLabel} <strong>{total}</strong>
        </span>
        <span className="progress-percent">{Math.round(progress)}%</span>
      </div>
      <div className="progress-track">
        <div className="progress-fill" style={{ width: `${progress}%` }}>
          <div className="progress-glow" />
        </div>
      </div>
    </div>
  );
}
