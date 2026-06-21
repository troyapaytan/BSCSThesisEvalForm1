import { useRef, useState } from 'react';
import html2canvas from 'html2canvas-pro';
import { jsPDF } from 'jspdf';
import type { SentenceEvaluation, EvaluatorInfo } from '../types/evaluation';
import SignaturePad, { type SignaturePadRef } from './SignaturePad';
import { translations, getPeriodLabel, getLikertLabel } from '../locales/translations';
import './EvaluationDocument.css';

interface EvaluationDocumentProps {
  evaluator: EvaluatorInfo;
  evaluations: SentenceEvaluation[];
  onRestart: () => void;
  onSignAndSubmit: (pdfBlob: Blob) => void;
  lang: 'en' | 'tl';
}

export default function EvaluationDocument({ evaluator, evaluations, onRestart, onSignAndSubmit, lang }: EvaluationDocumentProps) {
  const signatureRef = useRef<SignaturePadRef>(null);
  const documentRef = useRef<HTMLDivElement>(null);
  const [isGenerating, setIsGenerating] = useState(false);

  const total = evaluations.length;
  const t = translations[lang];

  const overallMean = evaluations.reduce((sum, e) => sum + e.averageScore, 0) / total;

  const criteriaAverages = [
    { label: t.criteriaLinguisticLabel, avg: evaluations.reduce((s, e) => s + e.scores.linguisticAccuracy, 0) / total },
    { label: t.criteriaCulturalLabel, avg: evaluations.reduce((s, e) => s + e.scores.culturalAuthenticity, 0) / total },
    { label: t.criteriaComprehensibilityLabel, avg: evaluations.reduce((s, e) => s + e.scores.comprehensibility, 0) / total },
    { label: t.criteriaCompletenessLabel, avg: evaluations.reduce((s, e) => s + e.scores.completeness, 0) / total },
  ];

  const errorEvals = evaluations
    .map((ev, i) => ({ ev, index: i + 1 }))
    .filter(item => item.ev.errorAnalysis);

  const currentDate = new Date().toLocaleDateString(lang === 'en' ? 'en-US' : 'tl-PH', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });

  const handleConfirmAndSubmit = async () => {
    if (!signatureRef.current || signatureRef.current.isEmpty()) return;
    if (!documentRef.current) return;

    setIsGenerating(true);

    try {
      // Capture signature data URL and embed it as an image
      const sigDataURL = signatureRef.current.getDataURL();

      // Temporarily replace the signature pad with the static image for PDF capture
      const sigArea = documentRef.current.querySelector('.doc-signature-area');
      const originalContent = sigArea?.innerHTML || '';

      if (sigArea && sigDataURL) {
        sigArea.innerHTML = `
          <div style="background:#fafbfc;border:1px solid #e2e8f0;border-radius:12px;padding:12px;display:flex;align-items:center;justify-content:center;">
            <img src="${sigDataURL}" style="max-width:100%;max-height:140px;object-fit:contain;" />
          </div>
        `;
      }

      // Hide the confirm button and restart button for PDF
      const actionsEls = documentRef.current.querySelectorAll('.doc-actions-inner');
      actionsEls.forEach(el => (el as HTMLElement).style.display = 'none');

      // Force a consistent render width for device-independent PDF output
      const docEl = documentRef.current;
      const originalStyle = docEl.style.cssText;
      docEl.style.width = '800px';
      docEl.style.maxWidth = '800px';
      docEl.style.overflow = 'visible';

      // Generate flattened PDF from the document
      const canvas = await html2canvas(docEl, {
        scale: 2,
        useCORS: true,
        backgroundColor: '#ffffff',
        logging: false,
        windowWidth: 850,
      });

      // Restore original styles
      docEl.style.cssText = originalStyle;

      const imgData = canvas.toDataURL('image/jpeg', 0.8);
      const pageWidth = 210; // A4 width in mm
      const pageHeight = 297; // A4 height in mm
      const margin = 5; // mm margin
      const usableWidth = pageWidth - margin * 2;
      const usableHeight = pageHeight - margin * 2;

      // Scale to fit width first
      const imgAspect = canvas.height / canvas.width;
      let fitWidth = usableWidth;
      let fitHeight = fitWidth * imgAspect;

      // Limit to maximum of 2 pages
      const maxPages = 2;
      const maxTotalUsableHeight = usableHeight * maxPages;

      // If too tall for the max page limit, scale down to fit the max total height
      if (fitHeight > maxTotalUsableHeight) {
        fitHeight = maxTotalUsableHeight;
        fitWidth = fitHeight / imgAspect;
      }

      // Calculate how many pages we actually need
      const totalPagesNeeded = Math.ceil(fitHeight / usableHeight);

      const pdf = new jsPDF('p', 'mm', 'a4');
      const xOffset = margin + (usableWidth - fitWidth) / 2;

      for (let page = 0; page < totalPagesNeeded; page++) {
        if (page > 0) {
          pdf.addPage();
        }
        const yOffset = margin - (page * usableHeight);
        pdf.addImage(imgData, 'JPEG', xOffset, yOffset, fitWidth, fitHeight, undefined, 'FAST');
      }

      const pdfBlob = pdf.output('blob');

      // Restore original content
      if (sigArea) {
        sigArea.innerHTML = originalContent;
      }
      actionsEls.forEach(el => (el as HTMLElement).style.display = '');

      // Pass to parent for submission
      onSignAndSubmit(pdfBlob);
    } catch (err) {
      console.error('PDF generation failed:', err);
      setIsGenerating(false);
    }
  };

  return (
    <div className="doc-wrapper">
      <div className="doc-page" ref={documentRef}>
        {/* Document Header */}
        <div className="doc-header">
          <h1 className="doc-main-title">{lang === 'en' ? 'Expert Evaluation Report' : 'Ulat ng Pagsusuri ng Eksperto'}</h1>
          <h2 className="doc-thesis-title">
            Fine-tuning a Large Language Model with Quantized Low-Ranked Adaptation (QLoRA) for Philippine Historical Text Interpretation
          </h2>
          <div className="doc-meta-row">
            <span>{lang === 'en' ? 'Date' : 'Petsa'}: {currentDate}</span>
            <span>{lang === 'en' ? 'Passages Evaluated' : 'Mga Talatang Sinuri'}: {total}</span>
          </div>
        </div>

        <div className="doc-divider" />

        {/* Evaluator Information */}
        <section className="doc-section">
          <h3 className="doc-section-title">
            {lang === 'en' ? 'I. Evaluator Information' : 'I. Impormasyon ng Tagapagsuri'}
          </h3>
          <div className="doc-info-grid">
            <div className="doc-info-item">
              <span className="doc-info-label">{lang === 'en' ? 'Name' : 'Pangalan'}</span>
              <span className="doc-info-value">{evaluator.name}</span>
            </div>
            <div className="doc-info-item">
              <span className="doc-info-label">{lang === 'en' ? 'Affiliation' : 'Kaanib na Institusyon'}</span>
              <span className="doc-info-value">{evaluator.affiliation}</span>
            </div>
          </div>
        </section>

        <div className="doc-divider" />

        {/* Summary Metrics */}
        <section className="doc-section">
          <h3 className="doc-section-title">
            {lang === 'en' ? 'II. Summary Metrics' : 'II. Buod ng Sukatan'}
          </h3>
          <div className="doc-metrics-table">
            <table>
              <thead>
                <tr>
                  <th>{lang === 'en' ? 'Metric' : 'Sukatan'}</th>
                  <th>{lang === 'en' ? 'Value' : 'Halaga'}</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td>{t.metricMeanScore}</td>
                  <td><strong>{overallMean.toFixed(2)}</strong> / 5.00</td>
                </tr>
                {criteriaAverages.map(({ label, avg }) => (
                  <tr key={label}>
                    <td>{label} (Avg)</td>
                    <td>{avg.toFixed(2)} / 5.00</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>

        <div className="doc-divider" />

        {/* Per-Passage Results */}
        <section className="doc-section">
          <h3 className="doc-section-title">
            {lang === 'en' ? 'III. Per-Passage Evaluation Results' : 'III. Resulta sa Bawat Talata'}
          </h3>
          <div className="doc-results-table">
            <table>
              <thead>
                <tr>
                  <th>#</th>
                  <th>{lang === 'en' ? 'Passage No.' : 'No. ng Talata'}</th>
                  <th>{lang === 'en' ? 'Period' : 'Panahon'}</th>
                  <th>LA</th>
                  <th>CA</th>
                  <th>CO</th>
                  <th>CM</th>
                  <th>Avg</th>
                  <th>{lang === 'en' ? 'Rating' : 'Pasiya'}</th>
                </tr>
              </thead>
              <tbody>
                {evaluations.map((ev, i) => {
                  const ratingLabel = getLikertLabel(Math.round(ev.averageScore), lang);
                  return (
                    <tr key={i} className={ev.averageScore < 3 ? 'row-flagged' : ''}>
                      <td>{i + 1}</td>
                      <td>{ev.sentence.row_number - 1}</td>
                      <td className="td-period">{getPeriodLabel(ev.sentence.Period, lang)}</td>
                      <td>{ev.scores.linguisticAccuracy}</td>
                      <td>{ev.scores.culturalAuthenticity}</td>
                      <td>{ev.scores.comprehensibility}</td>
                      <td>{ev.scores.completeness}</td>
                      <td><strong>{ev.averageScore.toFixed(2)}</strong></td>
                      <td className={`td-rating ${ev.averageScore >= 4 ? 'good' : ev.averageScore >= 3 ? 'ok' : 'poor'}`}>
                        {ratingLabel}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
          <p className="doc-table-legend">
            <strong>{lang === 'en' ? 'Legend' : 'Katangian'}:</strong> LA = {t.criteriaLinguisticLabel}, CA = {t.criteriaCulturalLabel}, CO = {t.criteriaComprehensibilityLabel}, CM = {t.criteriaCompletenessLabel}
          </p>
        </section>

        {/* Error Analysis */}
        {errorEvals.length > 0 && (
          <>
            <div className="doc-divider" />
            <section className="doc-section">
              <h3 className="doc-section-title">
                {lang === 'en' ? 'IV. Error Analysis' : 'IV. Pagsusuri ng Pagkakamali'}
              </h3>
              <p className="doc-text">
                {lang === 'en'
                  ? `${errorEvals.length} of ${total} passages were flagged with errors (average score ≤ 3.0).`
                  : `${errorEvals.length} sa ${total} na talata ang nakitaan ng pagkakamali (average na marka ≤ 3.0).`}
              </p>
              <div className="doc-error-table">
                <table>
                  <thead>
                    <tr>
                      <th>#</th>
                      <th>{lang === 'en' ? 'Passage No.' : 'No. ng Talata'}</th>
                      <th>{lang === 'en' ? 'Linguistic' : 'Lingguwistika'}</th>
                      <th>{lang === 'en' ? 'Cultural' : 'Kultural'}</th>
                      <th>{lang === 'en' ? 'Comprehensibility' : 'Pag-unawa'}</th>
                      <th>{lang === 'en' ? 'Temporal' : 'Panahon'}</th>
                      <th>{lang === 'en' ? 'Notes' : 'Mga Tala'}</th>
                    </tr>
                  </thead>
                  <tbody>
                    {errorEvals.map(({ ev, index }, i) => (
                      <tr key={i}>
                        <td>{index}</td>
                        <td>{ev.sentence.row_number - 1}</td>
                        <td>{ev.errorAnalysis?.linguisticError ? '✓' : '—'}</td>
                        <td>{ev.errorAnalysis?.culturalMisrepresentation ? '✓' : '—'}</td>
                        <td>{ev.errorAnalysis?.comprehensibilityIssue ? '✓' : '—'}</td>
                        <td>{ev.errorAnalysis?.temporalMisalignment ? '✓' : '—'}</td>
                        <td className="td-notes">{ev.errorAnalysis?.notes || '—'}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </section>
          </>
        )}

        <div className="doc-divider" />

        {/* Certification & Signature */}
        <section className="doc-section doc-signature-section">
          <h3 className="doc-section-title">
            {errorEvals.length > 0
              ? (lang === 'en' ? 'V. Expert Certification' : 'V. Pagpapatunay ng Eksperto')
              : (lang === 'en' ? 'IV. Expert Certification' : 'IV. Pagpapatunay ng Eksperto')}
          </h3>
          <p className="doc-certification-text">
            {lang === 'en' ? (
              <>
                I, <strong>{evaluator.name}</strong>, hereby certify that I have independently reviewed and evaluated
                the {total} historical text interpretations presented in this form. The scores and analysis
                provided herein reflect my professional assessment based on my expertise in linguistics,
                Philippine history, and/or related fields.
              </>
            ) : (
              <>
                Ako, si <strong>{evaluator.name}</strong>, ay nagpapatunay na aking independiyenteng sinuri at tinasa
                ang {total} na interpretasyon ng makasaysayang teksto na ipinakita sa pormang ito. Ang mga marka
                at pagsusuring nakapaloob dito ay nagpapahayag ng aking propesyonal na pagtatasa batay sa aking kadalubhasaan
                sa lingguwistika, kasaysayan ng Pilipinas, at/o iba pang kaugnay na larangan.
              </>
            )}
          </p>

          <div className="doc-signature-block">
            <div className="doc-signature-area">
              <SignaturePad ref={signatureRef} />
            </div>
            <div className="doc-signature-label">
              <div className="doc-sig-line" />
              <p className="doc-sig-name">{evaluator.name}</p>
              <p className="doc-sig-affiliation">{evaluator.affiliation}</p>
              <p className="doc-sig-date">{currentDate}</p>
            </div>
          </div>

          <div className="doc-actions-inner">
            <button
              className="btn-confirm-signature"
              onClick={handleConfirmAndSubmit}
              disabled={isGenerating}
            >
              {isGenerating 
                ? (lang === 'en' ? 'Generating PDF…' : 'Bino-buo ang PDF…') 
                : (lang === 'en' ? 'Confirm Signature & Submit' : 'Kumpirmahin ang Lagda at Isumite')}
            </button>
          </div>
        </section>
      </div>

      {/* Actions outside document */}
      <div className="doc-actions no-print">
        <button className="btn-restart" onClick={onRestart}>
          {lang === 'en' ? 'Start New Evaluation' : 'Magsimula ng Bagong Pagsusuri'}
        </button>
      </div>
    </div>
  );
}
