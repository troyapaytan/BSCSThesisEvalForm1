import { getLikertLabel } from '../locales/translations';
import './LikertScale.css';

interface LikertScaleProps {
  criterionKey: string;
  label: string;
  description: string;
  value: number;
  onChange: (value: number) => void;
  lang: 'en' | 'tl';
}

export default function LikertScale({ criterionKey, label, description, value, onChange, lang }: LikertScaleProps) {
  return (
    <div className="likert-criterion">
      <div className="likert-header">
        <h4 className="likert-label">{label}</h4>
        <p className="likert-description">{description}</p>
      </div>
      <div className="likert-scale">
        {[1, 2, 3, 4, 5].map((point) => (
          <label
            key={point}
            className={`likert-option ${value === point ? 'selected' : ''} ${value === point ? `level-${point}` : ''}`}
          >
            <input
              type="radio"
              name={criterionKey}
              value={point}
              checked={value === point}
              onChange={() => onChange(point)}
            />
            <span className="likert-circle">{point}</span>
            <span className="likert-text">{getLikertLabel(point, lang)}</span>
          </label>
        ))}
      </div>
    </div>
  );
}
