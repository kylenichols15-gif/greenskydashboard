# Daily MTD update generator — regenerates lib/data.ts for the current live month from Downloads CSVs.
# EDIT PER RUN (top of file): the 7 input filenames (ProviderTotals, P/C Summary, PPP, NP, DepositSlip [full-month range],
#   AgedReceivables, Time Clock), BD (business days elapsed), PH{} phones, and the header date strings.
# Sources: 6-Ascend production = ProviderTotals gross split by P/C-Summary location weights; HNK/OSB = P/C Summary.
#   Collections = DepositSlip (full-month range file). ytd base + provider roster + location stock come from the
#   FROZEN prior month (lib/months/2026-08.ts) so re-runs never double-count. Roster = curated real providers only.
# Run: python3 scripts/daily-update.py  (writes lib/data.ts, prints validation). Then npm run build && git push (auto-deploys).

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
BD=6  # biz days elapsed thru 9/9

# ---------- ProviderTotals 9/8 ----------
pt=list(csv.reader(open(f"{D}/ProviderTotals - 2026-09-10T095702.386.csv",encoding="utf-8-sig")))
ptg={};ptc={}
for r in pt[12:]:
    if not r or not r[0].strip() or r[0].strip()=='Provider Totals':continue
    k=key(r[0]);ptg[k]=ptg.get(k,0)+num(r[2]);ptc[k]=ptc.get(k,0)+abs(num(r[6]))
PT_GRAND=sum(ptg.values())

# ---------- P/C Summary 70 (Sept) ----------
pc=list(csv.reader(open(f"{D}/Production , Collection Summary (71).csv",encoding="utf-8-sig")))
hdr=pc[0];pcols=[(i,h) for i,h in enumerate(hdr) if h.endswith('~Production')]
sep=[r for r in pc[1:] if len(r)>2 and r[0].strip()=='2026' and r[1].strip()=='Sep']
ploc={};plocc={};gtP=[i for i,h in enumerate(hdr) if h=='Grand Total~Production'][0];gtC=gtP+1
pcloc_prod={}  # location -> grand production (for HNK/OSB + split weights)
for r in sep:
    code=LNAME.get(r[2].strip())
    if not code:continue
    pcloc_prod[code]=num(r[gtP])
    for i,h in pcols:
        if h=='Grand Total~Production':continue
        v=num(r[i]);c=abs(num(r[i+1]));k=key(h)
        if abs(v)>0.005 or c>0.005:
            ploc.setdefault(k,{});ploc[k][code]=ploc[k].get(code,0)+v
            plocc.setdefault(k,{});plocc[k][code]=plocc[k].get(code,0)+c

# ---------- PPP 38 (patient counts) ----------
ppp=list(csv.reader(open(f"{D}/Production per Patient (39).csv",encoding="utf-8-sig")))
ph=ppp[0];pccols=[(i,ph[i]) for i in range(len(ph)) if ph[i].endswith('~Patient Count')]
sepp=[r for r in ppp[1:] if len(r)>2 and r[0].strip()=='2026' and r[1].strip()=='Sep']
patients={}
for r in sepp:
    for i,h in pccols:
        if h.startswith('Grand Total'):continue
        v=r[i].replace('​','').strip()
        if v not in('','-'):
            try:patients[key(h)]=patients.get(key(h),0)+int(float(v))
            except:pass

# ---------- Timeclock 9/8 ----------
tc=list(csv.reader(open(f"{D}/Time clock summary 09-01-2026 - 09-09-2026.csv")))
hours={}
for r in tc[1:]:
    if len(r)<5:continue
    k=(r[0].strip().lower(), r[1].strip().split()[0].lower() if r[1].strip() else '')
    try:hours[k]=hours.get(k,0)+float(r[4])
    except:pass

# ---------- DepositSlip 26 (MTD collections by location) ----------
coll={}
dr=csv.reader(open(f"{D}/DepositSlip (28).csv",encoding="utf-8-sig"));seen=False
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
for r in list(csv.reader(open(f"{D}/New Patients all offices (82).csv")))[1:]:
    if len(r)<3 or r[1].strip()!='Sep':continue
    c=LNAME.get(r[0].strip())
    if c:npd[c]=int(r[2])

# ---------- phones (Kyle, Sept MTD ~9/5) ----------
PH={'HNK':(154,73,81,47),'HNR':(203,145,58,71),'PR':(307,164,143,53),'LKW':(305,232,73,76),
    'LT':(160,124,36,78),'PB':(216,150,66,69),'OSB':(203,145,58,71),'HNS':(124,94,30,76)}

# ---------- location GROSS split (PT gross 9/8 allocated by P/C loc weights) ----------
import collections as C
locgross=C.defaultdict(float)
for k,g in ptg.items():
    w=ploc.get(k,{})
    w6={a:b for a,b in w.items() if a in A6 and b>0}
    t=sum(w6.values())
    if t>0:
        for a,b in w6.items():locgross[a]+=g*b/t
    else:
        locgross['LKW']+=g  # unmapped (Wright) -> LKW
locprod={c:round(locgross[c]) for c in A6}
locprod['HNK']=round(pcloc_prod.get('HNK',0))
locprod['OSB']=round(pcloc_prod.get('OSB',0))
ORG_PROD=sum(locprod.values())

# ---------- carry: constants/futureMonths/providerSchedule from current data.ts;
#            ytd base + roster + location stock from FROZEN August (so daily re-run never double-counts) ----------
src=open(f"{ROOT}/lib/data.ts").read()
base=open(f"{ROOT}/lib/months/2026-08.ts").read()
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

# ---------- build providers ----------
def loc6(k):
    w={a:b for a,b in ploc.get(k,{}).items() if a in A6 and b>0}
    return max(w,key=w.get) if w else (augrows[k]['loc'] if k in augrows else None)
def locHO(k):
    w={a:b for a,b in ploc.get(k,{}).items() if a in('HNK','OSB') and b>0}
    return max(w,key=w.get) if w else None
docs=[];hygs=[]
# Roster = curated August real providers only (excludes Dentrix entity/placeholder accounts).
for k,ar in augrows.items():
    if k in ptg:              # 6-Ascend real provider
        g=ptg[k];c=ptc.get(k,0)
    elif k in ploc:           # HNK/OSB provider (not in ProviderTotals)
        g=ploc[k].get('HNK',0)+ploc[k].get('OSB',0)
        c=plocc.get(k,{}).get('HNK',0)+plocc.get(k,{}).get('OSB',0)
    else:
        g=0;c=0
    if abs(g)<0.5 and c<0.5:  # no September activity yet — drop from BD5 board
        continue
    row=dict(name=ar['name'],loc=ar['loc'],g=round(g),c=round(c),ytd=ar['ytd']+round(g),
             pat=patients.get(k,0),hrs=round(hours.get(k,0),2),osb=ar['osb'])
    (docs if ar['spec']=='Dentist' else hygs).append(row)
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
    ap=augloc_field(c,'activePatients');ahp=augloc_field(c,'activeHygienePatients');sp=augloc_field(c,'suppliesPct')
    ph=PH[c][3]
    st='watch' if (c in('HNK',) or cr<40) else 'on_pace'
    return (f"    {{ code:'{c}', production:{p}, collections:{cl}, collectionRate:{cr}, newPatients:{npd.get(c,0)}, "
            f"recareRate:0, phoneAnswerRate: {ph}, activePatients:{ap}, activeHygienePatients:{ahp}, suppliesPct:{sp}, status:'{st}'{osb} }},")

# ---------- AR from AgedReceivables 87 ----------
arloc={};cur=None
for l in open(f"{D}/AgedReceivables (88).csv",encoding='utf-8'):
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
org=arloc.get('ORG',{})
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

# providerSchedule: append Sep from DH37 per provider
dh=list(csv.reader(open(f"{D}/DH Scheduled Production - Remaining Month (37).csv")))
sched={}
for r in dh[1:]:
    if len(r)<4 or 'Total' in r[0]:continue
    sched[key(r[2])]=sched.get(key(r[2]),0)+round(num(r[3]))
def ps_with_sep(block):
    out=[]
    for line in block.splitlines():
        if 'months:{' in line and 'name:' in line:
            line=re.sub(r",\s*Sep:-?\d+","",line)  # drop any prior Sep (idempotent daily re-run)
            mm=re.search(r"name:('[^']*'|\"[^\"]*\")",line)
            if mm:
                k=key(mm.group(1)[1:-1]);sp=sched.get(k,0)
                line=re.sub(r"(Aug:-?\d+)\s*\}", r"\1, Sep:%d }"%sp, line)
        out.append(line)
    return "\n".join(out)

REMAIN=sum(sched.values())

header=f"""// September 2026 — daily update / BD{BD} of 21 (as of Sep 9; Labor Day 9/7 excluded).
// August 2026 FINAL frozen at lib/months/2026-08.ts (prod $2,639,000 · coll $1,450,143 · 708 NP).
// Production: 6-Ascend = ProviderTotals (09/01–09/09) gross Procedure Charges ${PT_GRAND:,.0f}, split to location by
//   P/C-Summary(70) location weights (ties to PT grand). HNK ${locprod['HNK']:,} + OSB ${locprod['OSB']:,} = P/C Summary(70) Sep
//   HNK ${locprod['HNK']:,} + OSB ${locprod['OSB']:,} = P/C Summary(71) Sep (current). ORG production ${ORG_PROD:,}.
// COLLECTIONS = DepositSlip (28) MTD 09/01–09/09 by location (source of truth). Org ${ORG_COLL:,}.
// NP (82) Sep MTD = {ORG_NP}. PPP (39) patient counts. Hours = Time Clock 09/01–09/09. daysWorked={BD}; prodPerDay=gross/{BD}.
// Providers: 6-Ascend roster = ProviderTotals; HNK/OSB = P/C Summary(70). DAILY_LEADERBOARD = Sept MTD (no single-day baseline yet).
// Phones = Mango Sept MTD (~9/5, Kyle). AR = AgedReceivables (88) as of 09/09. Goals carried. suppliesPct/activePatients carried from Aug.
"""

out=[]
out.append(carry_head.rstrip()+"\n\n")
out.append(header)
out.append("export const PERIOD_INFO = {\n")
out.append("  label:          'September 2026',\n  dataAsOf:       'Sep 9',\n  totalBizDays:   21,\n  daysComplete:   %d,\n  daysRemaining:  %d,\n}\n\n"%(BD,21-BD))
out.append("export const DEMO_DATA = {\n  period: 'September 2026',\n  org: {\n")
out.append(f"    production:      {ORG_PROD},\n    productionGoal:  2910000,\n    collections:     {ORG_COLL},\n    collectionsGoal: 1455000,\n")
out.append(f"    newPatients:     {ORG_NP},\n    activePatients:  2531,\n    phoneAnswerRate: {ORG_PHONE},\n    hygieneRecare:   95.3,\n    suppliesPct:     5.7,\n  }},\n\n")
out.append("  locations: [\n"+"\n".join(locrow(c) for c in LORDER)+"\n  ],\n\n")
out.append("  doctors: [\n"+"\n".join(drow(r) for r in docs)+"\n  ],\n\n")
out.append("  hygienists: [\n"+"\n".join(hrow(r) for r in hygs)+"\n  ],\n\n")
out.append("  phones: [\n"+"\n".join(phrow(c) for c in LORDER)+"\n  ],\n\n")
out.append("  ar: {\n    asOf: '09/09/2026',\n")
out.append(f"    healthScore: {round(org_b['d0_30']/org_net*100) if org_net else 0},\n    total: {org_net},\n")
out.append(f"    buckets: {{ d0_30: {org_b['d0_30']}, d31_60: {org_b['d31_60']}, d61_90: {org_b['d61_90']}, d90plus: {org_b['d90plus']} }},\n")
out.append(f"    pcts:    {{ d0_30: {opct(org.get('g0',0))}, d31_60: {opct(org.get('g31',0))}, d61_90: {opct(org.get('g61',0))}, d90plus: {opct(org.get('g90',0))} }},\n")
out.append(f"    arToProdRatio: {round(org_net/2639000,2)},\n    locations: [\n"+"\n".join(arrow(c) for c in LORDER if c in arloc)+"\n    ],\n  },\n}\n\n")
# SCHEDULE_DATA
out.append("export const SCHEDULE_DATA = {\n  asOf: 'September 9, 2026',\n\n  remainingThisMonth: {\n")
out.append(f"    daysRemaining:  {21-BD},\n    scheduledTotal: {REMAIN},\n    mtdGross:       {ORG_PROD},\n    monthlyGoal:    2910000,\n    locations: [\n")
out.append("\n".join(remrow(c) for c in ['LKW','PB','PR','LT','HNS','HNR','OSB','HNK'])+"\n    ],\n  },\n\n")
out.append(fm.rstrip()+"\n\n")
out.append("  "+ps_with_sep(ps_block).strip()+"\n  ],\n}\n\n")
# leaderboard = MTD
out.append("// ─── DAILY LEADERBOARD — September MTD gross (no single-day baseline yet at BD%d) ──\n"%BD)
out.append("export const DAILY_LEADERBOARD = {\n  date:      'September MTD (thru 9/8)',\n  dateShort: 'MTD 9/8',\n  doctors: [\n")
out.append("\n".join(f"    {{ name:{esc(r['name'])}, locationCode:'{r['loc']}', dailyProd:{r['g']} }}," for r in docs if r['g']>0)+"\n  ],\n")
out.append("  hygienists: [\n"+"\n".join(f"    {{ name:{esc(r['name'])}, locationCode:'{r['loc']}', dailyProd:{r['g']} }}," for r in hygs if r['g']>0)+"\n  ],\n}\n\n")
out.append("export const REMAINING_SCHEDULE_BY_PROVIDER: Record<string, number> = {\n")
out.append("\n".join(f"  {esc(augrows[k]['name'])}: {v}," for k,v in sorted(sched.items(),key=lambda x:-x[1]) if v>0 and k in augrows)+"\n}\n")

open(f"{ROOT}/lib/data.ts","w").write("".join(out))
# ---- validation ----
print("=== VALIDATION ===")
print(f"ORG production {ORG_PROD:,} = 6Asc {sum(locprod[c] for c in A6):,} + HNK {locprod['HNK']:,} + OSB {locprod['OSB']:,}")
print(f"PT grand gross {PT_GRAND:,.0f} vs 6-Ascend locprod sum {sum(locprod[c] for c in A6):,}")
print(f"ORG collections {ORG_COLL:,}  NP {ORG_NP}  phone {ORG_PHONE}%")
print(f"doctors {len(docs)}  hygienists {len(hygs)}  provider gross sum {sum(r['g'] for r in docs)+sum(r['g'] for r in hygs):,}")
print(f"AR org net {org_net:,}  remaining sched {REMAIN:,}")
print("locations:")
for c in LORDER:print(f"  {c} prod {locprod[c]:,} coll {round(coll.get(c,0)):,} NP {npd.get(c,0)} phone {PH[c][3]}")
