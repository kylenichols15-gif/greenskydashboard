# Rebuild the Schedule page's FORWARD provider view (lib/data.ts providerSchedule) from a fresh
# "#2 Next Month Scheduled Production.csv" pull. Run only when Kyle drops a new #2 file (monthly-ish),
# NOT daily — daily-update.py carries providerSchedule verbatim.
# EDIT PER RUN: (1) F2 filename below, (2) `want` = the 3 forward (year,monthAbbr) to show = the 3
# months AFTER the live board month, (3) the Dec/Jan/Feb labels+keys in app/schedule/ScheduleClient.tsx
# (ProvEntry type, months[], subtitle, "Dec-Feb" total, note), (4) NEW_ADDS = confirmed new providers.
# After running: python3 scripts/daily-update.py && npm run build && git push.
import csv,re
ROOT="/Users/kylenichols/dev/greenskydashboard-app"
D="/Users/kylenichols/Downloads"
F2="#2 Next Month Scheduled Production.csv"

def key(nm):
    nm=re.sub(r'\s*-\s*[^-]+$','',nm.replace('​','').strip())
    nm=re.sub(r'\([^)]*\)','',nm)
    p=[x.strip() for x in nm.split(',')]
    last=re.sub(r'\s+(dmd|md|rdh|dds)\.?$','',p[0].lower().strip())
    first=p[1].split()[0].lower() if len(p)>1 and p[1].split() else ''
    return (last,first)
def num(s):
    s=(s or '').replace('​','').replace(',','').replace('$','').strip()
    if s in('','-'):return 0.0
    return float(s)

# ---- #2 forward: sum per provider for Dec2026 / Jan2027 / Feb2027 ----
fwd={}  # key -> {'Dec':x,'Jan':y,'Feb':z}
rows=list(csv.reader(open(f"{D}/{F2}")))
want={('2026','Dec'):'Dec',('2027','Jan'):'Jan',('2027','Feb'):'Feb'}
for r in rows[1:]:
    if len(r)<5 or r[0]=='Grand Total':continue
    yr,loc,prov,mo,amt=r[0],r[1],r[2],r[3],r[4]
    tag=want.get((yr,mo))
    if not tag:continue
    k=key(prov)
    fwd.setdefault(k,{'Dec':0,'Jan':0,'Feb':0})
    fwd[k][tag]+=round(num(amt))

# ---- existing roster rows from data.ts ----
src=open(f"{ROOT}/lib/data.ts").read()
block=src[src.index('  providerSchedule: ['):src.index('  ],\n}\n\n// ─── DAILY')]
roster=[]  # (name, specialty, loc, osb)
for line in block.splitlines():
    m=re.search(r"name:('[^']*'|\"[^\"]*\"),\s*specialty:'(\w+)',\s*locationCode:'(\w+)',\s*isOSB:(true|false)",line)
    if m:
        nm=m.group(1)[1:-1]
        roster.append((nm,m.group(2),m.group(3),m.group(4)=='true'))
existing_keys={key(n) for n,_,_,_ in roster}

# ---- new dentists present in forward but not rostered (meaningful $) ----
# specialty from DH file; location from #2 primary (max forward)
loc_by_key={}
for r in rows[1:]:
    if len(r)<5 or r[0]=='Grand Total':continue
    yr,loc,prov,mo,amt=r[0],r[1],r[2],r[3],r[4]
    if want.get((yr,mo)):
        k=key(prov);loc_by_key.setdefault(k,{})
        loc_by_key[k][loc]=loc_by_key[k].get(loc,0)+round(num(amt))
LN={'Harvey and Nichols Family Dentistry':'LKW','Harvey and Nichols King':'HNK','Harvey and Nichols Lincoln Trail':'LT','Harvey and Nichols Radcliff PLLC':'HNR','Harvey and Nichols Shepherdsville PLLC':'HNS','Osbourne Family Dental':'OSB','Proctor Family Dental Bardstown':'PB','Proctor Family Dental Radcliff':'PR'}
# DH specialty
dh=list(csv.reader(open(f"{D}/DH Scheduled Production - Remaining Month (11).csv")))
spec_by_key={}
for r in dh[1:]:
    if len(r)<4 or 'Total' in r[0]:continue
    spec_by_key[key(r[2])]=r[1]
# curated new adds: confirmed real providers only
NEW_ADDS=[('Morgan, Kennedy',('morgan','kennedy')),
          ('Bone, Victoria',('bone','victoria')),
          ('Vong, Harrison',('vong','harrison'))]
new_rows=[]
for disp,k in NEW_ADDS:
    if k in existing_keys:continue
    f=fwd.get(k,{'Dec':0,'Jan':0,'Feb':0})
    if f['Dec']+f['Jan']+f['Feb']<=0:continue
    locs=loc_by_key.get(k,{});ploc=max(locs,key=locs.get) if locs else 'LKW'
    code=LN.get(ploc,'LKW')
    sp=spec_by_key.get(k,'Dentist')
    new_rows.append((disp,sp,code,code=='OSB'))

# ---- emit ----
def esc(n):return '"'+n+'"' if "'" in n else "'"+n+"'"
def fmt(nm,sp,loc,osb):
    f=fwd.get(key(nm),{'Dec':0,'Jan':0,'Feb':0})
    o='true ' if osb else 'false'
    return (f"    {{ name:{(esc(nm)+','):<29} specialty:{(esc(sp)+','):<13} locationCode:'{loc}', isOSB:{o}, "
            f"months:{{ Dec:{f['Dec']}, Jan:{f['Jan']}, Feb:{f['Feb']} }} }},")
# keep original order; insert new dentists right after last dentist
out_lines=[]
last_dent_idx=max(i for i,(n,s,l,o) in enumerate(roster) if s=='Dentist')
for i,(n,s,l,o) in enumerate(roster):
    out_lines.append(fmt(n,s,l,o))
    if i==last_dent_idx:
        for nm,sp,code,osb in new_rows:
            out_lines.append(fmt(nm,sp,code,osb))
newblock="  providerSchedule: [\n"+"\n".join(out_lines)+"\n  ],"
oldblock=src[src.index('  providerSchedule: ['):src.index('\n  ],\n}\n\n// ─── DAILY')+len('\n  ],')]
src2=src.replace(oldblock,newblock)
open(f"{ROOT}/lib/data.ts","w").write(src2)
print("rostered:",len(roster)," new dentists added:",[r[0] for r in new_rows])
print("sample forward totals:")
for nm in ['Nichols, Christopher','Proctor, Sarah','Bone, Victoria','Morgan, Kennedy','Vong, Harrison','Jones, Chad']:
    print(" ",nm,fwd.get(key(nm)))
