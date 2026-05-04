'use client'

import { useState } from 'react'

// ─── Doctor/Hygienist Roster (pre-populate bookmarklet form) ─────────────────
const DOCTORS = [
  { name: "Weathers, L'Cris",     loc: 'PR'  },
  { name: 'Ballard, Erin',        loc: 'PB'  },
  { name: 'Nichols, Christopher', loc: 'LKW' },
  { name: 'Connolly, Noah',       loc: 'HNS' },
  { name: 'Proctor, Sarah',       loc: 'PB'  },
  { name: 'Nichols, Patrick',     loc: 'LT'  },
  { name: 'Walters, Carrie',      loc: 'LKW' },
  { name: 'Osbourne, Brian',      loc: 'OSB' },
  { name: 'Decker Haycraft, Kara',loc: 'LT'  },
  { name: 'Gleason, Robert',      loc: 'LKW' },
  { name: 'Skaggs, Ernest',       loc: 'HNR' },
]

const HYGIENISTS = [
  { name: 'Howell, Dana',      loc: 'LT'  },
  { name: 'Kittle, Jolena',    loc: 'LT'  },
  { name: 'Harned, Stacy',     loc: 'LT'  },
  { name: 'Buzick, Rebecca',   loc: 'LT'  },
  { name: 'Blandford, Cassi',  loc: 'LKW' },
  { name: 'Youart, Britney',   loc: 'LKW' },
  { name: 'Berry, Tasha',      loc: 'LKW' },
  { name: 'Bewley, Emma',      loc: 'LKW' },
  { name: 'Culver, Angela',    loc: 'OSB' },
  { name: 'Haydon, Kelsey',    loc: 'OSB' },
  { name: 'Greenwell, Denise', loc: 'OSB' },
]

const LOCATIONS = ['LKW', 'LT', 'HNR', 'HNS', 'PB', 'PR', 'OSB']

// ─── Bookmarklet generator ────────────────────────────────────────────────────
function buildBookmarklet(syncKey: string, apiBase: string): string {
  const doctors = JSON.stringify(DOCTORS)
  const hygienists = JSON.stringify(HYGIENISTS)
  const locations = JSON.stringify(LOCATIONS)

  // Self-contained IIFE — no external deps
  const code = `(function(){
  if(document.getElementById('gsd-sync-modal'))return;
  var KEY=${JSON.stringify(syncKey)};
  var API=${JSON.stringify(apiBase+'/api/sync/dentrix')};
  var DOCS=${doctors};
  var HYGS=${hygienists};
  var LOCS=${locations};

  /* ── helpers ── */
  function n(v){return v===''||v===null||v===undefined?0:Number(String(v).replace(/[^0-9.-]/g,''))||0;}
  function pct(a,b){return b>0?Math.round(a/b*1000)/10:0;}

  /* ── attempt DOM extraction ── */
  function tryExtract(){
    var rows=[];
    var tables=document.querySelectorAll('table');
    for(var t=0;t<tables.length;t++){
      var ths=tables[t].querySelectorAll('th,thead td');
      var hdrs=Array.from(ths).map(function(h){return h.textContent.toLowerCase().trim();});
      var grossIdx=hdrs.findIndex(function(h){return h.includes('procedure')||h.includes('gross')||h.includes('charge');});
      var collIdx=hdrs.findIndex(function(h){return h.includes('collect')||h.includes('payment');});
      var nameIdx=hdrs.findIndex(function(h){return h.includes('provider')||h.includes('name')||h==='';});
      if(grossIdx>=0&&collIdx>=0){
        var trs=tables[t].querySelectorAll('tbody tr');
        trs.forEach(function(tr){
          var tds=tr.querySelectorAll('td');
          if(tds.length>Math.max(grossIdx,collIdx)){
            var name=nameIdx>=0?tds[nameIdx].textContent.trim():'';
            var gross=n(tds[grossIdx].textContent);
            var coll=n(tds[collIdx].textContent);
            if(gross>0||coll>0) rows.push({name:name,gross:gross,coll:coll});
          }
        });
        if(rows.length>0)return rows;
      }
    }
    return null;
  }

  /* ── location guess from name ── */
  function guessLoc(name){
    var lc=name.toLowerCase();
    if(lc.includes('lakewood'))return'LKW';
    if(lc.includes('lincoln'))return'LT';
    if(lc.includes('shep'))return'HNS';
    if(lc.includes('bardstown'))return'PB';
    if(lc.includes('proctor')&&lc.includes('rad'))return'PR';
    if(lc.includes('osbourne')||lc.includes('osborn'))return'OSB';
    if(lc.includes('radcliff'))return'HNR';
    return'';
  }

  /* ── build modal ── */
  var overlay=document.createElement('div');
  overlay.id='gsd-sync-modal';
  overlay.style.cssText='position:fixed;top:0;left:0;width:100%;height:100%;background:rgba(0,0,0,0.85);z-index:999999;display:flex;align-items:center;justify-content:center;font-family:system-ui,sans-serif;';

  var modal=document.createElement('div');
  modal.style.cssText='background:#0F172A;border:1px solid #1E2A3A;border-radius:12px;padding:24px;width:900px;max-width:95vw;max-height:90vh;overflow-y:auto;color:#F1F5F9;';

  var extracted=tryExtract();
  var extractNote=extracted?'<span style="color:#22c55e;font-size:12px;">✓ Auto-extracted '+extracted.length+' rows from page table</span>':'<span style="color:#94A3B8;font-size:12px;">Manual entry mode — auto-extract not available on this page</span>';

  /* ── build doctor rows ── */
  function makeRows(roster,prefix,extracted){
    return roster.map(function(p,i){
      var match=null;
      if(extracted){
        var lname=p.name.split(',')[0].toLowerCase();
        match=extracted.find(function(r){return r.name.toLowerCase().includes(lname);});
      }
      var gross=match?match.gross:0;
      var coll=match?match.coll:0;
      var days=7;
      return '<tr style="border-bottom:1px solid #1E2A3A;">'
        +'<td style="padding:6px 8px;font-size:13px;color:#CBD5E1;white-space:nowrap;">'+p.name+'</td>'
        +'<td style="padding:6px 4px;"><select id="'+prefix+'_loc_'+i+'" style="background:#111827;color:#F1F5F9;border:1px solid #1E2A3A;border-radius:4px;padding:3px 6px;font-size:12px;">'
        +LOCS.map(function(l){return'<option value="'+l+'"'+(l===p.loc?' selected':'')+'>'+l+'</option>';}).join('')
        +'</select></td>'
        +'<td style="padding:6px 4px;"><input id="'+prefix+'_gross_'+i+'" type="text" value="'+gross+'" style="width:90px;background:#111827;color:#F1F5F9;border:1px solid #1E2A3A;border-radius:4px;padding:3px 6px;font-size:12px;" placeholder="0"/></td>'
        +'<td style="padding:6px 4px;"><input id="'+prefix+'_coll_'+i+'" type="text" value="'+coll+'" style="width:90px;background:#111827;color:#F1F5F9;border:1px solid #1E2A3A;border-radius:4px;padding:3px 6px;font-size:12px;" placeholder="0"/></td>'
        +'<td style="padding:6px 4px;"><input id="'+prefix+'_days_'+i+'" type="number" value="'+days+'" style="width:50px;background:#111827;color:#F1F5F9;border:1px solid #1E2A3A;border-radius:4px;padding:3px 6px;font-size:12px;"/></td>'
        +'</tr>';
    }).join('');
  }

  /* ── build location rows ── */
  function makeLocRows(){
    return LOCS.map(function(code,i){
      return '<tr style="border-bottom:1px solid #1E2A3A;">'
        +'<td style="padding:6px 8px;font-size:13px;color:#CBD5E1;font-weight:600;">'+code+'</td>'
        +'<td style="padding:6px 4px;"><input id="loc_prod_'+i+'" type="text" value="0" style="width:100px;background:#111827;color:#F1F5F9;border:1px solid #1E2A3A;border-radius:4px;padding:3px 6px;font-size:12px;" placeholder="0"/></td>'
        +'<td style="padding:6px 4px;"><input id="loc_coll_'+i+'" type="text" value="0" style="width:100px;background:#111827;color:#F1F5F9;border:1px solid #1E2A3A;border-radius:4px;padding:3px 6px;font-size:12px;" placeholder="0"/></td>'
        +'<td style="padding:6px 4px;"><input id="loc_np_'+i+'" type="number" value="0" style="width:60px;background:#111827;color:#F1F5F9;border:1px solid #1E2A3A;border-radius:4px;padding:3px 6px;font-size:12px;"/></td>'
        +'</tr>';
    }).join('');
  }

  var tableStyle='width:100%;border-collapse:collapse;font-size:13px;';
  var thStyle='text-align:left;padding:6px 8px;color:#94A3B8;font-size:11px;text-transform:uppercase;border-bottom:1px solid #334155;';

  modal.innerHTML='<div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:16px;">'
    +'<div><div style="font-size:18px;font-weight:700;color:#0A9E8A;">GreenSky Dashboard Sync</div>'
    +'<div style="margin-top:4px;">'+extractNote+'</div></div>'
    +'<button id="gsd-close" style="background:#1E2A3A;border:none;color:#94A3B8;border-radius:6px;padding:6px 12px;cursor:pointer;font-size:14px;">✕ Close</button>'
    +'</div>'

    +'<div style="display:flex;gap:8px;margin-bottom:16px;">'
    +'<button id="tab-docs" class="gsd-tab" style="background:#0A9E8A;color:#fff;border:none;border-radius:6px;padding:6px 16px;cursor:pointer;font-size:13px;font-weight:600;">Doctors</button>'
    +'<button id="tab-hygs" class="gsd-tab" style="background:#1E2A3A;color:#94A3B8;border:none;border-radius:6px;padding:6px 16px;cursor:pointer;font-size:13px;">Hygienists</button>'
    +'<button id="tab-locs" class="gsd-tab" style="background:#1E2A3A;color:#94A3B8;border:none;border-radius:6px;padding:6px 16px;cursor:pointer;font-size:13px;">Locations</button>'
    +'</div>'

    +'<div id="pane-docs">'
    +'<table style="'+tableStyle+'"><thead><tr>'
    +'<th style="'+thStyle+'">Doctor</th><th style="'+thStyle+'">Loc</th>'
    +'<th style="'+thStyle+'">Gross Prod $</th><th style="'+thStyle+'">Collections $</th>'
    +'<th style="'+thStyle+'">Days</th>'
    +'</tr></thead><tbody>'+makeRows(DOCS,'doc',extracted)+'</tbody></table>'
    +'</div>'

    +'<div id="pane-hygs" style="display:none;">'
    +'<table style="'+tableStyle+'"><thead><tr>'
    +'<th style="'+thStyle+'">Hygienist</th><th style="'+thStyle+'">Loc</th>'
    +'<th style="'+thStyle+'">Gross Prod $</th><th style="'+thStyle+'">Collections $</th>'
    +'<th style="'+thStyle+'">Days</th>'
    +'</tr></thead><tbody>'+makeRows(HYGS,'hyg',extracted)+'</tbody></table>'
    +'</div>'

    +'<div id="pane-locs" style="display:none;">'
    +'<p style="color:#94A3B8;font-size:12px;margin-bottom:8px;">Location-level totals (from Location Production Summary report)</p>'
    +'<table style="'+tableStyle+'"><thead><tr>'
    +'<th style="'+thStyle+'">Location</th><th style="'+thStyle+'">Gross Prod $</th>'
    +'<th style="'+thStyle+'">Collections $</th><th style="'+thStyle+'">New Pts</th>'
    +'</tr></thead><tbody>'+makeLocRows()+'</tbody></table>'
    +'</div>'

    +'<div style="margin-top:20px;display:flex;align-items:center;gap:12px;">'
    +'<button id="gsd-push" style="background:#0A9E8A;color:#fff;border:none;border-radius:8px;padding:10px 24px;cursor:pointer;font-size:14px;font-weight:700;">Push to Dashboard</button>'
    +'<div id="gsd-status" style="font-size:13px;color:#94A3B8;"></div>'
    +'</div>';

  overlay.appendChild(modal);
  document.body.appendChild(overlay);

  /* ── tab switching ── */
  function switchTab(id){
    ['docs','hygs','locs'].forEach(function(t){
      var pane=document.getElementById('pane-'+t);
      var btn=document.getElementById('tab-'+t);
      if(t===id){pane.style.display='block';btn.style.background='#0A9E8A';btn.style.color='#fff';}
      else{pane.style.display='none';btn.style.background='#1E2A3A';btn.style.color='#94A3B8';}
    });
  }
  ['docs','hygs','locs'].forEach(function(t){
    document.getElementById('tab-'+t).addEventListener('click',function(){switchTab(t);});
  });
  document.getElementById('gsd-close').addEventListener('click',function(){overlay.remove();});

  /* ── collect and push ── */
  document.getElementById('gsd-push').addEventListener('click',function(){
    var status=document.getElementById('gsd-status');
    status.textContent='Pushing...';status.style.color='#94A3B8';

    var doctors=DOCS.map(function(p,i){
      var gross=n(document.getElementById('doc_gross_'+i).value);
      var coll=n(document.getElementById('doc_coll_'+i).value);
      var days=n(document.getElementById('doc_days_'+i).value)||7;
      var loc=document.getElementById('doc_loc_'+i).value;
      return{name:p.name,locationCode:loc,grossProd:gross,collections:coll,
        collRate:pct(coll,gross),prodPerDay:days>0?Math.round(gross/days):0,daysWorked:days};
    }).filter(function(d){return d.grossProd>0||d.collections>0;});

    var hygienists=HYGS.map(function(p,i){
      var gross=n(document.getElementById('hyg_gross_'+i).value);
      var coll=n(document.getElementById('hyg_coll_'+i).value);
      var days=n(document.getElementById('hyg_days_'+i).value)||7;
      var loc=document.getElementById('hyg_loc_'+i).value;
      return{name:p.name,locationCode:loc,grossProd:gross,collections:coll,
        collRate:pct(coll,gross),hoursWorked:days*8,prodPerHr:gross>0&&days>0?Math.round(gross/(days*8)):0};
    }).filter(function(h){return h.grossProd>0||h.collections>0;});

    var locData=LOCS.map(function(code,i){
      var prod=n(document.getElementById('loc_prod_'+i).value);
      var coll=n(document.getElementById('loc_coll_'+i).value);
      var np=n(document.getElementById('loc_np_'+i).value);
      return{code:code,production:prod,collections:coll,
        collectionRate:pct(coll,prod),newPatients:np};
    }).filter(function(l){return l.production>0||l.collections>0;});

    var body={};
    if(doctors.length>0)body.doctors=doctors;
    if(hygienists.length>0)body.hygienists=hygienists;
    if(locData.length>0)body.locations=locData;

    fetch(API,{method:'POST',headers:{'Content-Type':'application/json','x-sync-key':KEY},body:JSON.stringify(body)})
      .then(function(r){return r.json();})
      .then(function(d){
        if(d.ok){status.textContent='✓ Synced: '+d.updated.join(', ');status.style.color='#22c55e';}
        else{status.textContent='Error: '+d.error;status.style.color='#ef4444';}
      })
      .catch(function(e){status.textContent='Network error: '+e.message;status.style.color='#ef4444';});
  });
})();`

  return 'javascript:' + encodeURIComponent(code)
}

// ─── Page component ────────────────────────────────────────────────────────────
export default function SyncClient({ syncKey }: { syncKey: string }) {
  const [copied, setCopied] = useState<string | null>(null)
  const [testResult, setTestResult] = useState<string | null>(null)

  const apiBase = typeof window !== 'undefined' ? window.location.origin : 'https://dashboard.greenskydental.com'
  const bookmarklet = buildBookmarklet(syncKey, apiBase)

  function copy(text: string, label: string) {
    navigator.clipboard.writeText(text)
    setCopied(label)
    setTimeout(() => setCopied(null), 2000)
  }

  async function testConnection() {
    setTestResult('Testing...')
    try {
      const res = await fetch('/api/sync/dentrix', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'x-sync-key': syncKey },
        body: JSON.stringify({ _test: true }),
      })
      const data = await res.json()
      if (res.ok) setTestResult('✓ Connection OK — KV is live')
      else if (data.error === 'KV not configured or save failed') setTestResult('⚠ Auth OK but KV not configured (data falls back to data.ts)')
      else setTestResult('✗ ' + data.error)
    } catch (e) {
      setTestResult('✗ Network error: ' + String(e))
    }
  }

  return (
    <div className="min-h-screen bg-[#dde6f2] p-8 text-[#0f172a]">
      <div className="max-w-3xl mx-auto space-y-8">

        <div>
          <h1 className="text-2xl font-bold text-[#2563eb]">Data Sync Setup</h1>
          <p className="text-[#64748b] mt-1 text-sm">
            Bookmarklet tools for pushing Dentrix Ascend data to the dashboard without an API integration.
          </p>
        </div>

        {/* ── Dentrix Bookmarklet ── */}
        <div className="bg-white border border-[#d1dce9] rounded-xl p-6 space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-lg font-semibold">Dentrix Ascend Bookmarklet</h2>
              <p className="text-[#64748b] text-sm mt-0.5">Run on any Dentrix report page to push production &amp; collections data</p>
            </div>
            <button
              onClick={testConnection}
              className="text-xs px-3 py-1.5 bg-[#f1f5fb] hover:bg-[#e8eff8] rounded-lg text-[#64748b] transition-colors"
            >
              Test API Connection
            </button>
          </div>

          {testResult && (
            <div className={`text-sm px-3 py-2 rounded-lg ${testResult.startsWith('✓') ? 'bg-green-900/30 text-green-400' : testResult.startsWith('⚠') ? 'bg-yellow-900/30 text-yellow-400' : 'bg-red-900/30 text-red-400'}`}>
              {testResult}
            </div>
          )}

          {/* Drag target */}
          <div className="bg-[#f1f5fb] border-2 border-dashed border-[#d1dce9] rounded-xl p-6 text-center">
            <a
              href={bookmarklet}
              className="inline-block bg-[#2563eb] text-white font-bold px-6 py-3 rounded-lg text-sm cursor-grab hover:bg-[#1d4ed8] transition-colors no-underline"
              draggable
              onClick={(e) => e.preventDefault()}
            >
              🦷 GreenSky Sync
            </a>
            <p className="text-[#64748b] text-xs mt-3">
              Drag this button to your bookmarks bar, or copy the code below
            </p>
          </div>

          {/* Copy code button */}
          <button
            onClick={() => copy(bookmarklet, 'bookmarklet')}
            className="w-full text-sm bg-[#f1f5fb] hover:bg-[#e8eff8] py-2.5 rounded-lg text-[#64748b] transition-colors"
          >
            {copied === 'bookmarklet' ? '✓ Copied!' : 'Copy Bookmarklet Code'}
          </button>

          {/* How to use */}
          <div className="bg-[#f1f5fb] rounded-lg p-4 space-y-2">
            <p className="text-xs font-semibold text-[#64748b] uppercase tracking-wider">How to Use</p>
            <ol className="text-sm text-[#334155] space-y-1.5 list-decimal list-inside">
              <li>Drag the button above to your bookmarks bar (or paste the code as a new bookmark URL)</li>
              <li>Log into Dentrix Ascend and open the <strong>Production Collection Summary</strong> report</li>
              <li>Click the <strong>GreenSky Sync</strong> bookmark — a modal will appear over Dentrix</li>
              <li>If data was auto-extracted from the table it will be pre-filled; review and correct as needed</li>
              <li>Switch to <strong>Locations</strong> tab and enter location-level totals from the Location Summary report</li>
              <li>Click <strong>Push to Dashboard</strong> — data goes live immediately</li>
            </ol>
          </div>
        </div>

        {/* ── Sync Key ── */}
        <div className="bg-white border border-[#d1dce9] rounded-xl p-6 space-y-3">
          <h2 className="text-lg font-semibold">Sync API Key</h2>
          <p className="text-[#64748b] text-sm">Used by all bookmarklets and automated scripts. Set via <code className="text-[#2563eb]">ADMIN_PASSWORD</code> environment variable in Vercel.</p>
          <div className="flex gap-2">
            <code className="flex-1 bg-[#f1f5fb] border border-[#d1dce9] rounded-lg px-3 py-2 text-sm text-[#64748b] font-mono">
              {syncKey.replace(/./g, '•')}
            </code>
            <button
              onClick={() => copy(syncKey, 'key')}
              className="px-4 py-2 bg-[#f1f5fb] hover:bg-[#e8eff8] rounded-lg text-sm text-[#64748b] transition-colors"
            >
              {copied === 'key' ? '✓' : 'Copy'}
            </button>
          </div>
        </div>

        {/* ── Mango Voice ── */}
        <div className="bg-white border border-[#d1dce9] rounded-xl p-6 space-y-3">
          <div className="flex items-center gap-3">
            <h2 className="text-lg font-semibold">Mango Voice</h2>
            <span className="text-xs bg-green-900/40 text-green-400 px-2 py-0.5 rounded-full">Active — API Pull</span>
          </div>
          <p className="text-[#64748b] text-sm">
            Phone data is pulled automatically via the Mango Voice internal API using stored session cookies.
            Run the Python script below to refresh phone data for all 7 locations.
          </p>
          <button
            onClick={() => copy(`cd ~/Documents/greenskydashboard-app && python3 scripts/mango_sync.py`, 'mango')}
            className="text-sm bg-[#f1f5fb] hover:bg-[#e8eff8] py-2.5 px-4 rounded-lg text-[#64748b] transition-colors"
          >
            {copied === 'mango' ? '✓ Copied!' : 'Copy Mango Sync Command'}
          </button>
        </div>

        <div className="flex gap-4">
          <a href="/admin" className="text-sm text-[#2563eb] hover:underline">← Admin Panel</a>
          <a href="/" className="text-sm text-[#64748b] hover:underline">Dashboard →</a>
        </div>

      </div>
    </div>
  )
}
