// ─── Types ────────────────────────────────────────────────────────────────────

export type Allergy = {
  substance: string;
  reaction: string;
  severity: "Mild" | "Moderate" | "Severe";
};

export type MedicationItem = {
  drug: string;
  dosage: string;
  frequency: string;
  duration: string;
};

export type AIDiagnosis = {
  disease: string;
  confidence: number;
  rationale: string;
};

export type SuggestedLab = {
  testName: string;
  category: string;
  selected: boolean;
};

export type Vitals = {
  bp: string;
  systolic: number;
  diastolic: number;
  hr: number;
  temp: string;
  spo2: number;
  respRate: number;
  glucose: number;
  weight: number;
  height: number;
  bmi: number;
  triageBadge: {
    text: string;
    isHighRisk: boolean;
    color: "red" | "green" | "amber";
  };
};

export type PatientHistoryRecord = {
  mrn: string;
  patientName: string;
  dob: string;
  age: number;
  gender: string;
  chiefComplaint: string;
  hpi: string;
  pastMedicalHistory: string[];
  surgicalHistory: string[];
  allergies: Allergy[];
  medications: Array<{ name: string; dose: string; frequency: string }>;
  familyHistory: string[];
  socialHistory: {
    smoking: string;
    alcohol: string;
    occupation: string;
  };
  reviewOfSystems: Array<{ system: string; findings: string }>;
  vitalsAtIntake: Vitals;
  aiDiagnosis: AIDiagnosis[];
  suggestedLabs: SuggestedLab[];
  prescriptions: MedicationItem[];
  assignedClinician: string;
  intakeDate: string;
  riskLevel: "Low" | "Moderate" | "High";
  status: "Draft" | "Pending Review" | "Verified";
};

export type CareTeamMember = {
  id: string;
  name: string;
  role:
    | "Attending Physician"
    | "Resident"
    | "Nurse Practitioner"
    | "Intake Coordinator"
    | "Clinical Specialist";
  department: string;
  npi: string;
  activeIntakes: number;
  avatarInitials: string;
  photoUrl: string;
  status: "Available" | "In Consultation" | "Off Duty";
};

// ─── Helper Functions ─────────────────────────────────────────────────────────

export function calculateBMI(weightKg: number, heightCm: number): number {
  if (!weightKg || !heightCm || heightCm <= 0) return 0;
  const heightM = heightCm / 100;
  return Number((weightKg / (heightM * heightM)).toFixed(1));
}

export function evaluateVitalsTriage(
  systolic: number,
  diastolic: number,
  hr: number,
  spo2: number
): { text: string; isHighRisk: boolean; color: "red" | "green" | "amber" } {
  if (systolic > 140 || diastolic > 90) {
    return {
      text: "🔴 High BP Risk / Review Required",
      isHighRisk: true,
      color: "red",
    };
  }
  if (spo2 < 94 || hr > 110 || hr < 50) {
    return {
      text: "⚠️ Abnormal Vitals — Attending Alert",
      isHighRisk: true,
      color: "amber",
    };
  }
  return {
    text: "🟢 Normal Vitals",
    isHighRisk: false,
    color: "green",
  };
}

export function generateAIDiagnosis(
  chiefComplaint: string,
  vitals: Pick<Vitals, "systolic" | "diastolic" | "spo2">
): AIDiagnosis[] {
  const q = (chiefComplaint || "").toLowerCase();

  if (
    q.includes("chest") ||
    q.includes("breath") ||
    q.includes("dyspnea") ||
    vitals.systolic > 140
  ) {
    return [
      {
        disease: "Acute Coronary Syndrome / Stable Angina",
        confidence: 84,
        rationale:
          "Correlated with exertional chest tightness, elevated BP, and dyspnea on exertion.",
      },
      {
        disease: "Essential Hypertension Exacerbation",
        confidence: 76,
        rationale:
          "Systolic > 140 mmHg with peripheral resistance markers and fatigue.",
      },
      {
        disease: "Musculoskeletal Chest Wall Pain",
        confidence: 38,
        rationale:
          "Positional tenderness pattern without acute ischemic ECG changes.",
      },
    ];
  }

  if (
    q.includes("knee") ||
    q.includes("joint") ||
    q.includes("swelling") ||
    q.includes("pain")
  ) {
    return [
      {
        disease: "Acute Meniscal Tear / Joint Effusion",
        confidence: 88,
        rationale:
          "Sudden pivot mechanism, weight-bearing restriction, effusion on examination.",
      },
      {
        disease: "Ligamentous Sprain (ACL / MCL)",
        confidence: 65,
        rationale:
          "Joint instability during lateral movement, positive anterior draw test.",
      },
      {
        disease: "Post-Traumatic Osteoarthritis Flare",
        confidence: 42,
        rationale: "Prior meniscectomy history increases OA risk.",
      },
    ];
  }

  if (
    q.includes("headache") ||
    q.includes("migraine") ||
    q.includes("aura")
  ) {
    return [
      {
        disease: "Migraine with Visual Aura",
        confidence: 91,
        rationale:
          "Unilateral throbbing headache preceded by scintillating scotoma, photophobia.",
      },
      {
        disease: "Tension-Type Headache",
        confidence: 45,
        rationale: "Bilateral occipital pressure under work-related stress periods.",
      },
      {
        disease: "Secondary Hypertensive Headache",
        confidence: 32,
        rationale: "Transient BP elevations noted during peak pain episodes.",
      },
    ];
  }

  return [
    {
      disease: "Acute Upper Respiratory Infection",
      confidence: 75,
      rationale: "Mild systemic fatigue with stable SpO2 and normal cardiac markers.",
    },
    {
      disease: "Generalized Viral Syndrome",
      confidence: 58,
      rationale: "Low-grade symptoms with normal physiological vital metrics.",
    },
    {
      disease: "Stress / Anxiety Reaction",
      confidence: 35,
      rationale:
        "Normal hemodynamics; consider PHQ-9 screening at follow-up.",
    },
  ];
}

export function generateSuggestedLabs(
  chiefComplaint: string,
  vitals: Pick<Vitals, "systolic">
): SuggestedLab[] {
  const q = (chiefComplaint || "").toLowerCase();

  const base: SuggestedLab[] = [
    {
      testName: "Complete Blood Count (CBC) with Differential",
      category: "Hematology",
      selected: true,
    },
    {
      testName: "Comprehensive Metabolic Panel (CMP)",
      category: "Chemistry",
      selected: true,
    },
    {
      testName: "Lipid Panel (Total, HDL, LDL, Triglycerides)",
      category: "Chemistry",
      selected: true,
    },
    {
      testName: "Hemoglobin A1c (HbA1c)",
      category: "Endocrine",
      selected: false,
    },
    {
      testName: "12-Lead Electrocardiogram (ECG)",
      category: "Diagnostics",
      selected: false,
    },
  ];

  if (
    q.includes("chest") ||
    q.includes("breath") ||
    vitals.systolic > 140
  ) {
    base.push(
      {
        testName: "High-Sensitivity Troponin I / T",
        category: "Cardiac Biomarker",
        selected: true,
      },
      {
        testName: "Chest X-Ray (PA & Lateral)",
        category: "Radiology",
        selected: true,
      },
      {
        testName: "B-type Natriuretic Peptide (BNP)",
        category: "Cardiac Biomarker",
        selected: false,
      }
    );
    const ecg = base.find((l) => l.testName.includes("ECG"));
    if (ecg) ecg.selected = true;
  }

  if (
    q.includes("knee") ||
    q.includes("joint") ||
    q.includes("pain")
  ) {
    base.push(
      {
        testName: "Right Knee MRI (Non-Contrast)",
        category: "Radiology",
        selected: true,
      },
      {
        testName: "Knee X-Ray (AP & Lateral Weight-Bearing)",
        category: "Radiology",
        selected: true,
      },
      {
        testName: "C-Reactive Protein (CRP) & ESR",
        category: "Inflammatory Markers",
        selected: false,
      }
    );
  }

  return base;
}

export function generateSuggestedPrescriptions(
  chiefComplaint: string,
  vitals: Pick<Vitals, "systolic">
): MedicationItem[] {
  const q = (chiefComplaint || "").toLowerCase();

  if (
    q.includes("chest") ||
    q.includes("breath") ||
    vitals.systolic > 140
  ) {
    return [
      {
        drug: "Amlodipine Besylate",
        dosage: "5mg",
        frequency: "Once Daily",
        duration: "30 Days",
      },
      {
        drug: "Atorvastatin Calcium",
        dosage: "20mg",
        frequency: "Nightly",
        duration: "90 Days",
      },
      {
        drug: "Sublingual Nitroglycerin",
        dosage: "0.4mg",
        frequency: "PRN Chest Tightness",
        duration: "30 Days",
      },
    ];
  }

  if (
    q.includes("knee") ||
    q.includes("joint") ||
    q.includes("pain")
  ) {
    return [
      {
        drug: "Naproxen Sodium",
        dosage: "500mg",
        frequency: "Twice Daily with food",
        duration: "10 Days",
      },
      {
        drug: "Cyclobenzaprine",
        dosage: "5mg",
        frequency: "Nightly at bedtime",
        duration: "7 Days",
      },
      {
        drug: "Topical Diclofenac Gel 1%",
        dosage: "4g",
        frequency: "Apply QID to affected joint",
        duration: "14 Days",
      },
    ];
  }

  return [
    {
      drug: "Acetaminophen",
      dosage: "500mg",
      frequency: "Every 6 hours PRN pain",
      duration: "7 Days",
    },
    {
      drug: "Multivitamin Supplement",
      dosage: "1 Tablet",
      frequency: "Once Daily",
      duration: "30 Days",
    },
  ];
}

// ─── Static Data ──────────────────────────────────────────────────────────────

export const careTeamMembers: CareTeamMember[] = [
  {
    id: "maya-nair",
    name: "Dr. Maya Nair, MD",
    role: "Attending Physician",
    department: "Cardiology & Vascular",
    npi: "1982736401",
    activeIntakes: 8,
    avatarInitials: "MN",
    photoUrl: "/clinix-os/care-team/maya-nair.png",
    status: "Available",
  },
  {
    id: "arjun-mehta",
    name: "Dr. Arjun Mehta, MD",
    role: "Attending Physician",
    department: "Internal Medicine",
    npi: "1827364950",
    activeIntakes: 12,
    avatarInitials: "AM",
    photoUrl: "/clinix-os/care-team/arjun-mehta.png",
    status: "In Consultation",
  },
  {
    id: "sarah-jenkins",
    name: "Sarah Jenkins, NP",
    role: "Nurse Practitioner",
    department: "Clinical Intake & Triage",
    npi: "1736482910",
    activeIntakes: 15,
    avatarInitials: "SJ",
    photoUrl: "/clinix-os/care-team/sarah-jenkins.png",
    status: "Available",
  },
  {
    id: "samuel-okoye",
    name: "Dr. Samuel Okoye, MD",
    role: "Clinical Specialist",
    department: "Orthopedics & Joint Care",
    npi: "1625347890",
    activeIntakes: 6,
    avatarInitials: "SO",
    photoUrl: "/clinix-os/care-team/samuel-okoye.png",
    status: "Available",
  },
  {
    id: "priya-sen",
    name: "Dr. Priya Sen, MD",
    role: "Attending Physician",
    department: "Neurology",
    npi: "1543267891",
    activeIntakes: 9,
    avatarInitials: "PS",
    photoUrl: "/clinix-os/care-team/priya-sen.png",
    status: "Off Duty",
  },
];

export const samplePatientHistories: PatientHistoryRecord[] = [
  {
    mrn: "MRN-84920",
    patientName: "Eleanor Vance",
    dob: "1968-04-12",
    age: 58,
    gender: "Female",
    chiefComplaint:
      "Exertional dyspnea and episodic substernal chest tightness over 3 weeks.",
    hpi: "58-year-old female presents with 3-week history of shortness of breath climbing stairs and tightness rating 4/10. Relieved by rest within 5 minutes. Denies syncope or lower extremity edema.",
    pastMedicalHistory: [
      "Essential Hypertension",
      "Hyperlipidemia",
      "Type 2 Diabetes Mellitus",
    ],
    surgicalHistory: ["Laparoscopic Cholecystectomy (2018)"],
    allergies: [
      {
        substance: "Penicillin",
        reaction: "Urticaria & facial swelling",
        severity: "Severe",
      },
      { substance: "Codeine", reaction: "Nausea", severity: "Mild" },
    ],
    medications: [
      { name: "Lisinopril", dose: "20mg", frequency: "Daily" },
      { name: "Metformin", dose: "500mg", frequency: "BID with meals" },
      { name: "Atorvastatin", dose: "40mg", frequency: "Nightly" },
    ],
    familyHistory: [
      "Father: CAD, CABG at age 62",
      "Mother: T2D, Stroke at age 74",
    ],
    socialHistory: {
      smoking: "Former smoker (10 pack-years, quit 2012)",
      alcohol: "Social, 1-2 glasses wine/week",
      occupation: "High school administrator",
    },
    reviewOfSystems: [
      {
        system: "Cardiovascular",
        findings: "Substernal chest tightness on exertion",
      },
      {
        system: "Respiratory",
        findings: "Dyspnea on 1 flight of stairs",
      },
      {
        system: "Neurological",
        findings: "No focal weakness or dizziness",
      },
    ],
    vitalsAtIntake: {
      bp: "148/94",
      systolic: 148,
      diastolic: 94,
      hr: 82,
      temp: "98.6°F",
      spo2: 96,
      respRate: 18,
      glucose: 142,
      weight: 72,
      height: 165,
      bmi: 26.4,
      triageBadge: {
        text: "🔴 High BP Risk / Review Required",
        isHighRisk: true,
        color: "red",
      },
    },
    aiDiagnosis: [
      {
        disease: "Acute Coronary Syndrome / Stable Angina",
        confidence: 84,
        rationale:
          "Exertional substernal tightness with elevated systolic & diastolic blood pressure.",
      },
      {
        disease: "Essential Hypertension Exacerbation",
        confidence: 76,
        rationale:
          "Systolic 148 / Diastolic 94 mmHg exceeding safety baseline thresholds.",
      },
      {
        disease: "Musculoskeletal Chest Wall Pain",
        confidence: 38,
        rationale: "Positional tenderness without acute ischemic ECG changes.",
      },
    ],
    suggestedLabs: [
      {
        testName: "Complete Blood Count (CBC) with Differential",
        category: "Hematology",
        selected: true,
      },
      {
        testName: "Comprehensive Metabolic Panel (CMP)",
        category: "Chemistry",
        selected: true,
      },
      {
        testName: "High-Sensitivity Troponin I",
        category: "Cardiac Biomarker",
        selected: true,
      },
      {
        testName: "12-Lead Electrocardiogram (ECG)",
        category: "Diagnostics",
        selected: true,
      },
    ],
    prescriptions: [
      {
        drug: "Amlodipine Besylate",
        dosage: "5mg",
        frequency: "Once Daily",
        duration: "30 Days",
      },
      {
        drug: "Atorvastatin Calcium",
        dosage: "40mg",
        frequency: "Nightly",
        duration: "90 Days",
      },
      {
        drug: "Sublingual Nitroglycerin",
        dosage: "0.4mg",
        frequency: "PRN Chest Tightness",
        duration: "30 Days",
      },
    ],
    assignedClinician: "Dr. Maya Nair, MD",
    intakeDate: "2026-09-08",
    riskLevel: "High",
    status: "Verified",
  },
  {
    mrn: "MRN-63104",
    patientName: "Marcus Sterling",
    dob: "1982-11-29",
    age: 43,
    gender: "Male",
    chiefComplaint:
      "Persistent right knee pain following tennis match 5 days ago.",
    hpi: "43-year-old male with acute onset right knee swelling and joint instability after sudden pivot. Pain 6/10 on weight-bearing. Mild joint effusion noted.",
    pastMedicalHistory: ["Asthma", "Mild GERD"],
    surgicalHistory: ["Right Meniscectomy (2015)"],
    allergies: [
      {
        substance: "Sulfa Drugs",
        reaction: "Maculopapular rash",
        severity: "Moderate",
      },
    ],
    medications: [
      { name: "Albuterol Inhaler", dose: "90mcg", frequency: "PRN" },
      { name: "Omeprazole", dose: "20mg", frequency: "Daily" },
    ],
    familyHistory: ["Maternal grandfather: Osteoarthritis"],
    socialHistory: {
      smoking: "Never smoker",
      alcohol: "Occasional weekend beer",
      occupation: "Software Architect",
    },
    reviewOfSystems: [
      {
        system: "Musculoskeletal",
        findings: "Right knee tenderness, reduced ROM, joint effusion",
      },
      { system: "Respiratory", findings: "No wheezing or acute distress" },
    ],
    vitalsAtIntake: {
      bp: "122/78",
      systolic: 122,
      diastolic: 78,
      hr: 68,
      temp: "98.2°F",
      spo2: 99,
      respRate: 14,
      glucose: 98,
      weight: 81,
      height: 180,
      bmi: 25.0,
      triageBadge: {
        text: "🟢 Normal Vitals",
        isHighRisk: false,
        color: "green",
      },
    },
    aiDiagnosis: [
      {
        disease: "Acute Meniscal Tear / Joint Effusion",
        confidence: 88,
        rationale:
          "Sudden pivot mechanism with weight-bearing restriction and effusion.",
      },
      {
        disease: "Ligamentous Sprain (ACL/MCL)",
        confidence: 65,
        rationale: "Joint instability during lateral movement.",
      },
    ],
    suggestedLabs: [
      {
        testName: "Right Knee MRI (Non-Contrast)",
        category: "Radiology",
        selected: true,
      },
      {
        testName: "Knee X-Ray (AP & Lateral Weight-Bearing)",
        category: "Radiology",
        selected: true,
      },
    ],
    prescriptions: [
      {
        drug: "Naproxen Sodium",
        dosage: "500mg",
        frequency: "Twice Daily with food",
        duration: "10 Days",
      },
      {
        drug: "Topical Diclofenac Gel 1%",
        dosage: "4g",
        frequency: "Apply QID",
        duration: "14 Days",
      },
    ],
    assignedClinician: "Dr. Samuel Okoye, MD",
    intakeDate: "2026-09-07",
    riskLevel: "Low",
    status: "Verified",
  },
];

export const commonSystemOptions = [
  "Cardiovascular",
  "Respiratory",
  "Gastrointestinal",
  "Neurological",
  "Musculoskeletal",
  "Dermatological",
  "Endocrine",
  "Genitourinary",
  "Psychiatric",
];

// ─── Legacy exports (used by home, doctors, records, dashboard, appointments) ─

export type Doctor = {
  id: string;
  name: string;
  specialty: string;
  experience: string;
  rating: number;
  patients: string;
  availability: string;
  bio: string;
};

export type Service = {
  id: string;
  title: string;
  description: string;
  icon: "heart" | "stethoscope" | "lab" | "brain" | "bone" | "baby";
};

export type Vital = {
  label: string;
  value: string;
  unit: string;
  trend: string;
  status: "good" | "watch" | "alert";
};

export type HealthRecord = {
  id: string;
  date: string;
  type: string;
  title: string;
  summary: string;
  doctor: string;
  clinician: string;
};

export type Medication = {
  id: string;
  name: string;
  dose: string;
  frequency: string;
  schedule: string;
  next: string;
  refillDate: string;
  status: "Active" | "Pending" | "Discontinued";
};

export const doctors: Doctor[] = [
  {
    id: "maya-nair",
    name: "Dr. Maya Nair",
    specialty: "Cardiology",
    experience: "18 years",
    rating: 4.9,
    patients: "3,200+",
    availability: "Mon · Wed · Fri",
    bio: "Dr. Nair specialises in interventional cardiology and preventive heart health, with expertise in vascular risk assessment and lipid management.",
  },
  {
    id: "arjun-mehta",
    name: "Dr. Arjun Mehta",
    specialty: "Internal Medicine",
    experience: "14 years",
    rating: 4.8,
    patients: "5,100+",
    availability: "Tue · Thu · Sat",
    bio: "Dr. Mehta focuses on complex multi-system disease management, chronic illness optimisation, and evidence-based primary care.",
  },
  {
    id: "samuel-okoye",
    name: "Dr. Samuel Okoye",
    specialty: "Orthopaedics",
    experience: "12 years",
    rating: 4.7,
    patients: "2,800+",
    availability: "Mon · Thu · Fri",
    bio: "Dr. Okoye specialises in sports injury rehabilitation, joint replacement surgery, and minimally invasive orthopaedic procedures.",
  },
  {
    id: "priya-sen",
    name: "Dr. Priya Sen",
    specialty: "Neurology",
    experience: "10 years",
    rating: 4.8,
    patients: "2,100+",
    availability: "Tue · Wed · Sat",
    bio: "Dr. Sen focuses on headache medicine, epilepsy management, and neuro-degenerative disease, with special interest in migraine pathophysiology.",
  },
];

export const services: Service[] = [
  {
    id: "s1",
    title: "Cardiology & Heart Care",
    description:
      "Advanced diagnostics, echocardiography, stress testing, and preventive cardiovascular risk management.",
    icon: "heart",
  },
  {
    id: "s2",
    title: "Clinical Intake & Triage",
    description:
      "AI-assisted patient intake, real-time vital monitoring, and intelligent risk stratification.",
    icon: "stethoscope",
  },
  {
    id: "s3",
    title: "Laboratory & Diagnostics",
    description:
      "Rapid in-house labs covering haematology, metabolic panels, biomarkers, and point-of-care testing.",
    icon: "lab",
  },
  {
    id: "s4",
    title: "Neurology & Brain Health",
    description:
      "EEG, cognitive assessments, migraine management, and neuro-degenerative disease monitoring.",
    icon: "brain",
  },
  {
    id: "s5",
    title: "Orthopaedics & Joint Care",
    description:
      "Sports injury evaluation, arthroscopy planning, joint replacement consultation, and physiotherapy coordination.",
    icon: "bone",
  },
  {
    id: "s6",
    title: "Women's & Family Health",
    description:
      "Preventive screenings, maternal health, paediatrics, and comprehensive family medicine services.",
    icon: "baby",
  },
];

export const records: HealthRecord[] = [
  {
    id: "r1",
    date: "2026-09-05",
    type: "Lab Results",
    title: "Complete Blood Count & Lipid Panel",
    summary:
      "CBC within normal reference ranges. LDL slightly elevated at 138 mg/dL. Follow-up statin optimisation recommended.",
    doctor: "Dr. Maya Nair",
    clinician: "Dr. Maya Nair, MD — Cardiology",
  },
  {
    id: "r2",
    date: "2026-08-22",
    type: "Visit Note",
    title: "Cardiology Follow-Up — Hypertension Review",
    summary:
      "BP controlled at 128/82 mmHg. Medication titration complete. Continue Amlodipine 5 mg daily. Lifestyle counselling given.",
    doctor: "Dr. Maya Nair",
    clinician: "Dr. Maya Nair, MD — Cardiology",
  },
  {
    id: "r3",
    date: "2026-07-14",
    type: "Radiology",
    title: "Chest X-Ray (PA & Lateral)",
    summary:
      "No acute cardiopulmonary process identified. Heart size within normal limits. Lungs clear bilaterally.",
    doctor: "Dr. Arjun Mehta",
    clinician: "Dr. Arjun Mehta, MD — Internal Medicine",
  },
  {
    id: "r4",
    date: "2026-06-30",
    type: "Visit Note",
    title: "Annual Physical Examination",
    summary:
      "General health satisfactory. BMI 26.1. HbA1c 5.8% (pre-diabetic range). Diet and exercise plan initiated.",
    doctor: "Dr. Arjun Mehta",
    clinician: "Dr. Arjun Mehta, MD — Internal Medicine",
  },
];

export const vitals: Vital[] = [
  {
    label: "Blood Pressure",
    value: "128 / 82",
    unit: "mmHg",
    trend: "↓ 4 mmHg from last visit",
    status: "good",
  },
  {
    label: "Heart Rate",
    value: "72",
    unit: "bpm",
    trend: "Stable",
    status: "good",
  },
  {
    label: "Oxygen Saturation",
    value: "98",
    unit: "%",
    trend: "Stable",
    status: "good",
  },
  {
    label: "Blood Glucose",
    value: "102",
    unit: "mg/dL",
    trend: "↑ 8 from baseline",
    status: "watch",
  },
  {
    label: "BMI",
    value: "26.1",
    unit: "kg/m²",
    trend: "Stable",
    status: "watch",
  },
];

export const medications: Medication[] = [
  {
    id: "m1",
    name: "Amlodipine Besylate",
    dose: "5 mg",
    frequency: "Once Daily",
    schedule: "5 mg · Once Daily (morning)",
    next: "Refill Oct 1",
    refillDate: "2026-10-01",
    status: "Active",
  },
  {
    id: "m2",
    name: "Atorvastatin Calcium",
    dose: "40 mg",
    frequency: "Nightly",
    schedule: "40 mg · Nightly at bedtime",
    next: "Refill Sep 20",
    refillDate: "2026-09-20",
    status: "Active",
  },
  {
    id: "m3",
    name: "Metformin HCl",
    dose: "500 mg",
    frequency: "Twice Daily with meals",
    schedule: "500 mg · BID with breakfast & dinner",
    next: "Pending authorization",
    refillDate: "2026-10-15",
    status: "Pending",
  },
];

export const timeSlots: string[] = [
  "08:00 AM",
  "08:30 AM",
  "09:00 AM",
  "09:30 AM",
  "10:00 AM",
  "10:30 AM",
  "11:00 AM",
  "11:30 AM",
  "01:00 PM",
  "01:30 PM",
  "02:00 PM",
  "02:30 PM",
  "03:00 PM",
  "03:30 PM",
  "04:00 PM",
  "04:30 PM",
];

