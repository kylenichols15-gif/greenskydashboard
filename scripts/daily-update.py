# Daily MTD update generator — regenerates lib/data.ts for the current live month from Downloads CSVs.
# EDIT PER RUN (top): 7 input filenames, BD, PH{} phones, ASOF_* dates, header date strings.
# Add confirmed NEW providers (not in frozen-Aug roster) to SUPPLEMENTAL[] so they appear on the board.
# ytd base + roster + location stock come from the FROZEN prior month so re-runs never double-count.
# Run: python3 scripts/daily-update.py  (writes lib/data.ts, prints validation). Then npm run build && git push.

import csv,re,sys
D="/Users/kylenichols/Downloads"
ROOT="/Users/kylenichols/dev/greenskydashboard-app"
def num(s):
    s=(s or "").replace('​','').replace(',','').replace('$','').strip()
    if s in('','-'):return 0.0
    n=s.startswith('-');s=s.replace('-','')
    try:v=float(s)
    except:return 0.0
    return -v if n else v
def key(nm):
    nm=re.sub(r'\s*-\s*[^-]+$','',nm.replace('​','').replace('~Production','').replace('~Collection','').replace('~Patient Count','').strip())
    nm=re.sub(r'\([^)]*\)','',nm)  # drop parentheticals e.g. (MED)
    p=[x.strip() for x in nm.split(',')]
    last=re.sub(r'\s+(dmd|md|rdh|dds)\.?$','',p[0].lower().strip())  # strip credential from last name
    first=p[1].split()[0].lower() if len(p)>1 and p[1].split() else ''
    return (last, first)
LNAME={'Harvey and Nichols Family Dentistry':'LKW','Harvey and Nichols King':'HNK','Harvey and Nichols Lincoln Trail':'LT','Harvey and Nichols Radcliff PLLC':'HNR','Harvey and Nichols Shepherdsville PLLC':'HNS','Osbourne Family Dental':'OSB','Proctor Family Dental Bardstown':'PB','Proctor Family Dental Radcliff':'PR'}
LORDER=['LKW','LT','HNR','HNS','HNK','PB','PR','OSB']
LNAME_DISP={'LKW':'H&N Lakewood','LT':'H&N Lincoln Trail','HNR':'H&N Radcliff','HNS':'H&N Shepherdsville','HNK':'H&N King','PB':'Proctor Bardstown','PR':'Proctor Radcliff','OSB':'Osbourne Family'}
A6={'LKW','LT','HNR','HNS','PB','PR'}
BD=8  # November BD thru 11/11 (Nov 2,3,4,5,6,9,10,11). Nov 2026 TOTAL biz days = 19 (21 weekdays − Thanksgiving Thu 11/26 + Fri 11/27 closed; open Veterans Day 11/11).
TOTAL_BD=19
# 'as of' dates for metrics NOT refreshed daily (bump when you re-pull each):
ASOF_PHONES='Nov 11'   # Mango answer rate — FRESH November MTD paste (Kyle, 11/11)
ASOF_SUPPLIES='Nov pending (Sep booked)'  # supply-cost %: Nov blank until books close; Aug/Sep booked from Financials sheet
ASOF_HYGIENE='Oct 30'   # active hygiene (recare) patients — location-grouped pull 10/30 — CARRIED into Nov
# Active hygiene patients = 'Active w/ Recare' from the Active Patients in Recare report — LOCATION-GROUPED (deduped;
# the by-provider version overcounts). 10/30 pull grand total 15,217 (matches report). Refresh when re-pulled:
RECARE={'LKW':5198,'HNK':636,'LT':2983,'HNR':1540,'HNS':605,'OSB':2672,'PB':996,'PR':633}
# Monthly new-patient goal per office (Kyle, 10/7). Carried every month until changed.
NPGOAL={'LKW':120,'PB':120,'PR':80,'HNR':80,'HNS':40,'HNK':40,'LT':80,'OSB':80}

# ---------- ProviderTotals 9/8 ----------
pt=list(csv.reader(open(f"{D}/ProviderTotals (23).csv",encoding="utf-8-sig")))  # 11/01-11/11, All providers incl King+OSB
ptg={};ptc={}
for r in pt[12:]:
    if not r or not r[0].strip() or r[0].strip()=='Provider Totals':continue
    k=key(r[0]);ptg[k]=ptg.get(k,0)+num(r[2]);ptc[k]=ptc.get(k,0)+abs(num(r[6]))
PT_GRAND=sum(ptg.values())

# ---------- P/C Summary (3) — used ONLY for per-provider→location split weights (all 8) ----------
pc=list(csv.reader(open(f"{D}/Production , Collection Summary (10).csv",encoding="utf-8-sig")))
hdr=pc[0];pcols=[(i,h) for i,h in enumerate(hdr) if h.endswith('~Production')]
gtP=[i for i,h in enumerate(hdr) if h=='Grand Total~Production'][0];gtC=gtP+1
# Build per-provider→location production weights for a given month. FRESH Nov weights are primary; Oct is the
# fallback for providers who have no Nov P/C row yet (MTD timing) so they don't dump to the LKW catch-all.
def build_ploc(month):
    d={}
    for r in pc[1:]:
        if not(len(r)>2 and r[0].strip()=='2026' and r[1].strip()==month):continue
        code=LNAME.get(r[2].strip())
        if not code:continue
        for i,h in pcols:
            if h=='Grand Total~Production':continue
            v=num(r[i]);k=key(h)
            if abs(v)>0.005:
                d.setdefault(k,{});d[k][code]=d[k].get(code,0)+v
    return d
ploc=build_ploc('Nov')       # primary (P/C 9, 11/10) — Vong→PB, Wofford→HNK
ploc_oct=build_ploc('Oct')   # fallback for providers absent from partial Nov

# ---------- PPP 38 (patient counts) ----------
ppp=list(csv.reader(open(f"{D}/Production per Patient (21).csv",encoding="utf-8-sig")))
ph=ppp[0];pccols=[(i,ph[i]) for i in range(len(ph)) if ph[i].endswith('~Patient Count')]
sepp=[r for r in ppp[1:] if len(r)>2 and r[0].strip()=='2026' and r[1].strip()=='Nov']
patients={}
for r in sepp:
    for i,h in pccols:
        if h.startswith('Grand Total'):continue
        v=r[i].replace('​','').strip()
        if v not in('','-'):
            try:patients[key(h)]=patients.get(key(h),0)+int(float(v))
            except:pass

# ---------- Timeclock 9/8 ----------
tc=list(csv.reader(open(f"{D}/Time clock summary 11-01-2026 - 11-11-2026.csv")))
hours={}
for r in tc[1:]:
    if len(r)<5:continue
    k=(r[0].strip().lower(), r[1].strip().split()[0].lower() if r[1].strip() else '')
    try:hours[k]=hours.get(k,0)+float(r[4])
    except:pass

# ---------- DepositSlip 26 (MTD collections by location) ----------
coll={}
dr=csv.reader(open(f"{D}/DepositSlip (46).csv",encoding="utf-8-sig"));seen=False  # 11/01-11/30 MTD (actual cash thru 11/11); (47)=single-day companion
for row in dr:
    if not row or len(row)<12:continue
    if row[0].strip().startswith("Transaction Date"):seen=True;continue
    if not seen:continue
    loc=row[1].replace('​','').strip()
    if loc in LNAME:
        try:coll[LNAME[loc]]=coll.get(LNAME[loc],0)+float(row[11].replace('​','').strip())
        except:pass

# ---------- New Patients 81 (Sept) ----------
npd={}
for r in list(csv.reader(open(f"{D}/New Patients all offices (19).csv")))[1:]:
    if len(r)<3 or r[1].strip()!='Nov':continue
    c=LNAME.get(r[0].strip())
    if c:npd[c]=int(r[2])

# ---------- phones (Kyle, Sept MTD ~9/5) ----------
PH={'HNK':(313,249,64,80),'HNR':(436,354,82,81),'PR':(687,259,428,38),'LKW':(742,568,174,77),
    'LT':(368,293,75,80),'PB':(592,419,173,71),'OSB':(520,374,146,72),'HNS':(336,243,93,72)}

# ---------- location GROSS split: PT gross allocated across ALL 8 locations by P/C loc weights ----------
# ProviderTotals now includes King + Osbourne providers (Providers: All included), so all 8 unify on GROSS
# Procedure Charges. P/C Summary is used ONLY for the per-provider→location split weights (ties to PT grand).
import collections as C
A8=set(LORDER)
# New providers absent from the carried Oct P/C split weights -> assign full gross to their known location.
# (Without this a new provider's gross would dump to the LKW fallback.) Add new hires here each month.
NEWPROV_LOC={}  # (Vong retired 11/10 — now in fresh Nov P/C weights, maps to PB automatically. Add new hires here if they appear in PT before P/C.)
locgross=C.defaultdict(float)
_unmapped=[]
for k,g in ptg.items():
    w={a:b for a,b in ploc.get(k,{}).items() if a in A8 and b>0}           # 1) fresh Nov weight
    if not w: w={a:b for a,b in ploc_oct.get(k,{}).items() if a in A8 and b>0}  # 2) Oct weight (MTD timing gap)
    t=sum(w.values())
    if t>0:
        for a,b in w.items():locgross[a]+=g*b/t
    else:
        loc=NEWPROV_LOC.get(k,'LKW')  # 3) known new-hire loc, else LKW catch-all
        locgross[loc]+=g
        if abs(g)>500: _unmapped.append((k,round(g),loc))
locprod={c:round(locgross[c]) for c in LORDER}
ORG_PROD=sum(locprod.values())
if _unmapped:
    print("!! UNMAPPED providers (no Nov/Oct P/C weight) >$500 — assigned to fallback loc; add to NEWPROV_LOC if wrong:")
    for k,g,loc in sorted(_unmapped,key=lambda x:-abs(x[1])): print(f"   {k} ${g:,} -> {loc}")

# ---------- carry: constants/futureMonths/providerSchedule from current data.ts;
#            ytd base + roster + location stock from FROZEN August (so daily re-run never double-counts) ----------
src=open(f"{ROOT}/lib/data.ts").read()
base=open(f"{ROOT}/lib/months/2026-10.ts").read()
# carry_head = everything before PERIOD_INFO, minus the trailing period-header comment block
_ch=src[:src.index('export const PERIOD_INFO')].rstrip().split('\n')
while _ch and _ch[-1].lstrip().startswith('//'): _ch.pop()
carry_head='\n'.join(_ch)+'\n\n'
def augloc_field(code,field):  # August (frozen) location stock + trailing production
    m=re.search(r"\{\s*code:['\"]"+code+r"['\"],[^}]*?"+field+r":([0-9.]+)",base)
    return m.group(1) if m else '0'
augrows={}
for m in re.finditer(r"\{\s*name:(['\"])(.*?)\1,\s*locationCode:['\"](\w+)['\"],\s*grossProd:[^}]*?\}",base):
    seg=m.group(0);nm=m.group(2)
    ytdm=re.search(r'ytdProd:(\d+)',seg)
    augrows[key(nm)]=dict(name=nm,loc=m.group(3),ytd=int(ytdm.group(1)) if ytdm else 0,
                          osb='isOSB:true' in seg, spec='Hygienist' if 'hoursWorked' in seg else 'Dentist')
fm=src[src.index('  // ── Future Months'):src.index('  providerSchedule:')]
ps_block=src[src.index('providerSchedule: ['):src.index('  ],\n}\n\n// ─── DAILY')]

# Confirmed real providers NOT in the frozen-Aug roster (new hires; often P/C-only, absent from ProviderTotals).
# Sourced from P/C Summary. ytd0 = production before the current month (0 if brand new).
SUPPLEMENTAL=[
    {'k':('bone','victoria'),  'name':'Bone, Victoria',  'loc':'PR',  'spec':'Dentist',   'osb':False, 'ytd0':0},       # Tori Bone, new PR dentist (Kyle 9/10)
    {'k':('morgan','kennedy'), 'name':'Morgan, Kennedy', 'loc':'PB',  'spec':'Dentist',   'osb':False, 'ytd0':113421},  # PB dentist, P/C-only (confirmed via DH schedule)
    {'k':('ferguson','amie'),  'name':'Ferguson, Amie',  'loc':'LKW', 'spec':'Hygienist', 'osb':False, 'ytd0':25834},   # LKW hygienist, P/C-only
    {'k':('spencer','rachel'), 'name':'Spencer, Rachel', 'loc':'HNR', 'spec':'Hygienist', 'osb':False, 'ytd0':11490},   # HNR hygienist, P/C-only
    {'k':('vong','harrison'),  'name':'Vong, Harrison',  'loc':'PB',  'spec':'Dentist',   'osb':False, 'ytd0':0},       # Dr. Harrison Vong, NEW PB dentist (started wk of 11/3; Kyle 11/5)
]

# ---------- build providers ----------
def loc6(k):
    w={a:b for a,b in ploc.get(k,{}).items() if a in A6 and b>0}
    return max(w,key=w.get) if w else (augrows[k]['loc'] if k in augrows else None)
def locHO(k):
    w={a:b for a,b in ploc.get(k,{}).items() if a in('HNK','OSB') and b>0}
    return max(w,key=w.get) if w else None
docs=[];hygs=[];added=set()
# Roster = curated August real providers only (excludes Dentrix entity/placeholder accounts).
# All providers (incl King/OSB) now carry GROSS Procedure Charges from the unified ProviderTotals.
for k,ar in augrows.items():
    g=ptg.get(k,0);c=ptc.get(k,0)
    if abs(g)<0.5 and c<0.5:  # no September activity — drop from board
        continue
    row=dict(name=ar['name'],loc=ar['loc'],g=round(g),c=round(c),ytd=ar['ytd']+round(g),
             pat=patients.get(k,0),hrs=round(hours.get(k,0),2),osb=ar['osb'])
    (docs if ar['spec']=='Dentist' else hygs).append(row);added.add(k)
for sp in SUPPLEMENTAL:                       # confirmed providers absent from frozen-Aug roster
    k=sp['k']
    if k in added: continue
    g=ptg.get(k,0);c=ptc.get(k,0)
    if abs(g)<0.5 and c<0.5: continue
    row=dict(name=sp['name'],loc=sp['loc'],g=round(g),c=round(c),ytd=sp['ytd0']+round(g),
             pat=patients.get(k,0),hrs=round(hours.get(k,0),2),osb=sp['osb'])
    (docs if sp['spec']=='Dentist' else hygs).append(row)
docs.sort(key=lambda r:-r['g']);hygs.sort(key=lambda r:-r['g'])

def esc(n):
    return '"'+n+'"' if "'" in n else "'"+n+"'"
def drow(r):
    cr=round(r['c']/r['g']*100,1) if r['g'] else 0
    ppd=round(r['g']/BD)
    ppp_=round(r['g']/r['pat']) if r['pat'] else 0
    osb=', isOSB:true' if r['osb'] else ''
    return (f"    {{ name:{esc(r['name'])}, locationCode:'{r['loc']}', grossProd:{r['g']},collections:{r['c']},"
            f"collRate:{cr}, prodPerDay:{ppd}, daysWorked:{BD}, ytdProd:{r['ytd']}, patientCount:{r['pat']}, prodPerPatient:{ppp_}{osb} }},")
def hrow(r):
    cr=round(r['c']/r['g']*100,1) if r['g'] else 0
    pph=round(r['g']/r['hrs']) if r['hrs'] else 0
    ppp_=round(r['g']/r['pat']) if r['pat'] else 0
    osb=', isOSB:true' if r['osb'] else ''
    return (f"    {{ name:{esc(r['name'])}, locationCode:'{r['loc']}', grossProd:{r['g']},collections:{r['c']},"
            f"collRate:{cr}, hoursWorked:{r['hrs']},prodPerHr:{pph}, recareRate:0, patientCount:{r['pat']}, prodPerPatient:{ppp_}{osb} }},")

# ---------- locations ----------
def locrow(c):
    p=locprod[c];cl=round(coll.get(c,0));cr=round(cl/p*100,1) if p else 0
    osb=", isOSB:true" if c=='OSB' else ""
    ap=augloc_field(c,'activePatients');ahp=RECARE.get(c, augloc_field(c,'activeHygienePatients'));sp=0  # Oct supply blank until books close (per Kyle 10/30)
    ph=PH[c][3]
    st='watch' if (c in('HNK',) or cr<40) else 'on_pace'
    return (f"    {{ code:'{c}', production:{p}, collections:{cl}, collectionRate:{cr}, newPatients:{npd.get(c,0)}, newPatientsGoal:{NPGOAL.get(c,0)}, "
            f"recareRate:0, phoneAnswerRate: {ph}, activePatients:{ap}, activeHygienePatients:{ahp}, suppliesPct:{sp}, status:'{st}'{osb} }},")

# ---------- AR from AgedReceivables 87 ----------
arloc={};cur=None
for l in open(f"{D}/AgedReceivables (24).csv",encoding='utf-8'):
    m=re.match(r'^(.*?) - Location Aged Totals',l)
    if m:cur=LNAME.get(m.group(1).strip());arloc[cur]={} if cur else None;continue
    if l.startswith('HNDShep - Summary'):cur='ORG';arloc['ORG']={};continue
    if cur is None or not l.strip():continue
    cells=next(csv.reader([l]))
    if not cells or not cells[0].strip():continue
    k0=cells[0].replace(',','').strip();d=arloc[cur]
    if k0.startswith('Total Balance') and 'g0' not in d and len(cells)>=8:
        d['g0'],d['g31'],d['g61'],d['g90'],d['gtot']=[num(x) for x in cells[1:6]];d['net']=num(cells[7])
    elif k0.startswith('Insurance Portion') and 'ins' not in d and len(cells)>=6:d['ins']=num(cells[5])
    elif k0.startswith('Guarantor Portion') and 'guar' not in d and len(cells)>=6:d['guar']=num(cells[5])
# trailing production (Aug) per loc for arToProd
augprod={c:num(augloc_field(c,'production')) for c in LORDER}
def arrow(c):
    d=arloc.get(c,{});tot=d.get('gtot',0)
    def pct(x):return round(x/tot*100,2) if tot else 0
    net=round(d.get('net',tot));ins=round(d.get('ins',0));pat=round(tot-ins)
    patpct=round(pat/tot*100) if tot else 0
    a2p=round(net/augprod.get(c,1),2) if augprod.get(c,0) else 0
    st='good' if pct(d.get('g0',0))>65 else ('watch' if pct(d.get('g0',0))>50 else 'needs_work')
    osb=", isOSB:true" if c=='OSB' else ""
    return (f"      {{ code:'{c}', total:{net}, d0_30:{round(d.get('g0',0))}, d31_60:{round(d.get('g31',0))}, d61_90:{round(d.get('g61',0))}, d90plus:{round(d.get('g90',0))}, "
            f"pct0_30:{pct(d.get('g0',0))}, pct31_60:{pct(d.get('g31',0))}, pct61_90:{pct(d.get('g61',0))}, pct90plus:{pct(d.get('g90',0))}, "
            f"insuranceAR:{ins}, patientAR:{pat}, patientPct:{patpct}, arToProd:{a2p}, status:'{st}'{osb} }},")
# Org AR: use HNDShep summary if present, else synthesize by summing the 8 location dicts
# (AgedReceivables pulled without the Organization row omits the summary block).
org=arloc.get('ORG',{})
if not org:
    org={f:sum(arloc.get(c,{}).get(f,0) for c in LORDER) for f in ('g0','g31','g61','g90','gtot','net','ins','guar')}
org_net=round(org.get('net',0));org_tot=org.get('gtot',1)
org_b={'d0_30':round(org.get('g0',0)),'d31_60':round(org.get('g31',0)),'d61_90':round(org.get('g61',0)),'d90plus':round(org.get('g90',0))}
def opct(x):return round(x/org_tot*100,2) if org_tot else 0

# ---------- collections/NP/phones org ----------
ORG_COLL=round(sum(coll.values()));ORG_NP=sum(npd.values())
tot_calls=sum(PH[c][0] for c in PH);ans=sum(PH[c][1] for c in PH)
ORG_PHONE=round(ans/tot_calls*100,1)

# ---------- assemble DEMO_DATA + others ----------
def phrow(c):
    t,a,m,r=PH[c];return f"    {{ code:'{c}', totalCalls:{t}, answered:{a}, missed:{m}, answerRate:{r}, estMissedRevenue:0 }},"

# remainingThisMonth locations (mtdGross by loc)
def remrow(c):
    osb='true ' if c=='OSB' else 'false'
    return f"      {{ code:'{c}', name:'{LNAME_DISP[c]}', dentist:0, hygiene:0, total:0, mtdGross:{locprod[c]}, isOSB:{osb} }},"

# DH scheduled-remaining per provider — feeds remainingThisMonth.scheduledTotal + REMAINING_SCHEDULE_BY_PROVIDER.
dh=list(csv.reader(open(f"{D}/DH Scheduled Production - Remaining Month (13).csv")))
sched={}
for r in dh[1:]:
    if len(r)<4 or 'Total' in r[0]:continue
    sched[key(r[2])]=sched.get(key(r[2]),0)+round(num(r[3]))
# providerSchedule is a FORWARD 3-month view (Dec/Jan/Feb) carried VERBATIM from data.ts; refreshed only when
# Kyle drops a new "#2 Next Month Scheduled Production.csv" (rebuild via scripts rebuild_ps.py). No daily rewrite.

REMAIN=sum(sched.values())

header=f"""// November 2026 — BD{BD} of {TOTAL_BD} (as of Nov 11; Nov 2026 = 19 biz days: 21 weekdays − Thanksgiving Thu 11/26 + Fri 11/27).
// October 2026 FINAL frozen at lib/months/2026-10.ts (prod $2,964,078 · coll $1,409,485 · 663 NP).
// Production: ALL 8 locations = ProviderTotals (23) (11/01–11/11, Providers: All included) GROSS Procedure Charges
//   ${PT_GRAND:,.0f}, split to location by FRESH Nov P/C-Summary(10) per-provider weights (ties to PT grand).
//   King + Osbourne unified on GROSS. Vong (PB) + Wofford (HNK) in Nov P/C — no manual mapping. ORG production ${ORG_PROD:,}.
// COLLECTIONS = DepositSlip (46) 11/01–11/11 MTD by location (source of truth). Org ${ORG_COLL:,}.
// PPP (21) patient counts FRESH (11/11). NP (19) FRESH (11/11). Hours = Time Clock 11/01–11/11 (fresh).
// Providers: full roster = ProviderTotals gross (incl King/OSB). ytd base/roster/location-stock from FROZEN 2026-10.ts.
// AR = AgedReceivables (24) as of 11/11 (org = sum of 8 locs). DH schedule = (13, FRESH 11/11). Phones = Mango Nov MTD (11/11, FRESH). Recare 10/30 (CARRIED). Goals carried.
"""

out=[]
out.append(carry_head.rstrip()+"\n\n")
out.append(header)
out.append("export const PERIOD_INFO = {\n")
out.append("  label:          'November 2026',\n  dataAsOf:       'Nov 11',\n  totalBizDays:   %d,\n  daysComplete:   %d,\n  daysRemaining:  %d,\n}\n\n"%(TOTAL_BD,BD,TOTAL_BD-BD))
out.append("export const DEMO_DATA = {\n  period: 'November 2026',\n  org: {\n")
out.append(f"    production:      {ORG_PROD},\n    productionGoal:  3237500,\n    collections:     {ORG_COLL},\n    collectionsGoal: 1505000,\n")
out.append(f"    newPatients:     {ORG_NP},\n    activePatients:  2531,\n    phoneAnswerRate: {ORG_PHONE},\n    hygieneRecare:   95.3,\n    suppliesPct:     0,\n  }},\n\n")
out.append(f"  asOf: {{ phones: '{ASOF_PHONES}', supplies: '{ASOF_SUPPLIES}', activeHygiene: '{ASOF_HYGIENE}' }},\n\n")
out.append("  locations: [\n"+"\n".join(locrow(c) for c in LORDER)+"\n  ],\n\n")
out.append("  doctors: [\n"+"\n".join(drow(r) for r in docs)+"\n  ],\n\n")
out.append("  hygienists: [\n"+"\n".join(hrow(r) for r in hygs)+"\n  ],\n\n")
out.append("  phones: [\n"+"\n".join(phrow(c) for c in LORDER)+"\n  ],\n\n")
out.append("  ar: {\n    asOf: '11/05/2026',\n")
out.append(f"    healthScore: {round(org_b['d0_30']/org_net*100) if org_net else 0},\n    total: {org_net},\n")
out.append(f"    buckets: {{ d0_30: {org_b['d0_30']}, d31_60: {org_b['d31_60']}, d61_90: {org_b['d61_90']}, d90plus: {org_b['d90plus']} }},\n")
out.append(f"    pcts:    {{ d0_30: {opct(org.get('g0',0))}, d31_60: {opct(org.get('g31',0))}, d61_90: {opct(org.get('g61',0))}, d90plus: {opct(org.get('g90',0))} }},\n")
out.append(f"    arToProdRatio: {round(org_net/2964078,2)},\n    locations: [\n"+"\n".join(arrow(c) for c in LORDER if c in arloc)+"\n    ],\n  },\n}\n\n")
# SCHEDULE_DATA
out.append("export const SCHEDULE_DATA = {\n  asOf: 'November 11, 2026',\n\n  remainingThisMonth: {\n")
out.append(f"    daysRemaining:  {TOTAL_BD-BD},\n    scheduledTotal: {REMAIN},\n    mtdGross:       {ORG_PROD},\n    monthlyGoal:    3237500,\n    locations: [\n")
out.append("\n".join(remrow(c) for c in ['LKW','PB','PR','LT','HNS','HNR','OSB','HNK'])+"\n    ],\n  },\n\n")
out.append(fm.rstrip()+"\n\n")
out.append("  "+ps_block.strip()+"\n  ],\n}\n\n")
# leaderboard = MTD
out.append("// ─── DAILY LEADERBOARD — November MTD gross (no single-day baseline yet at BD%d) ──\n"%BD)
out.append("export const DAILY_LEADERBOARD = {\n  date:      'November (thru 11/11)',\n  dateShort: 'Nov MTD',\n  doctors: [\n")
out.append("\n".join(f"    {{ name:{esc(r['name'])}, locationCode:'{r['loc']}', dailyProd:{r['g']} }}," for r in docs if r['g']>0)+"\n  ],\n")
out.append("  hygienists: [\n"+"\n".join(f"    {{ name:{esc(r['name'])}, locationCode:'{r['loc']}', dailyProd:{r['g']} }}," for r in hygs if r['g']>0)+"\n  ],\n}\n\n")
out.append("export const REMAINING_SCHEDULE_BY_PROVIDER: Record<string, number> = {\n")
out.append("\n".join(f"  {esc(augrows[k]['name'])}: {v}," for k,v in sorted(sched.items(),key=lambda x:-x[1]) if v>0 and k in augrows)+"\n}\n")

open(f"{ROOT}/lib/data.ts","w").write("".join(out))
# ---- validation ----
print("=== VALIDATION ===")
print(f"ORG production {ORG_PROD:,} (all 8 GROSS) = HNK {locprod['HNK']:,} + OSB {locprod['OSB']:,} + 6 {sum(locprod[c] for c in A6):,}")
print(f"PT grand gross {PT_GRAND:,.0f} vs all-8 locprod sum {sum(locprod.values()):,}  (should match)")
print(f"ORG collections {ORG_COLL:,}  NP {ORG_NP}  phone {ORG_PHONE}%")
print(f"doctors {len(docs)}  hygienists {len(hygs)}  provider gross sum {sum(r['g'] for r in docs)+sum(r['g'] for r in hygs):,}")
print(f"AR org net {org_net:,}  remaining sched {REMAIN:,}")
print("locations:")
for c in LORDER:print(f"  {c} prod {locprod[c]:,} coll {round(coll.get(c,0)):,} NP {npd.get(c,0)} phone {PH[c][3]}")
