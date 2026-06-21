import type { Sentence } from '../types/evaluation';
import { PERIOD_COLORS } from '../types/evaluation';
import { BookOpen, Sparkles } from 'lucide-react';
import ReactMarkdown from 'react-markdown';
import { translations, getPeriodLabel } from '../locales/translations';
import './SentenceCard.css';

interface SentenceCardProps {
  sentence: Sentence;
  lang: 'en' | 'tl';
}

export default function SentenceCard({ sentence, lang }: SentenceCardProps) {
  const periodColor = PERIOD_COLORS[sentence.Period];
  const t = translations[lang];

  return (
    <div className="sentence-card">
      <div className="sentence-meta">
        <span
          className="period-badge"
          style={{ background: `${periodColor}15`, color: periodColor, borderColor: `${periodColor}30` }}
        >
          {getPeriodLabel(sentence.Period, lang)}
        </span>
        <span className="passage-id">
          {t.passageBadge} #{sentence.row_number - 1}
        </span>
      </div>

      <div className="sentence-panels">
        <div className="panel panel-original">
          <div className="panel-header">
            <BookOpen size={18} />
            <span>{t.originalTextLabel}</span>
          </div>
          <div className="panel-body">
            <div className="panel-text">
              <ReactMarkdown>{sentence.Original}</ReactMarkdown>
            </div>
          </div>
        </div>

        <div className="panel-divider">
          <div className="divider-line" />
          <div className="divider-icon">
            <span className="divider-arrow-desktop">→</span>
            <span className="divider-arrow-mobile">↓</span>
          </div>
          <div className="divider-line" />
        </div>

        <div className="panel panel-modern">
          <div className="panel-header">
            <Sparkles size={18} />
            <span>{t.modernTranslationLabel}</span>
          </div>
          <div className="panel-body">
            <div className="panel-text">
              <ReactMarkdown>{sentence.Modern}</ReactMarkdown>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
