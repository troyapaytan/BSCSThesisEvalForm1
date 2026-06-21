export const translations = {
  en: {
    // App Header & Introduction
    appTitle: "Historical Filipino Text Interpretation Evaluation Form",
    appSubtitle: "This form serves as a requirement for the thesis:",
    thesisTitle: "Fine-tuning a Large Language Model with Quantized Low-Ranked Adaptation (QLoRA) for Philippine Historical Text Interpretation",
    thesisAuthors: "By: Troy Andrei A. Paytan & Daphne Angel T. Vizmanos",
    thesisInstitution: "Mapúa University, 2026",
    thesisNote: "The passages in this form are samples sourced from the annotated dataset to be used for training via QLoRA.",
    evaluatorInfoTitle: "Evaluator Information",
    fullNameLabel: "Full Name",
    fullNamePlaceholder: "e.g., Dr. Juan Dela Cruz",
    affiliationLabel: "Institutional Affiliation",
    affiliationPlaceholder: "e.g., Mapúa University",
    beginButton: "Begin Evaluation",

    // Loading & Errors
    loadingSentences: "Loading sentences...",
    loadErrorPrefix: "Failed to load sentences",

    // Evaluation Screen
    passageBadge: "Passage",
    rowBadge: "Row",
    progressLabel: "Progress",
    ofLabel: "of",
    originalTextLabel: "Original Text",
    modernTranslationLabel: "Modern Translation",
    archaicTermsLabel: "Archaic Terms & Explanations",
    noExplanations: "No glossary explanations provided.",
    linguisticPeriodLabel: "Linguistic Period",
    notesCritiqueLabel: "Optional Notes / Critique:",
    notesCritiquePlaceholder: "Provide additional qualitative feedback...",
    btnPrevious: "Previous",
    btnNext: "Next",
    btnCalculate: "Calculate Metrics",
    
    // Period Labels
    periodPreTagalog: "Pre-Tagalog",
    periodTagalog: "Tagalog (Pre-1959)",
    periodPilipino: "Pilipino (1959-1986)",
    periodFilipino: "Filipino (1987-Present)",

    // Likert Labels
    likert1: "Very Poor",
    likert2: "Poor",
    likert3: "Fair",
    likert4: "Good",
    likert5: "Excellent",

    // Likert Criteria
    criteriaLinguisticLabel: "Linguistic Accuracy",
    criteriaLinguisticDesc: "How accurately does the modernization translate the historical grammar and syntax?",
    criteriaCulturalLabel: "Cultural Authenticity",
    criteriaCulturalDesc: "Are cultural context, idioms, and historical nuances correctly preserved?",
    criteriaComprehensibilityLabel: "Comprehensibility",
    criteriaComprehensibilityDesc: "Is the modernized text clear, fluent, and natural for a modern reader?",
    criteriaCompletenessLabel: "Completeness",
    criteriaCompletenessDesc: "Does it preserve all semantic details, missing nothing from the original?",

    // Error Analysis Modal
    errorModalTitle: "Error Analysis Required",
    errorModalSubtitle: "Because the average rating for this passage is low (≤ 3.0), please identify the source(s) of error:",
    errorLinguisticLabel: "Linguistic Accuracy Issue",
    errorLinguisticDesc: "Grammar, translation errors, or syntax issues.",
    errorCulturalLabel: "Cultural Misrepresentation",
    errorCulturalDesc: "Loss of context, idiom failure, or historical inaccuracy.",
    errorComprehensibilityLabel: "Comprehensibility Issue",
    errorComprehensibilityDesc: "Awkward phrasing, poor readability, or unnatural flow.",
    errorTemporalLabel: "Temporal Misalignment",
    errorTemporalDesc: "Used words inappropriate for the linguistic period.",
    errorNotesLabel: "Detailed Error Notes (Required):",
    errorNotesPlaceholder: "Describe the specific translation or linguistic errors...",
    errorSaveButton: "Save & Continue",

    // Metrics Summary Screen
    metricsTitle: "Evaluation Summary",
    metricsSubtitle: "passages evaluated",
    metricMeanScore: "Overall Mean Score",
    metricCulturalFidelity: "Cultural Fidelity Score",
    metricAcceptanceRate: "Expert Acceptance Rate",
    dimensionPerformanceTitle: "Dimension Performance",
    btnExportJSON: "Export JSON",
    btnExportCSV: "Export CSV",
    btnProceedReport: "Proceed to Report",
    btnBackReview: "Back to Review",

    // Final Report / Certificate Screen
    reportTitle: "Final Evaluation Report & Certification",
    reportCertifyHeading: "Certification of Linguistic Evaluation",
    signatureTitle: "Expert E-Signature",
    signatureSubtitle: "Sign inside the box to certify your review",
    btnClearSignature: "Clear",
    btnSubmitReport: "Submit Final Report",
    submittingEvaluation: "Submitting your evaluation...",
    submittingSuccess: "Submission complete!",
    
    // Certification Texts
    certifyPrefix: "I hereby certify that I, ",
    certifyBody: ", have independently reviewed and evaluated the historical Filipino text interpretations presented in this evaluation form. My ratings, scores, and error analyses recorded herein represent my honest professional judgment as a qualified expert in the field.",
    certifySuffix: "Approved and certified on: ",

    // Thank You Screen
    thankYouTitle: "Thank You!",
    thankYouMessage: "Your linguistic evaluation has been successfully submitted.",
    thankYouSub: "Thank you for your valuable expert contribution to this thesis.",
    thankYouDownload: "Downloading PDF report...",

    // Tables in Report
    tableNum: "#",
    tablePassageNo: "Passage No.",
    tableRowNo: "Row No.",
    tablePeriod: "Period",
    tableLA: "LA",
    tableCA: "CA",
    tableCO: "CO",
    tableCM: "CM",
    tableAvg: "Avg",
    tableRating: "Rating",
    tableLegend: "Legend: LA = Linguistic Accuracy, CA = Cultural Authenticity, CO = Comprehensibility, CM = Completeness",
    tableLinguistic: "Linguistic",
    tableCultural: "Cultural",
    tableComprehensibility: "Comprehensibility",
    tableTemporal: "Temporal",
    tableNotes: "Notes",
    errorTableTitle: "IV. Error Analysis",
    errorTableText: "passages were flagged with errors (average score ≤ 3.0)."
  },
  tl: {
    // App Header & Introduction
    appTitle: "Pagsusuri sa Interpretasyon ng Makasaysayang Tekstong Filipino",
    appSubtitle: "Ang form na ito ay nagsisilbing bahagi ng kinakailangan para sa thesis:",
    thesisTitle: "Fine-tuning a Large Language Model with Quantized Low-Ranked Adaptation (QLoRA) for Philippine Historical Text Interpretation",
    thesisAuthors: "Nina: Troy Andrei A. Paytan at Daphne Angel T. Vizmanos",
    thesisInstitution: "Mapúa University, 2026",
    thesisNote: "Ang mga talata sa form na ito ay hinango sa dataset na gagamitin sa pagtrain ng model.",
    evaluatorInfoTitle: "Detalye ng Tagasuri",
    fullNameLabel: "Buong Pangalan",
    fullNamePlaceholder: "hal., Dr. Juan Dela Cruz",
    affiliationLabel: "Institusyong Kinabibilangan",
    affiliationPlaceholder: "hal., Unibersidad ng Mapúa",
    beginButton: "Simulan ang Pagsusuri",

    // Loading & Errors
    loadingSentences: "Naglo-load ng mga pangungusap...",
    loadErrorPrefix: "Nagka-error sa pag-load ng mga pangungusap",

    // Evaluation Screen
    passageBadge: "Talata",
    rowBadge: "Linya",
    progressLabel: "Katayuan",
    ofLabel: "ng",
    originalTextLabel: "Orihinal na Teksto",
    modernTranslationLabel: "Makabagong Salin",
    archaicTermsLabel: "Mga Sinaunang Salita at Paliwanag",
    noExplanations: "Walang ibinigay na mga paliwanag sa glosaryo.",
    linguisticPeriodLabel: "Panahong Lingguwistiko",
    notesCritiqueLabel: "Opsyonal na Tala / Puna:",
    notesCritiquePlaceholder: "Magbigay ng karagdagang kwalitatibong feedback...",
    btnPrevious: "Nakaraan",
    btnNext: "Susunod",
    btnCalculate: "Kalkulahin ang mga Sukat",
    
    // Period Labels
    periodPreTagalog: "Pre-Tagalog",
    periodTagalog: "Tagalog (Bago ang 1959)",
    periodPilipino: "Pilipino (1959–1986)",
    periodFilipino: "Filipino (1987–Kasalukuyan)",

    // Likert Labels
    likert1: "Napakahina",
    likert2: "Mababa",
    likert3: "Katanggap-tanggap",
    likert4: "Mabuti",
    likert5: "Napakahusay",

    // Likert Criteria
    criteriaLinguisticLabel: "Wastong Lingguwistika",
    criteriaLinguisticDesc: "Tama ba ang bokabularyo at gramatika ng makabagong interpretasyon?",
    criteriaCulturalLabel: "Kultural na Awtentisidad",
    criteriaCulturalDesc: "Napangalagaan ba ang mga kultural na detalye at kontekstong pangkasaysayan?",
    criteriaComprehensibilityLabel: "Kakayahang Maunawaan",
    criteriaComprehensibilityDesc: "Malinaw at madaling maunawaan ba ang interpretasyon para sa isang modernong mambabasang Filipino?",
    criteriaCompletenessLabel: "Kabuuan",
    criteriaCompletenessDesc: "Sapat bang nasaklaw ang lahat ng mahahalagang aspeto at kahulugan ng orihinal na teksto?",

    // Error Analysis Modal
    errorModalTitle: "Kinakailangan ng Pagsusuri ng Pagkakamali",
    errorModalSubtitle: "Dahil mababa ang average na marka para sa talatang ito (≤ 3.0), paki-tukoy ang (mga) pinagmulan ng pagkakamali:",
    errorLinguisticLabel: "Maling Lingguwistika",
    errorLinguisticDesc: "Maling kahulugan ng bokabularyo o maling interpretasyon sa gramatika.",
    errorCulturalLabel: "Maling Kultural na Paglalarawan",
    errorCulturalDesc: "Hindi angkop na konteksto o mga kamalian sa pangkasaysayang kung ano ang ibig sabihin.",
    errorComprehensibilityLabel: "Suliranin sa Pag-unawa",
    errorComprehensibilityDesc: "Masyado pa ring kumplikado o hindi malinaw ang modernong teksto.",
    errorTemporalLabel: "Maling Ugnayang Panahon",
    errorTemporalDesc: "Maling interpretasyon na angkop lamang sa ibang panahon o paggamit ng makabagong salita.",
    errorNotesLabel: "Detalyadong Tala ng Pagkakamali (Kinakailangan):",
    errorNotesPlaceholder: "Ilarawan ang partikular na pagkakamali sa salin o wika...",
    errorSaveButton: "I-save at Ipagpatuloy",

    // Metrics Summary Screen
    metricsTitle: "Buod ng Pagsusuri",
    metricsSubtitle: "talata ang nasuri",
    metricMeanScore: "Pangkalahatang Average na Marka",
    metricCulturalFidelity: "Kultural na Fidelity Score",
    metricAcceptanceRate: "Antas ng Pagtanggap ng Eksperto",
    dimensionPerformanceTitle: "Pagganap sa Bawat Dimensyon",
    btnExportJSON: "I-export ang JSON",
    btnExportCSV: "I-export ang CSV",
    btnProceedReport: "Magpatuloy sa Ulat",
    btnBackReview: "Bumalik sa Pagsusuri",

    // Final Report / Certificate Screen
    reportTitle: "Huling Ulat ng Pagsusuri at Sertipikasyon",
    reportCertifyHeading: "Sertipikasyon ng Pagsusuring Lingguwistiko",
    signatureTitle: "E-Lagda ng Eksperto",
    signatureSubtitle: "Lumagda sa loob ng kahon upang patunayan ang iyong pagsusuri",
    btnClearSignature: "Burahin",
    btnSubmitReport: "Isumite ang Huling Ulat",
    submittingEvaluation: "Ipinapadala ang iyong pagsusuri...",
    submittingSuccess: "Kumpleto na ang pagpapadala!",
    
    // Certification Texts
    certifyPrefix: "Pinapatunayan ko sa pamamagitan nito na ako, si ",
    certifyBody: ", ay malayang sumuri at nag-evaluate sa mga interpretasyon ng makasaysayang tekstong Pilipino na ipinakita sa form ng pagsusuri na ito. Ang aking mga rating, marka, at pagsusuri ng pagkakamali na naitala dito ay kumakatawan sa aking matapat na propesyonal na paghatol bilang isang kwalipikadong eksperto sa larangan.",
    certifySuffix: "Inaprubahan at pinatunayan noong: ",

    // Thank You Screen
    thankYouTitle: "Maraming Salamat!",
    thankYouMessage: "Matagumpay na naipadala ang iyong pagsusuri sa wika.",
    thankYouSub: "Salamat sa iyong mahalagang kontribusyon bilang eksperto para sa thesis na ito.",
    thankYouDownload: "I-download ang ulat na PDF...",

    // Tables in Report
    tableNum: "#",
    tablePassageNo: "Talata Blg.",
    tableRowNo: "Linya Blg.",
    tablePeriod: "Panahon",
    tableLA: "LA",
    tableCA: "CA",
    tableCO: "CO",
    tableCM: "CM",
    tableAvg: "Avg",
    tableRating: "Marka",
    tableLegend: "Legend: LA = Katumpakang Lingguwistiko, CA = Kalinangan at Kultura, CO = Pagkaunawa at Linaw, CM = Kabuoan at Nilalaman",
    tableLinguistic: "Lingguwistika",
    tableCultural: "Kultura",
    tableComprehensibility: "Pagkaunawa",
    tableTemporal: "Panahon",
    tableNotes: "Mga Tala",
    errorTableTitle: "IV. Pagsusuri ng Pagkakamali",
    errorTableText: "talata ang nakitaan ng pagkakamali (average na marka ≤ 3.0)."
  }
};

export const getLikertLabel = (score: number, lang: 'en' | 'tl'): string => {
  const rounded = Math.round(score);
  const key = `likert${rounded}` as 'likert1' | 'likert2' | 'likert3' | 'likert4' | 'likert5';
  return translations[lang][key] || '—';
};

export const getPeriodLabel = (period: string, lang: 'en' | 'tl'): string => {
  switch (period) {
    case 'pre-tagalog': return translations[lang].periodPreTagalog;
    case 'tagalog': return translations[lang].periodTagalog;
    case 'pilipino': return translations[lang].periodPilipino;
    case 'filipino': return translations[lang].periodFilipino;
    default: return period;
  }
};
