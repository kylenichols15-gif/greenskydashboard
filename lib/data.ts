export const LOCATIONS = [
  { code: 'LKW', name: 'H&N Lakewood',        brand: 'Harvey & Nichols', isOSB: false },
  { code: 'LT',  name: 'H&N Lincoln Trail',   brand: 'Harvey & Nichols', isOSB: false },
  { code: 'HNR', name: 'H&N Radcliff',        brand: 'Harvey & Nichols', isOSB: false },
  { code: 'HNS', name: 'H&N Shepherdsville',  brand: 'Harvey & Nichols', isOSB: false },
  { code: 'HNK', name: 'H&N King',            brand: 'Harvey & Nichols', isOSB: false },
  { code: 'PB',  name: 'Proctor Bardstown',   brand: 'Proctor Family',   isOSB: false },
  { code: 'PR',  name: 'Proctor Radcliff',    brand: 'Proctor Family',   isOSB: false },
  { code: 'OSB', name: 'Osbourne Family',     brand: 'Osbourne',         isOSB: true  },
]

// Bonus race collection goals (100% = $1,000 bonus tier). LT: $210K → $195K effective June 2026 (per Kyle 6/9/2026)
export const MONTHLY_GOALS: Record<string, number> = {
  LKW: 335000, LT: 195000, HNR: 130000, HNS: 90000, HNK: 80000, PB: 275000, PR: 140000, OSB: 210000,
}

// Production goals (used for location production tracking) — set to 2× each location's collection goal (MONTHLY_GOALS), per Kyle 8/12/2026
export const MONTHLY_PROD_GOALS: Record<string, number> = {
  LKW: 670000, LT: 390000, HNR: 260000, HNS: 180000, HNK: 160000, PB: 550000, PR: 280000, OSB: 420000,
}

// Individual doctor monthly gross production goals — 130% of DOCTOR_COLL_GOALS (per Kyle 5/21/2026)
export const PROVIDER_GOALS: Record<string, number> = {
  'Nichols, Christopher':   195000,
  "Weathers, L'Cris":      130000,
  'Proctor, Sarah':         195000,
  'Ballard, Erin':          117000,
  'Connolly, Noah':         130000,
  'Nichols, Patrick':       130000,
  'Walters, Carrie':         91000,
  'Skaggs, Ernest':          71500,
  'Osbourne, Brian':        143000,
  'Gleason, Robert':         91000,
  'Chadwick, Evan':          91000,
  'Decker Haycraft, Kara':   91000,
  'Harvey, Mark':            19500,
  'King, Susan':             91000,
  'Werner, Andrew':         100000,   // OSB associate — production goal per Kyle 8/26/2026
}

// Individual doctor monthly collections goals — key must match DEMO_DATA.doctors[].name exactly
export const DOCTOR_COLL_GOALS: Record<string, number> = {
  'Nichols, Christopher':  150000,
  'Nichols, Patrick':      100000,
  'Osbourne, Brian':       110000,
  'Proctor, Sarah':        150000,
  'Gleason, Robert':        70000,
  'Walters, Carrie':        70000,
  'Connolly, Noah':        100000,
  'Decker Haycraft, Kara':  70000,
  'Chadwick, Evan':         70000,
  'Ballard, Erin':          90000,
  'Skaggs, Ernest':         55000,
  "Weathers, L'Cris":      100000,
  'Harvey, Mark':           15000,
  'King, Susan':            70000,
  'Werner, Andrew':         60000,   // OSB associate — collections goal per Kyle 8/26/2026
}

export const BENCHMARKS = {
  NOI:               { target: 22.5, flagBelow: 18 },
  supplies_pct:      { target: 5.5,  flagAbove: 6.5 },
  lab_pct:           { target: 7.5,  flagAbove: 8.5 },
  payroll_pct:       { target: 27,   flagAbove: 30 },
  hygiene_recare:    { target: 85,   flagBelow: 80 },
  phone_answer_rate: { target: 80,   flagBelow: 70 },
  collections_rate:  { target: 98,   flagBelow: 95 },
  chair_utilization: { target: 85,   flagBelow: 75 },
}

// August 2026 — CLOSE (BD21 of 21 — all business days complete; data as of Aug 31, EOD).
// August has 21 weekdays and NO holiday (Labor Day is Sep 7) → 21 working days. MONTH COMPLETE.
export const PERIOD_INFO = {
  label:          'August 2026',
  dataAsOf:       'Aug 31',
  totalBizDays:   21,
  daysComplete:   21,
  daysRemaining:  0,
}

// ─── AUGUST 2026 — FINAL / CLOSE (data as of Aug 31 EOD) — Dentrix Ascend + Deposit Slip ───
// July 2026 FINAL frozen at lib/months/2026-07.ts (prod $2,597,555 · coll $1,362,082 · 701 NP).
// Location production = ProviderTotals (08/01–08/31 MTD) gross Procedure Charges $2,413,445, split to the 6 Ascend
//   locations by each location's share of August P/C-Summary (68) net production. Ties exactly to PT grand.
//   HNK + OSB = P/C Summary (68) net proxy (HNK $39,146 · OSB $129,124) — ⚠ HELD at 8/18: NO fresh P/C in the close
//   batch, so HNK/OSB production is a stale proxy (frozen --partial). ORG production = $2,413,445 + $39,146 + $129,124 = $2,581,715.
// COLLECTIONS = ORG-WIDE Deposit Slip (21) full month 08/01–08/31 (source of truth per Tiffany) — all 8 locations, actual cash.
//   Org = $1,450,143 = 99.7% of the $1,455,000 goal. Per-provider collections = ProviderTotals Payments.
// activeHygienePatients (per Chris 8/28) = Active Patients in Recare — CARRIED from BD19 (no recare export in close batch).
// NP (79) = 708 Aug FINAL. PPP (36) Aug per-provider patient counts. DAILY_LEADERBOARD = 8/31 single day (MTD 8/31 − MTD 8/28).
// AR — AgedReceivables (85) as of 08/31 EOD — ALL 8 in Ascend incl OSB ($227,605). Org net $1,848,487.
// Phones = Mango August pull #3 (org 4,871/7,175 = 67.9%) — no fresh close pull. suppliesPct = 5.7% (8/14 data).
// Goals: org prod $2.91M / coll $1.455M (location sums). ⇒ FREEZE August (--partial) after deploy.
export const DEMO_DATA = {
  period: 'August 2026',
  org: {
    production:      2581715,  // GROSS PT (08/01–08/31) 6-Ascend split $2,413,445 + HNK $39,146 + OSB $129,124 (HNK/OSB held 8/18)
    productionGoal:  2910000,  // = sum of MONTHLY_PROD_GOALS (location sums)
    collections:     1450143,  // ORG-WIDE Deposit Slip (21) full month — all 8 locations actual cash (99.7% of goal)
    collectionsGoal: 1455000,  // = sum of MONTHLY_GOALS (matches bonus board)
    newPatients:        708,   // NP (79) Aug FINAL: LKW131+HNK29+LT57+HNR64+HNS89+OSB81+PB112+PR145
    activePatients:    2531,   // carried
    phoneAnswerRate:    68.4,  // Mango August FINAL full-month pull (9/1) — all 8 locations, 6,862/10,033 answered
    hygieneRecare:     95.3,   // carried from May
    suppliesPct:        5.7,   // Kyle supply-cost data 8/14: $80.6K supply / ~$1.42M coll base (incl OSB ALT DATA)
  },

  locations: [
    // production = GROSS Procedure Charges (PT 08/01–08/31, Aug P/C net split); HNK + OSB = P/C Summary (68) net proxy (held 8/18)
    // collections + collectionRate = ORG-WIDE Deposit Slip (21) full-month actual cash — all 8 (Tiffany's source of truth)
    // activeHygienePatients = Active Patients in Recare (sum of "Active w/ Recare" by location) — CARRIED from BD19 (no recare file in close batch)
    { code:'LKW', production:759309, collections:374322, collectionRate:49.3,  newPatients:131,recareRate:0, phoneAnswerRate: 80, activePatients:534, activeHygienePatients:6098, suppliesPct:5.52, status:'on_pace' },
    { code:'LT',  production:327820, collections:141278, collectionRate:43.1,  newPatients:57, recareRate:0, phoneAnswerRate: 72, activePatients:421, activeHygienePatients:3202, suppliesPct:4.39, status:'on_pace' },
    { code:'HNR', production:187508, collections:126057, collectionRate:67.2,  newPatients:64, recareRate:0, phoneAnswerRate: 71, activePatients:298, activeHygienePatients:1589, suppliesPct:7.37, status:'watch'   },
    { code:'HNS', production:209588, collections:108339, collectionRate:51.7,  newPatients:89, recareRate:0, phoneAnswerRate: 75, activePatients:276, activeHygienePatients:541,  suppliesPct:6.90, status:'on_pace' },
    { code:'HNK', production:39146,  collections:53978,  collectionRate:137.9, newPatients:29, recareRate:0, phoneAnswerRate: 49, activePatients:0,   activeHygienePatients:427,  suppliesPct:7.46, status:'watch'   },
    { code:'PB',  production:600253, collections:275206, collectionRate:45.8,  newPatients:112,recareRate:0, phoneAnswerRate: 66, activePatients:389, activeHygienePatients:942,  suppliesPct:4.08, status:'on_pace' },
    { code:'PR',  production:328967, collections:154474, collectionRate:47.0,  newPatients:145,recareRate:0, phoneAnswerRate: 61, activePatients:321, activeHygienePatients:495,  suppliesPct:8.84, status:'on_pace' },
    { code:'OSB', production:129124, collections:216488, collectionRate:167.7, newPatients:81, recareRate:0, phoneAnswerRate: 69, activePatients:292, activeHygienePatients:1744, suppliesPct:6.11, status:'watch', isOSB:true },
  ],

  // AUGUST FINAL — gross production (Procedure Charges) + collections from ProviderTotals (08/01–08/31 MTD).
  // daysWorked: 21 (full month); prodPerDay = grossProd / 21.
  // King + Brian + Werner (OSB) from P/C Summary (68) net proxy (held 8/18). patientCount = Production per Patient (36) August.
  doctors: [
    { name:'Nichols, Christopher',  locationCode:'LKW', grossProd:429248,collections:168907,collRate:39.3, prodPerDay:20440, daysWorked:21, ytdProd:2666248, patientCount:371, prodPerPatient:1157 },
    { name:'Proctor, Sarah',        locationCode:'PB',  grossProd:292884,collections:137817,collRate:47.1, prodPerDay:13947, daysWorked:21, ytdProd:2064884, patientCount:383, prodPerPatient:765 },
    { name:"Weathers, L'Cris",      locationCode:'PR',  grossProd:281596,collections:104647,collRate:37.2, prodPerDay:13409, daysWorked:21, ytdProd:1800596, patientCount:429, prodPerPatient:656 },
    { name:'Connolly, Noah',        locationCode:'HNS', grossProd:224106,collections:107745,collRate:48.1, prodPerDay:10672, daysWorked:21, ytdProd:1332106, patientCount:349, prodPerPatient:642 },
    { name:'Ballard, Erin',         locationCode:'PB',  grossProd:218766,collections:78606,collRate:35.9, prodPerDay:10417, daysWorked:21, ytdProd:1294766, patientCount:338, prodPerPatient:647 },
    { name:'Nichols, Patrick',      locationCode:'LT',  grossProd:174346,collections:85697,collRate:49.2, prodPerDay:8302,  daysWorked:21, ytdProd:1238346, patientCount:649, prodPerPatient:269 },
    { name:'Chadwick, Evan',        locationCode:'LKW', grossProd:127980,collections:60212,collRate:47.0, prodPerDay:6094,  daysWorked:21, ytdProd:716980,  patientCount:775, prodPerPatient:165 },
    { name:'Skaggs, Ernest',        locationCode:'HNR', grossProd:78617,collections:55624,collRate:70.8, prodPerDay:3744,  daysWorked:21, ytdProd:594617,  patientCount:295, prodPerPatient:266 },
    { name:'Decker Haycraft, Kara', locationCode:'LT',  grossProd:74004,collections:38615,collRate:52.2, prodPerDay:3524,  daysWorked:21, ytdProd:541004,  patientCount:380, prodPerPatient:195 },
    { name:'Gleason, Robert',       locationCode:'HNR', grossProd:57883,collections:33484,collRate:57.8, prodPerDay:2756,  daysWorked:21, ytdProd:508883,  patientCount:311, prodPerPatient:186 },
    { name:'Werner, Andrew',        locationCode:'OSB', grossProd:49706,collections:9235, collRate:18.6, prodPerDay:2367,  daysWorked:21, ytdProd:49706,   patientCount:355, prodPerPatient:140, isOSB:true },
    { name:'Walters, Carrie',       locationCode:'LKW', grossProd:47439,collections:36432,collRate:76.8, prodPerDay:2259,  daysWorked:21, ytdProd:777439,  patientCount:478, prodPerPatient:99 },
    { name:'Osbourne, Brian',       locationCode:'OSB', grossProd:35629,collections:67950,collRate:190.7,prodPerDay:1697,  daysWorked:21, ytdProd:843629,  patientCount:1070,prodPerPatient:33, isOSB:true },
    { name:'King, Susan',           locationCode:'HNK', grossProd:12396,collections:19880,collRate:160.4,prodPerDay:590,   daysWorked:21, ytdProd:157396,  patientCount:211, prodPerPatient:59, isOSB:true },
    { name:'Harvey, Mark',          locationCode:'LKW', grossProd:10568,collections:6843, collRate:64.8, prodPerDay:503,   daysWorked:21, ytdProd:34568,   patientCount:270, prodPerPatient:39 },
  ],

  // AUGUST FINAL — hygienist grossProd + collections from ProviderTotals (08/01–08/31); hoursWorked = Time Clock 08/01–08/31.
  // OSB + HNK hygienists from P/C Summary (68) net proxy (held 8/18). patientCount = Production per Patient (36) August.
  hygienists: [
    // ── LKW ──
    { name:'Woosley, Emily',   locationCode:'LKW', grossProd:24591,collections:13221,collRate:53.8,  hoursWorked:154.03,prodPerHr:160, recareRate:0, patientCount:190,prodPerPatient:129 },
    { name:'Smith, Berlyn',    locationCode:'LKW', grossProd:22718,collections:14022,collRate:61.7,  hoursWorked:138.51,prodPerHr:164, recareRate:0, patientCount:174,prodPerPatient:131 },
    { name:'Miller, Jenna',    locationCode:'LKW', grossProd:21249,collections:10561,collRate:49.7,  hoursWorked:135.25,prodPerHr:157, recareRate:0, patientCount:165,prodPerPatient:129 },
    { name:'Berry, Tasha',     locationCode:'LKW', grossProd:17750,collections:11625,collRate:65.5,  hoursWorked:112.79,prodPerHr:157, recareRate:0, patientCount:176,prodPerPatient:101 },
    { name:'Kimble, Cheryl',   locationCode:'LKW', grossProd:16088,collections:11534,collRate:71.7,  hoursWorked:106.93,prodPerHr:150, recareRate:0, patientCount:162,prodPerPatient:99 },
    { name:'Payne, McKay',     locationCode:'LKW', grossProd:15502,collections:11378,collRate:73.4,  hoursWorked:118.38,prodPerHr:131, recareRate:0, patientCount:171,prodPerPatient:91 },
    { name:'Vowels, Susan',    locationCode:'LKW', grossProd:9174, collections:5522,collRate:60.2,   hoursWorked:70.30,prodPerHr:130, recareRate:0, patientCount:86,prodPerPatient:107 },
    { name:'Murphy, Sherry',   locationCode:'LKW', grossProd:4018, collections:3587,collRate:89.3,   hoursWorked:31.60,prodPerHr:127, recareRate:0, patientCount:57,prodPerPatient:70 },
    { name:'Wright, Chelsea',  locationCode:'LKW', grossProd:1536, collections:1144,collRate:74.5,   hoursWorked:161.02,prodPerHr:10, recareRate:0, patientCount:25,prodPerPatient:61 },
    { name:'Bewley, Emma',     locationCode:'LKW', grossProd:410,  collections:3017,collRate:735.9,  hoursWorked:0,    prodPerHr:0,   recareRate:0, patientCount:41,prodPerPatient:10 },
    // ── LT ──
    { name:'Howell, Dana',     locationCode:'LT',  grossProd:20530,collections:8373,collRate:40.8,  hoursWorked:146.18,prodPerHr:140, recareRate:0, patientCount:166,prodPerPatient:124 },
    { name:'Blandford, Cassi', locationCode:'LT',  grossProd:18211,collections:7216,collRate:39.6,  hoursWorked:143.39,prodPerHr:127, recareRate:0, patientCount:162,prodPerPatient:112 },
    { name:'Harned, Stacy',    locationCode:'LT',  grossProd:15217,collections:5265,collRate:34.6,  hoursWorked:104.37,prodPerHr:146, recareRate:0, patientCount:116,prodPerPatient:131 },
    { name:'Youart, Britney',  locationCode:'LT',  grossProd:8777, collections:2698,collRate:30.7,  hoursWorked:65.06,prodPerHr:135, recareRate:0, patientCount:69,prodPerPatient:127 },
    { name:'Kittle, Jolena',   locationCode:'LT',  grossProd:8339, collections:4787,collRate:57.4,  hoursWorked:65.63,prodPerHr:127, recareRate:0, patientCount:85,prodPerPatient:98 },
    { name:'Buzick, Rebecca',  locationCode:'LT',  grossProd:6414, collections:2977,collRate:46.4,  hoursWorked:43.34,prodPerHr:148, recareRate:0, patientCount:54,prodPerPatient:119 },
    // ── HNR ──
    { name:'Morris, Amber',    locationCode:'HNR', grossProd:24088,collections:8184,collRate:34.0,  hoursWorked:151.23,prodPerHr:159, recareRate:0, patientCount:179,prodPerPatient:135 },
    { name:'Lynch, Cassie',    locationCode:'HNR', grossProd:20408,collections:12235,collRate:60.0, hoursWorked:120.68,prodPerHr:169, recareRate:0, patientCount:174,prodPerPatient:117 },
    // ── HNS ──
    { name:'Logsdon, Megan',   locationCode:'HNS', grossProd:24116,collections:11111,collRate:46.1,  hoursWorked:155.54,prodPerHr:155, recareRate:0, patientCount:143,prodPerPatient:169 },
    // ── HNK (P/C Summary 68 net proxy, held 8/18) ──
    { name:'Miller, Taylor',   locationCode:'HNK', grossProd:8756, collections:5198,collRate:59.4,  hoursWorked:131.67,prodPerHr:66,  recareRate:0, patientCount:157,prodPerPatient:56, isOSB:true },
    { name:'Decker, Heather',  locationCode:'HNK', grossProd:0,    collections:1344,collRate:0,     hoursWorked:13.98,prodPerHr:0,   recareRate:0, patientCount:37,prodPerPatient:0, isOSB:true },
    // ── PB ──
    { name:'Keehan, Joshua',   locationCode:'PB',  grossProd:59594,collections:36542,collRate:61.3, hoursWorked:136.30,prodPerHr:437, recareRate:0, patientCount:268,prodPerPatient:222 },
    // ── PR ──
    { name:'Jones, Chad',      locationCode:'PR',  grossProd:44370,collections:18476,collRate:41.6, hoursWorked:136.69,prodPerHr:325, recareRate:0, patientCount:222,prodPerPatient:200 },
    // ── OSB (P/C Summary 68 net proxy, held 8/18; Ascend cash) ──
    { name:'Ulrich, Leigh',    locationCode:'OSB', grossProd:8316, collections:3805,collRate:45.8, hoursWorked:137.18,prodPerHr:61,  recareRate:0, patientCount:178,prodPerPatient:47, isOSB:true },
    { name:'Culver, Angela',   locationCode:'OSB', grossProd:7841, collections:4251,collRate:54.2, hoursWorked:140.71,prodPerHr:56,  recareRate:0, patientCount:189,prodPerPatient:41, isOSB:true },
    { name:'Haydon, Kelsey',   locationCode:'OSB', grossProd:6796, collections:5005,collRate:73.7, hoursWorked:143.05,prodPerHr:48,  recareRate:0, patientCount:204,prodPerPatient:33, isOSB:true },
    { name:'Yates, Jaclyn',    locationCode:'OSB', grossProd:6571, collections:3187,collRate:48.5, hoursWorked:110.06,prodPerHr:60,  recareRate:0, patientCount:168,prodPerPatient:39, isOSB:true },
    { name:'Smith, Jessica',   locationCode:'OSB', grossProd:4866, collections:2454,collRate:50.4, hoursWorked:89.44,prodPerHr:54,  recareRate:0, patientCount:114,prodPerPatient:43, isOSB:true },
    { name:'Greenwell, Denise',locationCode:'OSB', grossProd:1158, collections:2950,collRate:254.7,hoursWorked:43.28,prodPerHr:27,  recareRate:0, patientCount:88,prodPerPatient:13, isOSB:true },
  ],

  // Mango Voice — August FINAL full-month pull (9/1). Org = 6,862/10,033 = 68.4% (up from July 63.1%).
  //   HNK the floor at 49% (491 missed on 961); LKW strongest at 80%. All rows reconcile (answered + missed = total).
  phones: [
    { code:'LKW', totalCalls:1882, answered:1501, missed:381, answerRate:80, estMissedRevenue:0 },
    { code:'LT',  totalCalls:1043,  answered:755,  missed:288, answerRate:72, estMissedRevenue:0 },
    { code:'HNR', totalCalls:1009,  answered:714,  missed:295, answerRate:71, estMissedRevenue:0 },
    { code:'HNS', totalCalls:702,  answered:525,  missed:177, answerRate:75, estMissedRevenue:0 },
    { code:'HNK', totalCalls:961,  answered:470,  missed:491, answerRate:49, estMissedRevenue:0 },
    { code:'PB',  totalCalls:1566, answered:1040,  missed:526, answerRate:66, estMissedRevenue:0 },
    { code:'PR',  totalCalls:1516, answered:920,  missed:596, answerRate:61, estMissedRevenue:0 },
    { code:'OSB', totalCalls:1354,  answered:937,  missed:417, answerRate:69, estMissedRevenue:0 },
  ],

  // AR — AgedReceivables (85) as of 08/31/2026 EOD — ALL 8 in Ascend (OSB migrated; NO Dental Intel carry).
  // location.total = Net Balance; buckets = Total Balance gross; pcts = report Percentage rows.
  // org net $1,848,487 = Ascend HNDShep summary. healthScore = org d0_30 gross / net (70%).
  // arToProd = AR net ÷ trailing-month (July) production. ⚠ 61-90 bucket ~10.7% ($233K).
  ar: {
    asOf: '08/31/2026',
    healthScore: 70,  // 1,296,433 / 1,848,487 org net
    total: 1848487,
    buckets: { d0_30: 1296433, d31_60: 300990, d61_90: 233098, d90plus: 355839 },
    pcts:    { d0_30: 59.29,   d31_60: 13.77,  d61_90: 10.66,  d90plus: 16.28 },
    arToProdRatio: 0.71,  // $1,848,487 / July $2,597,555 (trailing-month basis)
    locations: [
      { code:'LKW', total:586860, d0_30:367195, d31_60:101495, d61_90:96625, d90plus:180878, pct0_30:49.21, pct31_60:13.60, pct61_90:12.95, pct90plus:24.24, insuranceAR:167772, patientAR:404746, patientPct:71, arToProd:0.91, status:'needs_work' },
      { code:'HNK', total:85778,  d0_30:65380,  d31_60:11873,  d61_90:7617,   d90plus:6016,   pct0_30:71.94, pct31_60:13.06, pct61_90:8.38,  pct90plus:6.62,  insuranceAR:33059,  patientAR:33252,  patientPct:50, arToProd:1.18, status:'good'      },
      { code:'LT',  total:226181, d0_30:163192, d31_60:30527,  d61_90:19934,  d90plus:40898,  pct0_30:64.11, pct31_60:11.99, pct61_90:7.83,  pct90plus:16.07, insuranceAR:93638,  patientAR:43372,  patientPct:32, arToProd:0.80, status:'watch'     },
      { code:'HNR', total:219892, d0_30:143829, d31_60:50308,  d61_90:30650,  d90plus:44344,  pct0_30:53.44, pct31_60:18.69, pct61_90:11.39, pct90plus:16.48, insuranceAR:99419,  patientAR:91903,  patientPct:48, arToProd:1.24, status:'watch'     },
      { code:'HNS', total:45023,  d0_30:39501,  d31_60:12079,  d61_90:1550,   d90plus:8792,   pct0_30:63.79, pct31_60:19.51, pct61_90:2.50,  pct90plus:14.20, insuranceAR:21342,  patientAR:24969,  patientPct:54, arToProd:0.28, status:'good'      },
      { code:'OSB', total:227605, d0_30:141128, d31_60:50723,  d61_90:41982,  d90plus:9447,   pct0_30:58.01, pct31_60:20.85, pct61_90:17.26, pct90plus:3.88,  insuranceAR:91886,  patientAR:82865,  patientPct:47, arToProd:1.03, status:'watch',    isOSB:true },
      { code:'PB',  total:280732, d0_30:240129, d31_60:36546,  d61_90:29059,  d90plus:37073,  pct0_30:70.05, pct31_60:10.66, pct61_90:8.48,  pct90plus:10.81, insuranceAR:127130, patientAR:84695,  patientPct:40, arToProd:0.39, status:'good'      },
      { code:'PR',  total:176414, d0_30:136078, d31_60:7439,   d61_90:5683,   d90plus:28391,  pct0_30:76.62, pct31_60:4.19,  pct61_90:3.20,  pct90plus:15.99, insuranceAR:64930,  patientAR:100030, patientPct:61, arToProd:0.54, status:'watch'     },
    ],
  },
}

// ─── Schedule & Pipeline — AUGUST CLOSE (as of Aug 31, 2026) ───────────
// Month complete — remaining-this-month is $0 (no booked-not-yet-produced left in August).
// futureMonths = Scheduled Production by Month (17), Aug 6 pull — CARRIED (refresh with September launch batch).
export const SCHEDULE_DATA = {
  asOf: 'August 31, 2026',

  // ── Remaining August: month complete, nothing left to produce ──
  remainingThisMonth: {
    daysRemaining:  0,
    scheduledTotal: 0,
    mtdGross:       2581715,    // August FINAL gross production (21 working days)
    monthlyGoal:    2910000,
    locations: [
      { code:'LKW', name:'H&N Lakewood',       dentist:0, hygiene:0, total:0, mtdGross:759309, isOSB:false },
      { code:'PB',  name:'Proctor Bardstown',  dentist:0, hygiene:0, total:0, mtdGross:600253, isOSB:false },
      { code:'PR',  name:'Proctor Radcliff',   dentist:0, hygiene:0, total:0, mtdGross:328967, isOSB:false },
      { code:'LT',  name:'H&N Lincoln Trail',  dentist:0, hygiene:0, total:0, mtdGross:327820, isOSB:false },
      { code:'HNS', name:'H&N Shepherdsville', dentist:0, hygiene:0, total:0, mtdGross:209588, isOSB:false },
      { code:'HNR', name:'H&N Radcliff',       dentist:0, hygiene:0, total:0, mtdGross:187508, isOSB:false },
      { code:'OSB', name:'Osbourne Family',    dentist:0, hygiene:0, total:0, mtdGross:129124, isOSB:true  },
      { code:'HNK', name:'H&N King',           dentist:0, hygiene:0, total:0, mtdGross:39146,  isOSB:false },
    ],
  },

  // ── Future Months — Scheduled Production by Month (17), Aug 6 pull (whole-month scheduled gross by location) — CARRIED ──
  futureMonths: [
    {
      month: 'Sep 2026',
      key: 'sep-2026',
      monthlyGoal:    2910000,
      approxBizDays:  21,
      scheduledTotal: 902843,
      earlySchedulingNote: 'Next month — bookings filling; open chair time remains',
      locations: [
        { code:'PR',  name:'Proctor Radcliff',   total:253753, isOSB:false },
        { code:'LKW', name:'H&N Lakewood',       total:224460, isOSB:false },
        { code:'PB',  name:'Proctor Bardstown',  total:114210, isOSB:false },
        { code:'OSB', name:'Osbourne Family',    total:92043,  isOSB:true  },
        { code:'LT',  name:'H&N Lincoln Trail',  total:88793,  isOSB:false },
        { code:'HNK', name:'H&N King',           total:58530,  isOSB:false },
        { code:'HNR', name:'H&N Radcliff',       total:48244,  isOSB:false },
        { code:'HNS', name:'H&N Shepherdsville', total:22809,  isOSB:false },
      ],
    },
    {
      month: 'Oct 2026',
      key: 'oct-2026',
      monthlyGoal:    2910000,
      approxBizDays:  22,
      scheduledTotal: 550964,
      earlySchedulingNote: 'T-30 days — earliest bookings only',
      locations: [
        { code:'LKW', name:'H&N Lakewood',       total:167184, isOSB:false },
        { code:'OSB', name:'Osbourne Family',    total:88240,  isOSB:true  },
        { code:'LT',  name:'H&N Lincoln Trail',  total:73142,  isOSB:false },
        { code:'PR',  name:'Proctor Radcliff',   total:65043,  isOSB:false },
        { code:'PB',  name:'Proctor Bardstown',  total:50947,  isOSB:false },
        { code:'HNR', name:'H&N Radcliff',       total:40558,  isOSB:false },
        { code:'HNK', name:'H&N King',           total:37962,  isOSB:false },
        { code:'HNS', name:'H&N Shepherdsville', total:27888,  isOSB:false },
      ],
    },
    {
      month: 'Nov 2026',
      key: 'nov-2026',
      monthlyGoal:    2910000,
      approxBizDays:  20,
      scheduledTotal: 389957,
      earlySchedulingNote: 'T-61 days — earliest bookings only',
      locations: [
        { code:'LKW', name:'H&N Lakewood',       total:135216, isOSB:false },
        { code:'OSB', name:'Osbourne Family',    total:61926,  isOSB:true  },
        { code:'LT',  name:'H&N Lincoln Trail',  total:55486,  isOSB:false },
        { code:'HNR', name:'H&N Radcliff',       total:43611,  isOSB:false },
        { code:'PR',  name:'Proctor Radcliff',   total:38254,  isOSB:false },
        { code:'PB',  name:'Proctor Bardstown',  total:23990,  isOSB:false },
        { code:'HNS', name:'H&N Shepherdsville', total:15918,  isOSB:false },
        { code:'HNK', name:'H&N King',           total:15555,  isOSB:false },
      ],
    },
  ],

  // ── Provider Schedule — CARRIED (by-provider monthly file pending). Amounts = sum of all locations per provider. ──
  providerSchedule: [
    { name:'Nichols, Christopher',  specialty:'Dentist',    locationCode:'LKW', isOSB:false, months:{ Jun:118797, Jul:17158,  Aug:14719  } },
    { name:"Weathers, L'Cris",      specialty:'Dentist',    locationCode:'PR',  isOSB:false, months:{ Jun:399262, Jul:17225,  Aug:2225   } },
    { name:'Proctor, Sarah',        specialty:'Dentist',    locationCode:'PB',  isOSB:false, months:{ Jun:150495, Jul:38816,  Aug:19052  } },
    { name:'Ballard, Erin',         specialty:'Dentist',    locationCode:'PB',  isOSB:false, months:{ Jun:48771,  Jul:4631,   Aug:882    } },
    { name:'Connolly, Noah',        specialty:'Dentist',    locationCode:'HNS', isOSB:false, months:{ Jun:52289,  Jul:11396,  Aug:7349   } },
    { name:'Nichols, Patrick',      specialty:'Dentist',    locationCode:'LT',  isOSB:false, months:{ Jun:43287,  Jul:11737,  Aug:6507   } },
    { name:'Walters, Carrie',       specialty:'Dentist',    locationCode:'LKW', isOSB:false, months:{ Jun:30968,  Jul:1805,   Aug:408    } },
    { name:'Skaggs, Ernest',        specialty:'Dentist',    locationCode:'HNR', isOSB:false, months:{ Jun:51295,  Jul:914,    Aug:1890   } },
    { name:'Osbourne, Brian',       specialty:'Dentist',    locationCode:'OSB', isOSB:true,  months:{ Jun:189413, Jul:91784,  Aug:59056  } },
    { name:'Gleason, Robert',       specialty:'Dentist',    locationCode:'HNR', isOSB:false, months:{ Jun:19737,  Jul:4406,   Aug:1414   } },
    { name:'Chadwick, Evan',        specialty:'Dentist',    locationCode:'LKW', isOSB:false, months:{ Jun:15703,  Jul:6627,   Aug:4850   } },
    { name:'Decker Haycraft, Kara', specialty:'Dentist',    locationCode:'LT',  isOSB:false, months:{ Jun:19977,  Jul:3685,   Aug:1119   } },
    { name:'King, Susan',           specialty:'Dentist',    locationCode:'HNK', isOSB:false, months:{ Jun:77908,  Jul:5544,   Aug:1498   } },
    { name:'Harvey, Mark',          specialty:'Dentist',    locationCode:'LKW', isOSB:false, months:{ Jun:0,      Jul:190,    Aug:0      } },
    { name:'Berry, Tasha',          specialty:'Hygienist',  locationCode:'LKW', isOSB:false, months:{ Jun:18384,  Jul:15541,  Aug:19941  } },
    { name:'Bewley, Emma',          specialty:'Hygienist',  locationCode:'LKW', isOSB:false, months:{ Jun:13669,  Jul:9505,   Aug:2383   } },
    { name:'Blandford, Cassi',      specialty:'Hygienist',  locationCode:'LT',  isOSB:false, months:{ Jun:16621,  Jul:17756,  Aug:15260  } },
    { name:'Buzick, Rebecca',       specialty:'Hygienist',  locationCode:'LT',  isOSB:false, months:{ Jun:3864,   Jul:7849,   Aug:3637   } },
    { name:'Harned, Stacy',         specialty:'Hygienist',  locationCode:'LT',  isOSB:false, months:{ Jun:11203,  Jul:10679,  Aug:9797   } },
    { name:'Howell, Dana',          specialty:'Hygienist',  locationCode:'LT',  isOSB:false, months:{ Jun:15724,  Jul:14581,  Aug:17173  } },
    { name:'Jones, Chad',           specialty:'Hygienist',  locationCode:'PR',  isOSB:false, months:{ Jun:58177,  Jul:34518,  Aug:34860  } },
    { name:'Keehan, Joshua',        specialty:'Hygienist',  locationCode:'PB',  isOSB:false, months:{ Jun:78036,  Jul:44576,  Aug:32204  } },
    { name:'Kimble, Cheryl',        specialty:'Hygienist',  locationCode:'LKW', isOSB:false, months:{ Jun:18579,  Jul:21143,  Aug:11866  } },
    { name:'Kittle, Jolena',        specialty:'Hygienist',  locationCode:'LT',  isOSB:false, months:{ Jun:12020,  Jul:10897,  Aug:7213   } },
    { name:'Logsdon, Megan',        specialty:'Hygienist',  locationCode:'HNS', isOSB:false, months:{ Jun:12666,  Jul:10059,  Aug:9221   } },
    { name:'Lynch, Cassie',         specialty:'Hygienist',  locationCode:'HNR', isOSB:false, months:{ Jun:20357,  Jul:21681,  Aug:13394  } },
    { name:'Miller, Jenna',         specialty:'Hygienist',  locationCode:'LKW', isOSB:false, months:{ Jun:5196,   Jul:17609,  Aug:17072  } },
    { name:'Miller, Taylor',        specialty:'Hygienist',  locationCode:'HNK', isOSB:false, months:{ Jun:5584,   Jul:0,      Aug:28692  } },
    { name:'Decker, Heather',       specialty:'Hygienist',  locationCode:'HNK', isOSB:false, months:{ Jun:2471,   Jul:911,    Aug:9468   } },
    { name:'Morris, Amber',         specialty:'Hygienist',  locationCode:'HNR', isOSB:false, months:{ Jun:24787,  Jul:14074,  Aug:17959  } },
    { name:'Murphy, Sherry',        specialty:'Hygienist',  locationCode:'LKW', isOSB:false, months:{ Jun:290,    Jul:0,      Aug:1857   } },
    { name:'Payne, McKay',          specialty:'Hygienist',  locationCode:'LKW', isOSB:false, months:{ Jun:15016,  Jul:18352,  Aug:11538  } },
    { name:'Smith, Berlyn',         specialty:'Hygienist',  locationCode:'LKW', isOSB:false, months:{ Jun:17805,  Jul:22716,  Aug:15012  } },
    { name:'Vowels, Susan',         specialty:'Hygienist',  locationCode:'LKW', isOSB:false, months:{ Jun:15574,  Jul:7875,   Aug:7879   } },
    { name:'Woosley, Emily',        specialty:'Hygienist',  locationCode:'LKW', isOSB:false, months:{ Jun:17627,  Jul:22372,  Aug:18625  } },
    { name:'Wright, Chelsea',       specialty:'Hygienist',  locationCode:'LKW', isOSB:false, months:{ Jun:14561,  Jul:14043,  Aug:6873   } },
    { name:'Youart, Britney',       specialty:'Hygienist',  locationCode:'LT',  isOSB:false, months:{ Jun:10106,  Jul:5350,   Aug:7535   } },
    { name:'Culver, Angela',        specialty:'Hygienist',  locationCode:'OSB', isOSB:true,  months:{ Jun:264,    Jul:1610,   Aug:2027   } },
    { name:'Greenwell, Denise',     specialty:'Hygienist',  locationCode:'OSB', isOSB:true,  months:{ Jun:1320,   Jul:625,    Aug:1733   } },
    { name:'Haydon, Kelsey',        specialty:'Hygienist',  locationCode:'OSB', isOSB:true,  months:{ Jun:2501,   Jul:1402,   Aug:1336   } },
    { name:'Smith, Jessica',        specialty:'Hygienist',  locationCode:'OSB', isOSB:true,  months:{ Jun:252,    Jul:1380,   Aug:1036   } },
    { name:'Ulrich, Leigh',         specialty:'Hygienist',  locationCode:'OSB', isOSB:true,  months:{ Jun:9377,   Jul:1380,   Aug:3816   } },
    { name:'Yates, Jaclyn',         specialty:'Hygienist',  locationCode:'OSB', isOSB:true,  months:{ Jun:0,      Jul:0,      Aug:1138   } },
  ],
}

// ─── DAILY LEADERBOARD — single-day gross production (Procedure Charges) ──────
// Source: MTD 8/31 − MTD 8/28 = the 8/31 single day (Monday close; 8/29–30 weekend). ALL producers (no top-N cap).
// OSB/King/Brian not in the single-day Ascend view → absent.
export const DAILY_LEADERBOARD = {
  date:      'August 31, 2026',
  dateShort: 'Mon 8/31',
  // 8/31 single day (gross Procedure Charges) — derived from MTD 8/31 minus MTD 8/28.
  doctors: [
    { name:'Proctor, Sarah',        locationCode:'PB',  dailyProd:25412 },
    { name:'Ballard, Erin',         locationCode:'PB',  dailyProd:13770 },
    { name:'Nichols, Patrick',      locationCode:'LT',  dailyProd:13526 },
    { name:'Nichols, Christopher',  locationCode:'LKW', dailyProd:13525 },
    { name:"Weathers, L'Cris",      locationCode:'PR',  dailyProd:12655 },
    { name:'Chadwick, Evan',        locationCode:'LKW', dailyProd:12040 },
    { name:'Connolly, Noah',        locationCode:'HNS', dailyProd:5588  },
    { name:'Decker Haycraft, Kara', locationCode:'LT',  dailyProd:5045  },
    { name:'Walters, Carrie',       locationCode:'LKW', dailyProd:3838  },
    { name:'Skaggs, Ernest',        locationCode:'HNR', dailyProd:2196  },
    { name:'Harvey, Mark',          locationCode:'LKW', dailyProd:504   },
    { name:'Gleason, Robert',       locationCode:'HNR', dailyProd:206   },
  ],
  hygienists: [
    { name:'Keehan, Joshua',   locationCode:'PB',  dailyProd:8408 },
    { name:'Jones, Chad',      locationCode:'PR',  dailyProd:2369 },
    { name:'Smith, Berlyn',    locationCode:'LKW', dailyProd:1726 },
    { name:'Miller, Jenna',    locationCode:'LKW', dailyProd:1574 },
    { name:'Berry, Tasha',     locationCode:'LKW', dailyProd:1413 },
    { name:'Morris, Amber',    locationCode:'HNR', dailyProd:1360 },
    { name:'Harned, Stacy',    locationCode:'LT',  dailyProd:1132 },
    { name:'Kimble, Cheryl',   locationCode:'LKW', dailyProd:1125 },
    { name:'Logsdon, Megan',   locationCode:'HNS', dailyProd:1118 },
    { name:'Howell, Dana',     locationCode:'LT',  dailyProd:1006 },
    { name:'Woosley, Emily',   locationCode:'LKW', dailyProd:857  },
    { name:'Blandford, Cassi', locationCode:'LT',  dailyProd:851  },
    { name:'Youart, Britney',  locationCode:'LT',  dailyProd:603  },
  ],
}

// ─── Remaining-month scheduled production BY PROVIDER — month complete (Aug 31), nothing left booked in-month ──
export const REMAINING_SCHEDULE_BY_PROVIDER: Record<string, number> = {}
