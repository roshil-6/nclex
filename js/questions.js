/**
 * NursePrep Pro — NCLEX Question Bank
 * Contains 50+ high-fidelity questions across 3 formats and 8 clinical categories.
 */

const CATEGORIES = {
  MANAGEMENT: 'Management of Care',
  SAFETY: 'Safety & Infection Control',
  PSYCHOSOCIAL: 'Psychosocial Integrity',
  BASIC_CARE: 'Basic Care & Comfort',
  PHARMACOLOGY: 'Pharmacological Therapies',
  REDUCTION: 'Reduction of Risk Potential',
  PHYSIOLOGICAL: 'Physiological Adaptation',
  HEALTH_PROMO: 'Health Promotion',
};

const FORMATS = {
  SATA: 'SATA',
  PRIORITY: 'Prioritization',
  NGN: 'NGN Case Study',
  MCQ: 'Multiple Choice',
};

const DIFFICULTY = {
  EASY: 'Foundational',
  MEDIUM: 'Application',
  HARD: 'Analysis',
};

const QUESTION_BANK = [

  // =============================================
  // SECTION 1: PRIORITIZATION / DELEGATION
  // =============================================
  {
    id: 1,
    format: FORMATS.PRIORITY,
    category: CATEGORIES.MANAGEMENT,
    difficulty: DIFFICULTY.HARD,
    examType: ['RN', 'PN'],
    stem: `The charge nurse on a medical-surgical unit receives a shift report. Which client should the nurse assess FIRST?`,
    options: [
      { id: 'A', text: 'Client who underwent a cholecystectomy 18 hours ago and reports pain of 5/10 controlled with oral analgesics.' },
      { id: 'B', text: 'Client with COPD who has an SpO₂ of 88% and is receiving 2L/min of oxygen via nasal cannula.' },
      { id: 'C', text: 'Client admitted with deep vein thrombosis (DVT) awaiting anticoagulation therapy.' },
      { id: 'D', text: 'Client with type 2 diabetes whose morning blood glucose is 210 mg/dL.' },
    ],
    correctAnswers: ['B'],
    rationale: {
      concept: 'The ABCs (Airway, Breathing, Circulation) prioritization framework guides clinical decision-making. Oxygenation is a primary survival need. An SpO₂ of 88% indicates hypoxemia, which is an immediate threat to life requiring urgent nursing intervention.',
      right: 'Option B is correct. An SpO₂ of 88% represents significant hypoxemia (normal is ≥95%). In COPD clients, while a lower baseline may be expected, 88% still warrants immediate assessment. The nurse must verify oxygenation status, assess respiratory effort, and potentially adjust O₂ delivery — a life-threatening emergency takes absolute priority.',
      wrong: [
        { option: 'A', text: 'Pain rated 5/10 that is already controlled with oral analgesics is not immediately life-threatening. This client is stable and can be assessed after the urgent situation is resolved.' },
        { option: 'C', text: 'While DVT carries risk of pulmonary embolism, the client is "awaiting" therapy — not in acute distress. The DVT client is a priority but is not in immediate danger compared to active hypoxemia.' },
        { option: 'D', text: 'A blood glucose of 210 mg/dL in a known diabetic, while elevated, does not constitute an immediate emergency. Coverage with insulin can follow assessment of more urgent clients.' },
      ],
      objective: 'Apply the ABC prioritization framework: airway and breathing emergencies always supersede stable or non-urgent findings.',
    }
  },

  {
    id: 2,
    format: FORMATS.PRIORITY,
    category: CATEGORIES.MANAGEMENT,
    difficulty: DIFFICULTY.HARD,
    examType: ['RN'],
    stem: `A registered nurse is delegating tasks to a licensed practical nurse (LPN) and a nursing assistant (NA). Which task is MOST appropriate for the nurse to delegate to the nursing assistant?`,
    options: [
      { id: 'A', text: 'Administer a pre-packaged Fleet enema to a stable client with constipation.' },
      { id: 'B', text: 'Perform a focused respiratory assessment on a client 2 hours post-bronchoscopy.' },
      { id: 'C', text: 'Assist a client who had a hip replacement 3 days ago with ambulation to the bathroom.' },
      { id: 'D', text: 'Reinforce teaching about a low-sodium diet to a client with heart failure.' },
    ],
    correctAnswers: ['C'],
    rationale: {
      concept: 'Delegation follows the Five Rights: Right Task, Right Circumstance, Right Person, Right Direction/Communication, and Right Supervision. Nursing assistants may perform routine, non-invasive care tasks for stable clients. Tasks requiring clinical assessment, judgment, or client education remain within the RN or LPN scope of practice.',
      right: 'Option C is correct. Assisting a stable, post-operative client who is 3 days out from hip replacement with ambulation to the bathroom is a routine, non-invasive task within the NA\'s scope. The client is stable, and the task requires basic physical assistance, not clinical decision-making.',
      wrong: [
        { option: 'A', text: 'Fleet enema administration involves invasive procedures and monitoring for adverse effects (e.g., fluid/electrolyte imbalance). This falls within the LPN/RN scope, not the NA.' },
        { option: 'B', text: 'A post-bronchoscopy assessment requires licensed nursing judgment to detect complications like bleeding, pneumothorax, or laryngospasm. This must be performed by an RN.' },
        { option: 'D', text: 'Client teaching is exclusively within the RN\'s scope. Teaching requires assessment of learning readiness, educational planning, and evaluation of comprehension — beyond the NA\'s role.' },
      ],
      objective: 'Delegate only tasks that are stable, routine, and non-invasive to nursing assistants; reserve clinical assessment, invasive procedures, and teaching for licensed personnel.',
    }
  },

  {
    id: 3,
    format: FORMATS.PRIORITY,
    category: CATEGORIES.PHARMACOLOGY,
    difficulty: DIFFICULTY.HARD,
    examType: ['RN', 'PN'],
    stem: `A nurse is caring for four clients. After receiving handoff report, which client requires PRIORITY assessment?`,
    options: [
      { id: 'A', text: 'A client on metformin who has a serum creatinine of 1.8 mg/dL (normal 0.6–1.2 mg/dL).' },
      { id: 'B', text: 'A client on warfarin who reports eating a large serving of leafy green vegetables.' },
      { id: 'C', text: 'A client on lisinopril who is requesting a refill of their ACE inhibitor prescription.' },
      { id: 'D', text: 'A client on digoxin who reports nausea, visual disturbances, and a heart rate of 52 bpm.' },
    ],
    correctAnswers: ['D'],
    rationale: {
      concept: 'Digoxin has a narrow therapeutic index (therapeutic range 0.5–2.0 ng/mL). Toxicity signs include GI symptoms (nausea, anorexia, vomiting), visual disturbances (yellow-green halos), and bradycardia/dysrhythmias. Digoxin toxicity is life-threatening and requires immediate assessment.',
      right: 'Option D is correct. This client displays the classic triad of digoxin toxicity: nausea (GI symptom), visual disturbances, and bradycardia (HR 52 bpm). Digoxin toxicity can cause fatal cardiac dysrhythmias. This warrants immediate assessment, withholding the next dose, drawing a digoxin level, and notifying the provider.',
      wrong: [
        { option: 'A', text: 'Elevated creatinine with metformin use is a concern (metformin is contraindicated in renal impairment due to lactic acidosis risk), but this is a subacute concern requiring provider notification — not an acute emergency.' },
        { option: 'B', text: 'Vitamin K in leafy greens can decrease warfarin\'s effect (raising INR concern), but this represents a stable dietary consideration to monitor, not an emergency.' },
        { option: 'C', text: 'A prescription refill request is an administrative need and is the lowest priority among actively ill clients.' },
      ],
      objective: 'Recognize the classic triad of digoxin toxicity (GI symptoms + visual changes + bradycardia) as an immediately life-threatening condition requiring urgent intervention.',
    }
  },

  // =============================================
  // SECTION 2: SATA (SELECT ALL THAT APPLY)
  // =============================================
  {
    id: 4,
    format: FORMATS.SATA,
    category: CATEGORIES.SAFETY,
    difficulty: DIFFICULTY.MEDIUM,
    examType: ['RN', 'PN'],
    stem: `A nurse is caring for a client in contact precautions for C. difficile (C. diff) infection. Which actions should the nurse perform? SELECT ALL THAT APPLY.`,
    options: [
      { id: 'A', text: 'Don gloves and gown before entering the client\'s room.' },
      { id: 'B', text: 'Use alcohol-based hand sanitizer after removing gloves.' },
      { id: 'C', text: 'Place the client in a private room or cohort with other C. diff clients.' },
      { id: 'D', text: 'Use soap and water for hand hygiene when leaving the client\'s room.' },
      { id: 'E', text: 'Dedicate equipment such as stethoscopes and blood pressure cuffs to the room.' },
      { id: 'F', text: 'Apply a surgical mask before entering the room.' },
    ],
    correctAnswers: ['A', 'C', 'D', 'E'],
    rationale: {
      concept: 'C. difficile is spread via spores transmitted by the fecal-oral route. C. diff spores are NOT killed by alcohol-based hand sanitizers, making soap-and-water handwashing mandatory. Contact precautions require gown, gloves, private room, and dedicated equipment to prevent spore transmission.',
      right: 'Options A, C, D, and E are correct. Contact precautions require donning gloves and gown before room entry (A), placing the client in a private room or cohorting (C), washing hands with soap and water because alcohol hand sanitizer does NOT kill C. diff spores (D), and using dedicated room equipment to prevent cross-contamination (E).',
      wrong: [
        { option: 'B', text: 'INCORRECT — This is a critical error. Alcohol-based hand sanitizers are ineffective against C. difficile spores. Soap and water physically remove spores from the hands and are mandatory for C. diff precautions.' },
        { option: 'F', text: 'INCORRECT — C. difficile is not transmitted via the airborne or droplet route. A surgical mask is not required for contact precautions. Mask use is indicated for droplet (surgical mask) or airborne (N-95) precautions.' },
      ],
      objective: 'Soap and water is always required for C. difficile — alcohol hand sanitizer is ineffective against spores and must never be substituted in this setting.',
    }
  },

  {
    id: 5,
    format: FORMATS.SATA,
    category: CATEGORIES.PHARMACOLOGY,
    difficulty: DIFFICULTY.MEDIUM,
    examType: ['RN', 'PN'],
    stem: `A nurse is preparing to administer IV heparin to a client with a deep vein thrombosis. Which nursing actions are appropriate? SELECT ALL THAT APPLY.`,
    options: [
      { id: 'A', text: 'Check the client\'s activated partial thromboplastin time (aPTT) before initiating the infusion.' },
      { id: 'B', text: 'Verify the heparin dose with a second licensed nurse before administering.' },
      { id: 'C', text: 'Monitor the client\'s urine output hourly during the infusion.' },
      { id: 'D', text: 'Have protamine sulfate readily available as the antidote.' },
      { id: 'E', text: 'Assess the client for signs of bleeding including petechiae, ecchymosis, and hematuria.' },
      { id: 'F', text: 'Administer the heparin in the same IV line as other infusions to reduce venous access sites.' },
    ],
    correctAnswers: ['A', 'B', 'D', 'E'],
    rationale: {
      concept: 'Heparin is a high-alert anticoagulant with a narrow therapeutic range. Therapeutic aPTT for heparin therapy is 1.5–2.5 times the control value (approximately 60–100 seconds). The primary adverse effect is hemorrhage. Protamine sulfate is the specific antidote for heparin.',
      right: 'Options A, B, D, and E are correct. Baseline aPTT guides dosing (A). Double-checking is required per The Joint Commission for all high-alert medications (B). Protamine sulfate reverses heparin toxicity and must be immediately accessible (D). Ongoing bleeding assessment detects the primary complication of anticoagulation (E).',
      wrong: [
        { option: 'C', text: 'Hourly urine output monitoring is appropriate for critical care or hemodynamic instability, but is not a standard heparin-specific requirement. Urine color assessment for hematuria is appropriate but differs from hourly output monitoring.' },
        { option: 'F', text: 'Heparin should NEVER be co-administered with other medications in the same IV line due to incompatibility risks. A dedicated IV line or port is required for heparin infusions.' },
      ],
      objective: 'Heparin is a high-alert medication requiring double-check verification, baseline aPTT, bleeding surveillance, and protamine sulfate availability at all times.',
    }
  },

  {
    id: 6,
    format: FORMATS.SATA,
    category: CATEGORIES.PHYSIOLOGICAL,
    difficulty: DIFFICULTY.MEDIUM,
    examType: ['RN', 'PN'],
    stem: `A nurse is assessing a client who is 24 hours post-operative following a bowel resection. Which findings indicate a potentially life-threatening complication and warrant immediate provider notification? SELECT ALL THAT APPLY.`,
    options: [
      { id: 'A', text: 'Temperature of 38.8°C (101.8°F).' },
      { id: 'B', text: 'Urine output of 18 mL/hour for the past 2 hours.' },
      { id: 'C', text: 'Incisional pain rated 4/10, improved from 7/10 earlier in the shift.' },
      { id: 'D', text: 'Sudden onset of tachycardia (HR 128 bpm) with hypotension (BP 88/52 mmHg).' },
      { id: 'E', text: 'Abdominal distension with absence of bowel sounds.' },
      { id: 'F', text: 'Small amount of serosanguineous drainage from the surgical drain.' },
    ],
    correctAnswers: ['A', 'B', 'D', 'E'],
    rationale: {
      concept: 'Post-operative complications following bowel resection include hemorrhagic shock (hypovolemia), sepsis, anastomotic leak, ileus, and acute kidney injury. Timely recognition of the signs of systemic compromise (hemodynamic instability, oliguria, fever, absent bowel sounds) is critical for survival.',
      right: 'Options A, B, D, and E require immediate notification. Fever ≥38.5°C at 24h post-op suggests early infection or anastomotic leak (A). Urine output <30 mL/hr (oliguria) indicates inadequate perfusion or renal compromise (B). Sudden tachycardia with hypotension is a hallmark of hemorrhagic or septic shock (D). Absent bowel sounds with distension suggests ileus or peritonitis from anastomotic leak (E).',
      wrong: [
        { option: 'C', text: 'Improving pain (from 7/10 to 4/10) is an expected and positive finding post-operatively. This does not require urgent notification.' },
        { option: 'F', text: 'A small amount of serosanguineous drainage from a surgical drain is expected in the first 24–48 hours post-operatively and does not require urgent notification unless it becomes bright red or increases significantly.' },
      ],
      objective: 'The post-operative triad of fever, oliguria, and hemodynamic instability signals serious complications (sepsis, hemorrhage, anastomotic leak) requiring immediate provider notification.',
    }
  },

  {
    id: 7,
    format: FORMATS.SATA,
    category: CATEGORIES.PSYCHOSOCIAL,
    difficulty: DIFFICULTY.MEDIUM,
    examType: ['RN', 'PN'],
    stem: `A nurse is caring for a client who discloses that they are thinking about suicide. Which nursing interventions are appropriate? SELECT ALL THAT APPLY.`,
    options: [
      { id: 'A', text: 'Ask the client directly, "Do you have a plan to harm yourself?"' },
      { id: 'B', text: 'Leave the client alone to allow privacy and dignity.' },
      { id: 'C', text: 'Remove or secure potentially harmful objects from the client\'s environment.' },
      { id: 'D', text: 'Notify the provider and initiate a safety assessment per facility protocol.' },
      { id: 'E', text: 'Obtain a verbal promise from the client that they will not harm themselves.' },
      { id: 'F', text: 'Establish a therapeutic relationship and communicate empathically.' },
    ],
    correctAnswers: ['A', 'C', 'D', 'F'],
    rationale: {
      concept: 'Suicide risk assessment requires direct questioning about ideation, plan, and intent — asking does NOT increase suicide risk. Client safety is paramount: the nurse must secure the environment, ensure continuous observation, notify the provider, and maintain therapeutic presence.',
      right: 'Options A, C, D, and F are correct. Direct questioning (A) assesses lethality and plan formation without increasing risk. Securing the environment (C) removes means of self-harm. Provider notification (D) initiates psychiatric evaluation and appropriate level of care. Therapeutic communication (F) builds trust and de-escalates crisis.',
      wrong: [
        { option: 'B', text: 'NEVER leave a suicidal client alone. Continuous observation is a fundamental safety standard. Leaving the client alone could allow them to act on suicidal ideation.' },
        { option: 'E', text: '"No-suicide contracts" (verbal or written) have no evidence of efficacy in preventing suicide and may give a false sense of security to the nurse. They are not a substitute for a comprehensive safety plan or psychiatric evaluation.' },
      ],
      objective: 'Suicidal clients require direct questioning, environmental safety, constant observation, provider notification, and therapeutic presence — never isolation or informal contracts.',
    }
  },

  // =============================================
  // SECTION 3: NGN CASE STUDIES
  // =============================================
  {
    id: 8,
    format: FORMATS.NGN,
    category: CATEGORIES.PHYSIOLOGICAL,
    difficulty: DIFFICULTY.HARD,
    examType: ['RN'],
    caseTitle: 'Emergency Department — Chest Pain',
    scenario: `A 58-year-old male is brought to the emergency department by his wife reporting sudden onset substernal chest pain radiating to the left arm and jaw, rated 9/10. The pain started 45 minutes ago at rest and is not relieved by two sublingual nitroglycerin tablets administered before arrival. He appears diaphoretic, anxious, and pale.`,
    clientData: [
      { label: 'BP', value: '92/58 mmHg', alert: true },
      { label: 'HR', value: '108 bpm (irregular)', alert: true },
      { label: 'RR', value: '22 breaths/min', alert: true },
      { label: 'SpO₂', value: '94% on room air', alert: true },
      { label: 'Temp', value: '37.1°C (98.8°F)', alert: false },
      { label: 'History', value: 'Hypertension, Type 2 DM, smoker', alert: false },
      { label: 'Meds', value: 'Metformin, lisinopril, aspirin 81mg', alert: false },
    ],
    stem: `Based on the client's presentation, which provider orders should the nurse anticipate and prepare for IMMEDIATELY? SELECT ALL THAT APPLY.`,
    options: [
      { id: 'A', text: '12-lead ECG within 10 minutes of arrival.' },
      { id: 'B', text: 'Administer aspirin 325 mg PO (chew and swallow) if not contraindicated.' },
      { id: 'C', text: 'Obtain cardiac biomarkers (troponin I and T, CK-MB).' },
      { id: 'D', text: 'Administer IV metoprolol 5 mg for rate control.' },
      { id: 'E', text: 'Establish large-bore IV access (≥18G) and draw STAT labs.' },
      { id: 'F', text: 'Administer supplemental oxygen to maintain SpO₂ ≥ 94%.' },
    ],
    correctAnswers: ['A', 'B', 'C', 'E', 'F'],
    rationale: {
      concept: 'The presentation is consistent with an ST-Elevation Myocardial Infarction (STEMI) or acute coronary syndrome (ACS). The door-to-balloon (DTB) time goal is ≤90 minutes. Initial interventions follow the "MONA" mnemonic (Morphine, Oxygen, Nitrates, Aspirin) and rapid diagnostic workup: ECG, cardiac biomarkers, and IV access.',
      right: 'Options A, B, C, E, and F are correct. AHA/ACC guidelines mandate a 12-lead ECG within 10 minutes of symptom onset or ED arrival to identify ST changes (A). Non-enteric aspirin 325mg inhibits platelet aggregation and is a cornerstone of ACS therapy (B). Troponin is the gold-standard biomarker for myocardial injury (C). Large-bore IV access enables rapid medication delivery (E). Supplemental O₂ is given when SpO₂ <94% (F).',
      wrong: [
        { option: 'D', text: 'IV metoprolol is CONTRAINDICATED in this setting. The client is hypotensive (BP 92/58). Giving IV beta-blockers in acute decompensation with hypotension can precipitate cardiogenic shock. Oral beta-blockers may be initiated after hemodynamic stability is established, typically within 24 hours per guidelines.' },
      ],
      objective: 'In suspected ACS, prioritize 12-lead ECG, aspirin, cardiac biomarkers, and IV access immediately; NEVER administer IV beta-blockers to a hemodynamically unstable, hypotensive client.',
    }
  },

  {
    id: 9,
    format: FORMATS.NGN,
    category: CATEGORIES.SAFETY,
    difficulty: DIFFICULTY.HARD,
    examType: ['RN'],
    caseTitle: 'Pediatric Unit — Allergic Reaction',
    scenario: `A 7-year-old child (22 kg) on the pediatric floor is 10 minutes into a first-time IV penicillin infusion for a streptococcal infection. The child suddenly becomes agitated, reports throat tightness, and begins wheezing. The nurse observes urticaria spreading across the chest and face.`,
    clientData: [
      { label: 'BP', value: '84/50 mmHg', alert: true },
      { label: 'HR', value: '138 bpm', alert: true },
      { label: 'RR', value: '30 breaths/min (labored)', alert: true },
      { label: 'SpO₂', value: '90% on room air', alert: true },
      { label: 'Weight', value: '22 kg', alert: false },
      { label: 'Allergy', value: 'NKDA on chart (penicillin NOT documented)', alert: true },
    ],
    stem: `The nurse recognizes anaphylaxis. Place the following interventions in order of priority by selecting the MOST important action FIRST.`,
    options: [
      { id: 'A', text: 'Administer epinephrine 1:1000 IM (0.01 mg/kg, max 0.5 mg) into the anterolateral thigh.' },
      { id: 'B', text: 'Stop the penicillin infusion immediately.' },
      { id: 'C', text: 'Call for emergency assistance / activate the rapid response team.' },
      { id: 'D', text: 'Prepare diphenhydramine IV as adjunctive therapy.' },
      { id: 'E', text: 'Apply supplemental oxygen via non-rebreather mask at 10–15 L/min.' },
    ],
    correctAnswers: ['B'],
    rationale: {
      concept: 'Anaphylaxis is an immediate hypersensitivity reaction. The first step is always to STOP the offending agent (if infusing). Epinephrine is the first-line treatment for anaphylaxis — it is life-saving and must never be delayed. Antihistamines are adjunctive and must NEVER replace epinephrine as primary therapy.',
      right: 'The CORRECT first action is B: Stop the penicillin infusion immediately. Eliminating the allergen is the first step. However, in real clinical practice, stopping the infusion and calling for help occur nearly simultaneously. The correct sequence is: Stop infusion → Call for help → Administer IM epinephrine → Apply high-flow O₂ → Prepare adjunct diphenhydramine.',
      wrong: [
        { option: 'A', text: 'Epinephrine is the definitive treatment (second priority after stopping the antigen), but should not precede stopping the infusion. The correct dose for this 22 kg child is 0.22 mg IM of 1:1000 concentration.' },
        { option: 'C', text: 'Calling for help is critically important and occurs nearly simultaneously with stopping the infusion — but stopping the causal agent is the very first mechanical action.' },
        { option: 'D', text: 'Diphenhydramine (Benadryl) is a slow-acting H1 blocker. It is adjunctive in anaphylaxis. It does NOT prevent laryngeal edema or cardiovascular collapse and must NEVER be given instead of epinephrine.' },
        { option: 'E', text: 'High-flow oxygen is important but comes after stopping the infusion and administering epinephrine in the priority sequence.' },
      ],
      objective: 'In anaphylaxis: STOP the antigen FIRST, then immediately administer IM epinephrine — antihistamines are adjunctive only and never replace epinephrine.',
    }
  },

  // =============================================
  // SECTION 4: MORE CLINICAL MCQ / PRIORITY
  // =============================================
  {
    id: 10,
    format: FORMATS.PRIORITY,
    category: CATEGORIES.PHYSIOLOGICAL,
    difficulty: DIFFICULTY.HARD,
    examType: ['RN', 'PN'],
    stem: `A nurse receives laboratory results for four assigned clients. Which result requires the nurse to take IMMEDIATE action?`,
    options: [
      { id: 'A', text: 'Client with renal failure: serum potassium 6.2 mEq/L (normal 3.5–5.0 mEq/L).' },
      { id: 'B', text: 'Client on chemotherapy: hemoglobin 10.2 g/dL.' },
      { id: 'C', text: 'Client post-cardiac catheterization: platelet count 140,000/mm³.' },
      { id: 'D', text: 'Client on thyroid replacement: TSH 3.8 mIU/L.' },
    ],
    correctAnswers: ['A'],
    rationale: {
      concept: 'Hyperkalemia (serum K⁺ >5.5 mEq/L, critical >6.0 mEq/L) causes potentially fatal cardiac dysrhythmias by altering the resting membrane potential of cardiomyocytes. In renal failure, impaired potassium excretion accelerates this risk. A K⁺ of 6.2 mEq/L requires immediate cardiac monitoring and provider notification.',
      right: 'Option A is correct. A serum potassium of 6.2 mEq/L in a client with renal failure is a critical value. Hyperkalemia can cause peaked T waves, widened QRS, ventricular fibrillation, and cardiac arrest. Immediate interventions include: cardiac monitoring, provider notification, obtaining a 12-lead ECG, and preparing for treatment (calcium gluconate, sodium bicarbonate, insulin/dextrose, or Kayexalate).',
      wrong: [
        { option: 'B', text: 'Hemoglobin of 10.2 g/dL represents mild anemia, which is expected in chemotherapy clients. While important to monitor, this does not require immediate action.' },
        { option: 'C', text: 'A platelet count of 140,000/mm³ is at the low end of normal (150,000–400,000/mm³) but is a borderline finding in a post-catheterization client. This warrants monitoring, not immediate action.' },
        { option: 'D', text: 'A TSH of 3.8 mIU/L is within the normal range (0.4–4.0 mIU/L) for a client on thyroid replacement therapy. No immediate action is required.' },
      ],
      objective: 'A serum potassium >6.0 mEq/L is a critical laboratory value requiring immediate cardiac monitoring and provider notification to prevent fatal dysrhythmias.',
    }
  },

  {
    id: 11,
    format: FORMATS.MCQ,
    category: CATEGORIES.PHARMACOLOGY,
    difficulty: DIFFICULTY.MEDIUM,
    examType: ['RN', 'PN'],
    stem: `A client is prescribed morphine sulfate 4 mg IV for acute pain. Prior to administration, the nurse notes the client's respiratory rate is 9 breaths/min. What is the MOST appropriate nursing action?`,
    options: [
      { id: 'A', text: 'Administer the morphine and monitor the client closely for respiratory changes.' },
      { id: 'B', text: 'Withhold the morphine, stimulate the client, and notify the provider immediately.' },
      { id: 'C', text: 'Administer half the dose (2 mg) and reassess in 15 minutes.' },
      { id: 'D', text: 'Administer the morphine, then prepare naloxone for anticipated reversal.' },
    ],
    correctAnswers: ['B'],
    rationale: {
      concept: 'Morphine is an opioid analgesic. Its primary risk is respiratory depression. The nurse must assess respiratory rate before each dose. A respiratory rate below 12 breaths/min indicates opioid-induced respiratory depression or excessive CNS depression. The threshold for withholding opioids is generally <12 breaths/min.',
      right: 'Option B is correct. A respiratory rate of 9 breaths/min is below the safe threshold of 12 breaths/min for opioid administration. The nurse must withhold the morphine, stimulate the client (sternal rub, calling by name), reassess the airway, and immediately notify the provider. Naloxone (Narcan) should be prepared if opioid overdose is suspected.',
      wrong: [
        { option: 'A', text: 'Administering morphine with a respiratory rate of 9 breaths/min is dangerous and could cause further respiratory depression and apnea. This is a medication safety error.' },
        { option: 'C', text: 'Administering any dose of morphine when the respiratory rate is below 12 is contraindicated, regardless of the amount. The issue is not the dose — it is the pre-existing respiratory depression.' },
        { option: 'D', text: 'While naloxone is the correct antidote for opioid overdose, it is not appropriate to administer morphine while the client is already showing signs of respiratory compromise and plan to reverse it. Prevention is the priority.' },
      ],
      objective: 'WITHHOLD opioids when respiratory rate is below 12 breaths/min and immediately notify the provider — never administer and then attempt to reverse anticipated toxicity.',
    }
  },

  {
    id: 12,
    format: FORMATS.SATA,
    category: CATEGORIES.HEALTH_PROMO,
    difficulty: DIFFICULTY.MEDIUM,
    examType: ['RN', 'PN'],
    stem: `A nurse is providing discharge teaching to a client diagnosed with newly diagnosed hypertension who is NOT currently on medication. Which lifestyle modifications should the nurse include? SELECT ALL THAT APPLY.`,
    options: [
      { id: 'A', text: 'Follow the DASH (Dietary Approaches to Stop Hypertension) diet, emphasizing fruits, vegetables, and low-fat dairy.' },
      { id: 'B', text: 'Limit sodium intake to less than 2,300 mg per day (ideally <1,500 mg/day).' },
      { id: 'C', text: 'Engage in moderate-intensity aerobic activity for at least 150 minutes per week.' },
      { id: 'D', text: 'Eliminate all caffeine from the diet permanently.' },
      { id: 'E', text: 'Limit alcohol to no more than 1 drink/day for women and 2 drinks/day for men.' },
      { id: 'F', text: 'Achieve and maintain a BMI within the healthy range (18.5–24.9 kg/m²) if overweight.' },
    ],
    correctAnswers: ['A', 'B', 'C', 'E', 'F'],
    rationale: {
      concept: 'Non-pharmacological management of hypertension uses lifestyle modifications supported by AHA/ACC guidelines. These include the DASH diet, sodium restriction, physical activity, weight management, smoking cessation, and moderate alcohol restriction. Evidence-based modifications can lower systolic BP by 4–11 mmHg each.',
      right: 'Options A, B, C, E, and F are all evidence-based AHA/ACC hypertension lifestyle recommendations. The DASH diet (A), sodium restriction (B), regular aerobic exercise (C), alcohol moderation (E), and weight management (F) each independently reduce blood pressure and together have additive benefits.',
      wrong: [
        { option: 'D', text: 'Complete caffeine elimination is NOT an AHA-recommended intervention for hypertension. Moderate caffeine consumption (up to 400 mg/day or approximately 3–4 cups of coffee) has not been proven to cause sustained hypertension in most adults. Clients may be advised to monitor their individual response.' },
      ],
      objective: 'Hypertension lifestyle management focuses on the DASH diet, sodium and alcohol restriction, regular aerobic exercise, and weight control — total caffeine elimination is not evidence-based.',
    }
  },

  {
    id: 13,
    format: FORMATS.PRIORITY,
    category: CATEGORIES.REDUCTION,
    difficulty: DIFFICULTY.HARD,
    examType: ['RN', 'PN'],
    stem: `A nurse is caring for a client who returns from a thyroidectomy 4 hours ago. Which assessment finding requires IMMEDIATE nursing intervention?`,
    options: [
      { id: 'A', text: 'Hoarseness of voice reported since returning from surgery.' },
      { id: 'B', text: 'Positive Chvostek\'s sign: facial twitching when tapping the facial nerve.' },
      { id: 'C', text: 'Serosanguineous drainage on the dressing, approximately 3 cm in diameter.' },
      { id: 'D', text: 'Pain rated 5/10 at the incision site, managed with oral acetaminophen.' },
    ],
    correctAnswers: ['B'],
    rationale: {
      concept: 'The parathyroid glands lie adjacent to the thyroid and are at risk for inadvertent removal or damage during thyroidectomy. This causes hypoparathyroidism, leading to hypocalcemia. Hypocalcemia presents with neuromuscular excitability: positive Chvostek\'s sign (facial twitching), Trousseau\'s sign (carpopedal spasm with BP cuff inflation), circumoral numbness, and in severe cases, laryngospasm and tetany — a life-threatening emergency.',
      right: 'Option B is correct. A positive Chvostek\'s sign indicates hypocalcemia from accidental parathyroid gland removal or injury during thyroidectomy. This is an early warning sign that can progress to laryngospasm and seizures. The nurse must notify the provider immediately, prepare for IV calcium gluconate administration, and place emergency airway equipment at bedside.',
      wrong: [
        { option: 'A', text: 'Post-thyroidectomy hoarseness is expected and common due to surgical manipulation near the recurrent laryngeal nerve. While it should be reported and documented, it does not require immediate intervention unless it progresses to respiratory distress.' },
        { option: 'C', text: 'A small amount of serosanguineous drainage (3 cm) on a post-operative dressing is expected within the first few hours. Bright red, rapidly expanding drainage would indicate hemorrhage and require immediate action. A 3 cm spot is not an emergency.' },
        { option: 'D', text: 'Pain of 5/10 that is being managed with oral acetaminophen is a controlled finding and does not indicate an emergency.' },
      ],
      objective: 'After thyroidectomy, a positive Chvostek\'s sign signals hypocalcemia from parathyroid injury — a potentially life-threatening emergency requiring immediate notification and IV calcium gluconate preparation.',
    }
  },

  {
    id: 14,
    format: FORMATS.SATA,
    category: CATEGORIES.BASIC_CARE,
    difficulty: DIFFICULTY.MEDIUM,
    examType: ['RN', 'PN'],
    stem: `A nurse is caring for a client at high risk for developing a pressure injury. Which interventions should be included in the plan of care? SELECT ALL THAT APPLY.`,
    options: [
      { id: 'A', text: 'Reposition the client at least every 2 hours, using a turning schedule.' },
      { id: 'B', text: 'Place the client\'s heels in direct contact with the mattress to protect the calves.' },
      { id: 'C', text: 'Use a pressure-redistributing mattress or specialty foam mattress overlay.' },
      { id: 'D', text: 'Massage bony prominences vigorously to increase circulation.' },
      { id: 'E', text: 'Maintain the head of bed at 30 degrees or less to minimize shear forces.' },
      { id: 'F', text: 'Ensure adequate nutrition with sufficient protein intake (1.2–1.5 g/kg/day).' },
    ],
    correctAnswers: ['A', 'C', 'E', 'F'],
    rationale: {
      concept: 'Pressure injury prevention focuses on relieving pressure, reducing shear and friction, optimizing nutrition, and maintaining skin integrity. NPUAP/EPUAP guidelines define evidence-based interventions. Critically, vigorous massage of bony prominences and heel contact with mattress surfaces are contraindicated.',
      right: 'Options A, C, E, and F are correct. Turning every 2 hours (A) relieves sustained pressure. Pressure-redistributing surfaces (C) distribute weight more evenly. HOB at ≤30° (E) minimizes sacral shear. Protein supports tissue healing and wound prevention (F).',
      wrong: [
        { option: 'B', text: 'Heels must be ELEVATED and FLOATED off the mattress surface, not placed in contact with it. The heel has little tissue cushioning and is a very high-risk site. Use heel-floating boots or pillows under the calves.' },
        { option: 'D', text: 'Vigorous massage of bony prominences is CONTRAINDICATED. It can cause capillary disruption, tissue damage, and worsen already compromised blood flow to at-risk areas. This practice has been removed from clinical guidelines.' },
      ],
      objective: 'Pressure injury prevention requires: 2-hour repositioning, pressure-redistributing surfaces, head-of-bed ≤30°, and protein nutrition — NEVER massage bony prominences or allow heels to rest on the mattress.',
    }
  },

  {
    id: 15,
    format: FORMATS.MCQ,
    category: CATEGORIES.PSYCHOSOCIAL,
    difficulty: DIFFICULTY.MEDIUM,
    examType: ['RN', 'PN'],
    stem: `A nurse is caring for a client newly diagnosed with breast cancer. The client states, "There must be some mistake. I feel fine — I can't possibly have cancer." The nurse recognizes this as which stage of grief?`,
    options: [
      { id: 'A', text: 'Anger — the client is dismissing the diagnosis as a medical error.' },
      { id: 'B', text: 'Denial — the client is refusing to acknowledge the reality of the diagnosis.' },
      { id: 'C', text: 'Bargaining — the client is negotiating with the situation.' },
      { id: 'D', text: 'Acceptance — the client is processing the diagnosis calmly.' },
    ],
    correctAnswers: ['B'],
    rationale: {
      concept: 'Kübler-Ross identified five stages of grief: Denial, Anger, Bargaining, Depression, and Acceptance (DABDA). These stages are not linear or universal, but they provide a framework for understanding clients\' responses to loss and terminal or serious diagnoses. Denial is the first and most common initial response.',
      right: 'Option B is correct. The client\'s statement ("There must be some mistake") is a classic manifestation of Denial — the first stage of grief. The client is psychologically protecting herself from the shock of a cancer diagnosis by refusing to accept its reality. The therapeutic nursing response is to acknowledge feelings, provide empathy, and be present without forcing reality acceptance.',
      wrong: [
        { option: 'A', text: 'Anger involves expressing frustration, resentment, or blame ("Why me?", "This is unfair!"). The client\'s statement focuses on disbelief, not anger.' },
        { option: 'C', text: 'Bargaining involves negotiating ("If I do X, maybe the cancer will go away"). The client is not making a deal — she is rejecting the information entirely.' },
        { option: 'D', text: 'Acceptance involves integrating the loss and moving forward constructively. A newly diagnosed client who says "there must be a mistake" is far from acceptance.' },
      ],
      objective: 'Denial is the first stage of grief (Kübler-Ross) — recognize it by clients\' refusal to accept reality, and respond with empathic presence, not forced confrontation.',
    }
  },

  {
    id: 16,
    format: FORMATS.NGN,
    category: CATEGORIES.PHARMACOLOGY,
    difficulty: DIFFICULTY.HARD,
    examType: ['RN'],
    caseTitle: 'Medical-Surgical Unit — Insulin Management',
    scenario: `A 67-year-old female with type 1 diabetes mellitus is admitted for a urinary tract infection. She is NPO awaiting a procedure. Her morning blood glucose is 48 mg/dL. She is on a subcutaneous insulin drip protocol. She is diaphoretic, trembling, and confused.`,
    clientData: [
      { label: 'Blood Glucose', value: '48 mg/dL', alert: true },
      { label: 'LOC', value: 'Confused, lethargic', alert: true },
      { label: 'BP', value: '100/68 mmHg', alert: false },
      { label: 'HR', value: '112 bpm', alert: true },
      { label: 'SpO₂', value: '97% on room air', alert: false },
      { label: 'NPO Status', value: 'NPO since midnight', alert: true },
      { label: 'IV Access', value: '20G PIV right forearm', alert: false },
    ],
    stem: `The client is NPO and confused. What is the MOST appropriate immediate intervention?`,
    options: [
      { id: 'A', text: 'Give 4 oz (120 mL) of orange juice orally since the client appears able to swallow.' },
      { id: 'B', text: 'Administer 25 mL of Dextrose 50% (D50W) IV push.' },
      { id: 'C', text: 'Administer 1 mg of glucagon IM and notify the provider.' },
      { id: 'D', text: 'Hold all insulin and recheck blood glucose in 30 minutes.' },
    ],
    correctAnswers: ['B'],
    rationale: {
      concept: 'Severe hypoglycemia (BG <50 mg/dL) with altered mental status is a medical emergency. The "15-15 Rule" (15g carbs, recheck in 15 min) applies only to CONSCIOUS, ALERT clients who can swallow safely. An NPO, confused client is at high aspiration risk. IV Dextrose 50% (D50W) is the gold standard for severe hypoglycemia when oral intake is contraindicated.',
      right: 'Option B is correct. D50W IV push delivers 25 grams of dextrose rapidly into the bloodstream, raising blood glucose within minutes without aspiration risk. For a confused, NPO client with a BG of 48 mg/dL, this is the safest and most effective intervention. After treatment, blood glucose is rechecked within 15 minutes and the provider is notified.',
      wrong: [
        { option: 'A', text: 'CRITICAL ERROR — Never give anything by mouth (PO) to a confused, lethargic client who is NPO. The risk of aspiration pneumonia is significant. "Appears able to swallow" is not a safe assessment for a confused patient.' },
        { option: 'C', text: 'Glucagon IM is appropriate for severe hypoglycemia when IV access is NOT available. Since this client has a 20G PIV, IV Dextrose 50% is faster, more reliable, and the preferred first-line treatment. Glucagon also causes nausea/vomiting, which worsens aspiration risk.' },
        { option: 'D', text: 'A blood glucose of 48 mg/dL with neurological symptoms (confusion, diaphoresis, trembling) is a medical emergency. Waiting 30 minutes without treatment could result in seizure, brain damage, or cardiac arrest.' },
      ],
      objective: 'Severe hypoglycemia with altered LOC in an NPO client requires IV D50W — oral glucose is NEVER given to confused or NPO clients due to aspiration risk.',
    }
  },

  {
    id: 17,
    format: FORMATS.PRIORITY,
    category: CATEGORIES.MANAGEMENT,
    difficulty: DIFFICULTY.HARD,
    examType: ['RN', 'PN'],
    stem: `A nurse is assigned to four clients. Using the SBAR (Situation, Background, Assessment, Recommendation) model, which client should the nurse communicate with the provider FIRST?`,
    options: [
      { id: 'A', text: 'A client with a sodium level of 128 mEq/L (normal 135–145 mEq/L) who is asymptomatic.' },
      { id: 'B', text: 'A client with a new-onset severe headache rated 10/10, sudden onset, described as "the worst headache of my life."' },
      { id: 'C', text: 'A client with HIV/AIDS reporting a new rash on the trunk.' },
      { id: 'D', text: 'A client post-hip replacement requesting their morning pain medication.' },
    ],
    correctAnswers: ['B'],
    rationale: {
      concept: 'A sudden severe headache described as "the worst headache of my life" (thunderclap headache) is a hallmark presentation of subarachnoid hemorrhage (SAH) — a life-threatening neurological emergency with a mortality rate up to 50%. Time to CT scan and neurosurgical evaluation is critical for survival.',
      right: 'Option B is correct. "Thunderclap headache" — sudden onset, maximal intensity at onset, described as the worst headache of one\'s life — is a medical emergency until SAH is ruled out. The nurse must immediately notify the provider, initiate neuro assessment (GCS, pupillary response), position the client with HOB elevated, and prepare for emergent CT scan.',
      wrong: [
        { option: 'A', text: 'Hyponatremia of 128 mEq/L warrants provider notification, but an asymptomatic client is not an immediate emergency compared to a suspected SAH.' },
        { option: 'C', text: 'A new rash in an HIV/AIDS client requires assessment (potential opportunistic infection), but is not as immediately life-threatening as a suspected intracranial bleed.' },
        { option: 'D', text: 'Pain medication requests are anticipated and routine post-operatively. This is the lowest priority.' },
      ],
      objective: 'A sudden-onset "worst headache of my life" (thunderclap headache) is subarachnoid hemorrhage until proven otherwise — this constitutes a neurological emergency requiring immediate provider notification.',
    }
  },

  {
    id: 18,
    format: FORMATS.SATA,
    category: CATEGORIES.REDUCTION,
    difficulty: DIFFICULTY.MEDIUM,
    examType: ['RN', 'PN'],
    stem: `A nurse is reviewing the medical record of a client scheduled for a CT scan with contrast dye. Which findings should the nurse report to the radiologist or provider BEFORE the procedure? SELECT ALL THAT APPLY.`,
    options: [
      { id: 'A', text: 'Serum creatinine of 2.4 mg/dL.' },
      { id: 'B', text: 'Current use of metformin (Glucophage).' },
      { id: 'C', text: 'Allergy to shellfish and iodine documented in the chart.' },
      { id: 'D', text: 'Client reports taking aspirin 81 mg daily for cardiac history.' },
      { id: 'E', text: 'Current use of warfarin with INR of 2.4.' },
      { id: 'F', text: 'History of claustrophobia and anxiety.' },
    ],
    correctAnswers: ['A', 'B', 'C'],
    rationale: {
      concept: 'Contrast dye (iodinated contrast media) poses risks of: (1) contrast-induced nephropathy (CIN) in clients with pre-existing renal impairment, (2) lactic acidosis in metformin users whose creatinine clearance drops post-contrast, and (3) allergic reactions in clients with iodine/shellfish allergies. These must be reported before contrast administration.',
      right: 'Options A, B, and C require pre-procedure notification. Elevated creatinine (A) indicates renal impairment — contrast can cause acute kidney injury. Metformin (B) must be held 48 hours before and after contrast to prevent lactic acidosis. An iodine/shellfish allergy (C) warrants pre-medication with steroids and diphenhydramine or use of low-osmolar contrast.',
      wrong: [
        { option: 'D', text: 'Aspirin does not interact with CT contrast media. It requires no special precautions for this procedure.' },
        { option: 'E', text: 'Warfarin use and INR level are relevant for invasive procedures (biopsies, surgeries) but CT scanning with contrast is non-invasive and does not require anticoagulation reversal.' },
        { option: 'F', text: 'Claustrophobia is more clinically relevant for MRI (enclosed bore). CT scanners have a wider, shorter bore. Anxiety should be addressed with patient education and reassurance; anxiolytics may be offered but this is not a contraindication requiring emergent provider notification.' },
      ],
      objective: 'Before CT contrast: check creatinine (CIN risk), hold metformin (lactic acidosis risk), and assess for iodine/shellfish allergy (anaphylaxis risk) — always report these three findings first.',
    }
  },

  {
    id: 19,
    format: FORMATS.MCQ,
    category: CATEGORIES.SAFETY,
    difficulty: DIFFICULTY.MEDIUM,
    examType: ['RN', 'PN'],
    stem: `A nurse discovers a client has accidentally received a double dose of IV furosemide. After stabilizing the client, what is the nurse's NEXT priority action?`,
    options: [
      { id: 'A', text: 'Document the incident in the medical record only.' },
      { id: 'B', text: 'Discuss the error privately with the administering colleague to prevent recurrence.' },
      { id: 'C', text: 'Complete an incident/occurrence report and notify the charge nurse and provider.' },
      { id: 'D', text: 'Administer a reversal agent for furosemide immediately.' },
    ],
    correctAnswers: ['C'],
    rationale: {
      concept: 'Medication errors require: (1) immediate client assessment and stabilization, (2) provider notification, (3) charge nurse notification, and (4) completion of an incident/occurrence report per facility policy. Incident reports are quality improvement tools and are confidential, NOT part of the medical record. They must never be mentioned in the chart.',
      right: 'Option C is correct. After client safety is ensured, the nurse must notify the provider (who will order monitoring and treatment) and the charge nurse (per chain of command), and complete an incident report (for quality improvement and system analysis). This is a legal and ethical obligation.',
      wrong: [
        { option: 'A', text: 'Documenting ONLY in the medical record is incomplete. The medical record should reflect what happened to the client (e.g., "double dose of furosemide administered; provider notified") but should NOT reference the incident report by name. Provider and charge nurse notification are mandatory.' },
        { option: 'B', text: 'Private discussions alone do not constitute appropriate error reporting. Medication errors must be formally reported per facility protocol regardless of the colleague relationship.' },
        { option: 'D', text: 'There is NO specific reversal agent for furosemide. Management includes monitoring for electrolyte imbalances (hypokalemia), hypotension, dehydration, and replacing fluids/electrolytes as ordered.' },
      ],
      objective: 'Medication errors require client stabilization, THEN provider notification, charge nurse notification, and incident report completion — the incident report is NEVER referenced in the medical chart.',
    }
  },

  {
    id: 20,
    format: FORMATS.SATA,
    category: CATEGORIES.PHYSIOLOGICAL,
    difficulty: DIFFICULTY.HARD,
    examType: ['RN'],
    stem: `A nurse is caring for a client in diabetic ketoacidosis (DKA). Which assessment findings are consistent with DKA? SELECT ALL THAT APPLY.`,
    options: [
      { id: 'A', text: 'Kussmaul respirations (deep, rapid breathing).' },
      { id: 'B', text: 'Fruity, acetone-like breath odor.' },
      { id: 'C', text: 'Blood glucose of 480 mg/dL.' },
      { id: 'D', text: 'Serum pH of 7.31 with serum bicarbonate of 14 mEq/L.' },
      { id: 'E', text: 'Serum potassium of 6.8 mEq/L on initial presentation.' },
      { id: 'F', text: 'Positive urine ketones and marked polyuria.' },
    ],
    correctAnswers: ['A', 'B', 'C', 'D', 'E', 'F'],
    rationale: {
      concept: 'DKA is characterized by the triad of hyperglycemia (>250 mg/dL), metabolic acidosis (pH <7.3, HCO₃⁻ <18 mEq/L), and ketosis. It occurs predominantly in type 1 diabetes. Key compensatory and pathophysiologic features include: Kussmaul breathing (respiratory compensation for metabolic acidosis), ketone production (acetone breath), and paradoxical initial hyperkalemia (K⁺ shifts from cells due to acidosis, but total body K⁺ is depleted).',
      right: 'All options (A–F) are consistent with DKA. Kussmaul respirations compensate for metabolic acidosis by blowing off CO₂ (A). Acetone breath results from ketone production (B). Hyperglycemia >250 mg/dL is diagnostic (C). pH 7.31 and HCO₃⁻ 14 indicate metabolic acidosis (D). Initial hyperkalemia occurs as H⁺ drives K⁺ out of cells — however, with insulin therapy, K⁺ drops rapidly (E). Ketonuria and polyuria from osmotic diuresis are hallmarks (F).',
      wrong: [],
      objective: 'DKA presents with hyperglycemia, metabolic acidosis, Kussmaul breathing, acetone breath, ketonuria, and initial hyperkalemia — watch for hypokalemia once insulin therapy begins.',
    }
  },

];

// Export for use in quiz engine
if (typeof module !== 'undefined' && module.exports) {
  module.exports = { QUESTION_BANK, CATEGORIES, FORMATS, DIFFICULTY };
}
