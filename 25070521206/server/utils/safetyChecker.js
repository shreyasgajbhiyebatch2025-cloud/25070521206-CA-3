const ALLERGY_MAP = {
  penicillin: ['amoxicillin', 'ampicillin', 'piperacillin', 'augmentin', 'penicillin', 'amox-clav', 'cloxacillin'],
  nsaid: ['ibuprofen', 'diclofenac', 'aspirin', 'naproxen', 'ketorolac', 'mefenamic', 'celecoxib'],
  sulfa: ['cotrimoxazole', 'sulfamethoxazole', 'bactrim', 'sulfasalazine', 'trimethoprim-sulfamethoxazole'],
  opioid: ['morphine', 'tramadol', 'fentanyl', 'codeine', 'oxycodone'],
  fluoroquinolone: ['ciprofloxacin', 'levofloxacin', 'moxifloxacin', 'norfloxacin'],
  cephalosporin: ['ceftriaxone', 'cefuroxime', 'cephalexin', 'cefepime', 'cefotaxime']
};

const HIGH_ALERT_MEDS = [
  'insulin', 'heparin', 'potassium chloride', 'morphine', 'fentanyl', 'warfarin', 'enoxaparin', 'digoxin'
];

function checkSafetyWarnings({ patient, medicineName, dose, currentActivePrescriptions = [] }) {
  const warnings = [];
  const normalizedMed = (medicineName || '').toLowerCase().trim();

  // 1. Allergy Check
  if (patient && patient.allergies && Array.isArray(patient.allergies)) {
    for (const allergy of patient.allergies) {
      const normAllergy = (allergy || '').toLowerCase().trim();

      // Direct match
      if (normalizedMed.includes(normAllergy) || normAllergy.includes(normalizedMed)) {
        warnings.push({
          type: 'ALLERGY_WARNING',
          severity: 'HIGH',
          title: `Potential Allergy Warning: ${allergy}`,
          message: `The patient has a documented ${allergy} allergy. Please review before proceeding.`,
          actionRequired: 'Clinical review recommended'
        });
        continue;
      }

      // Cross-class match
      for (const [classKey, medList] of Object.entries(ALLERGY_MAP)) {
        if (normAllergy.includes(classKey)) {
          const hasCrossMatch = medList.some(m => normalizedMed.includes(m));
          if (hasCrossMatch) {
            warnings.push({
              type: 'CROSS_ALLERGY_WARNING',
              severity: 'HIGH',
              title: `Cross-Reactivity Allergy Alert (${allergy})`,
              message: `Patient has documented allergy to "${allergy}". "${medicineName}" belongs to or cross-reacts with this class.`,
              actionRequired: 'Clinical review recommended'
            });
          }
        }
      }
    }
  }

  // 2. Duplicate Therapy Warning
  if (currentActivePrescriptions && currentActivePrescriptions.length > 0) {
    const duplicate = currentActivePrescriptions.find(p =>
      p.status === 'ACTIVE' &&
      (p.medicine || '').toLowerCase().trim() === normalizedMed
    );
    if (duplicate) {
      warnings.push({
        type: 'DUPLICATE_THERAPY',
        severity: 'MEDIUM',
        title: 'Duplicate Active Prescription',
        message: `An active prescription for "${duplicate.medicine}" (${duplicate.dose}, ${duplicate.frequency}) already exists for this patient.`,
        actionRequired: 'Verify intention'
      });
    }
  }

  // 3. High-Alert Medication Protocol
  const isHighAlert = HIGH_ALERT_MEDS.some(m => normalizedMed.includes(m));
  if (isHighAlert) {
    warnings.push({
      type: 'HIGH_ALERT_MEDICATION',
      severity: 'INFO',
      title: 'High-Alert Medication Protocol',
      message: `"${medicineName}" is designated as a High-Alert Medication. Independent nurse dual-check and dose verification recommended.`,
      actionRequired: 'Dual-check protocol recommended'
    });
  }

  // 4. Dose Advisory
  if (normalizedMed.includes('paracetamol') && parseInt(dose, 10) > 1000) {
    warnings.push({
      type: 'DOSE_ADVISORY',
      severity: 'MEDIUM',
      title: 'Dose Advisory',
      message: `Prescribed dose of ${dose} exceeds typical single adult dose threshold (1000 mg). Please verify dosage.`,
      actionRequired: 'Verify dosage'
    });
  }

  return warnings;
}

module.exports = {
  checkSafetyWarnings,
  ALLERGY_MAP,
  HIGH_ALERT_MEDS
};

