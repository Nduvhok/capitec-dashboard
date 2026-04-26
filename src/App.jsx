import { useState, useEffect } from "react";
import {
  AreaChart, Area, BarChart, Bar, LineChart, Line, ComposedChart,
  XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer,
  RadarChart, Radar, PolarGrid, PolarAngleAxis, PolarRadiusAxis, Cell
} from "recharts";

/* ──────────────────────────────────────────────────────────────────────
   RESPONSIVE HOOK  — single listener, mob/tab flags passed as props
────────────────────────────────────────────────────────────────────── */
function useWindowWidth() {
  const [w, setW] = useState(() =>
    typeof window !== "undefined" ? window.innerWidth : 1200
  );
  useEffect(() => {
    const h = () => setW(window.innerWidth);
    window.addEventListener("resize", h);
    return () => window.removeEventListener("resize", h);
  }, []);
  return w;
}

/* ──────────────────────────────────────────────────────────────────────
   GLOBAL CSS
────────────────────────────────────────────────────────────────────── */
const GLOBAL_CSS = `
  @import url('https://fonts.googleapis.com/css2?family=DM+Serif+Display:ital@0;1&family=DM+Sans:ital,opsz,wght@0,9..40,300;0,9..40,400;0,9..40,500;0,9..40,600;0,9..40,700&display=swap');
  *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }
  ::-webkit-scrollbar { width: 5px; height: 5px; }
  ::-webkit-scrollbar-track { background: transparent; }
  ::-webkit-scrollbar-thumb { background: rgba(100,116,139,0.35); border-radius: 3px; }
  .serif { font-family: 'DM Serif Display', serif !important; }
  .hover-lift { transition: transform 0.15s ease, box-shadow 0.15s ease; }
  .hover-lift:hover { transform: translateY(-2px); box-shadow: 0 6px 20px rgba(0,0,0,0.1); }
  .tab-btn { transition: color 0.15s, border-color 0.15s; }
  .fade-in { animation: fadeIn 0.25s ease; }
  @keyframes fadeIn { from { opacity: 0; transform: translateY(4px); } to { opacity: 1; transform: translateY(0); } }
  /* Scrollable nav strip — hide scrollbar but keep scroll */
  .nav-scroll { overflow-x: auto; -ms-overflow-style: none; scrollbar-width: none; }
  .nav-scroll::-webkit-scrollbar { display: none; }
  /* Disable hover lift on touch devices */
  @media (hover: none) { .hover-lift:hover { transform: none; box-shadow: none; } }
  /* Minimum tap-target height */
  @media (max-width: 639px) { .tab-btn { min-height: 44px; } }
`;

/* ──────────────────────────────────────────────────────────────────────
   DATA
────────────────────────────────────────────────────────────────────── */
const CO = {
  name:"Capitec Bank Holdings Limited", ticker:"CPI", exchange:"JSE",
  sector:"Retail Banking", country:"South Africa",
  ceo:"Graham Lee", cfo:"Grant Hardy",
  founded:"1 March 2001", fy:"28 February 2026",
  sharePrice:"R4,743.54", shareChg:"+54%",
  mktCap:"R550.7bn", pe:"~32x", nav:"R514.04",
  purpose:"To make a meaningful difference in people's lives by empowering them to grow.",
  highlights:[
    "Headline earnings +23% to R16.8bn",
    "ROE improved to 31% (FY25: 29%)",
    "Active clients +7% to 25.8 million",
    "Banking app clients +19% to 15.3 million",
    "Net insurance income +38% to R5.2bn",
    "VAS & Capitec Connect +38% to R6.1bn",
    "Full-year DPS +23% to 7 980 cents",
    "Market capitalisation surged to R550.7bn",
  ],
};
const FIN = [
  { yr:"FY22", nii:12616, nnii:14346, imp:3508,  opex:12555, pbt:10935, hlE:8440,  roe:26, cti:47, clr:null, ins:2446, vas:0    },
  { yr:"FY23", nii:14206, nnii:15545, imp:6329,  opex:11877, pbt:11643, hlE:9153,  roe:25, cti:40, clr:null, ins:2685, vas:1552 },
  { yr:"FY24", nii:16464, nnii:19579, imp:8725,  opex:13941, pbt:13448, hlE:10578, roe:26, cti:39, clr:null, ins:3178, vas:2714 },
  { yr:"FY25", nii:20185, nnii:23882, imp:8258,  opex:18099, pbt:17740, hlE:13739, roe:29, cti:41, clr:7.5,  ins:3777, vas:4225 },
  { yr:"FY26", nii:24079, nnii:28341, imp:9976,  opex:20238, pbt:22179, hlE:16848, roe:31, cti:39, clr:8.1,  ins:5224, vas:5650 },
];
const INS = [
  { yr:"FY22", creditLife:1540, funeral:906  },
  { yr:"FY23", creditLife:1667, funeral:1018 },
  { yr:"FY24", creditLife:1882, funeral:1296 },
  { yr:"FY25", creditLife:1905, funeral:1872 },
  { yr:"FY26", creditLife:2430, funeral:2794 },
];
const BS = [
  { yr:"FY22", assets:177943, loans:66549,  cash:99460,  other:11934, deps:134458, equity:35715, car:36, nav:30888, totalLiab:142178 },
  { yr:"FY23", assets:190636, loans:78168,  cash:98969,  other:13499, deps:146498, equity:37871, car:34, nav:32753, totalLiab:152716 },
  { yr:"FY24", assets:207579, loans:80552,  cash:111312, other:15715, deps:156015, equity:43488, car:36, nav:37611, totalLiab:164048 },
  { yr:"FY25", assets:238464, loans:89145,  cash:127796, other:21523, deps:175541, equity:50841, car:38, nav:43970, totalLiab:187550 },
  { yr:"FY26", assets:263284, loans:103760, cash:138596, other:20928, deps:190575, equity:59437, car:33, nav:51404, totalLiab:203771 },
];
const OPS = [
  { yr:"FY22", clients:18104, emp:14758, branches:853, txns:5508,  appC:null,  capex:863  },
  { yr:"FY23", clients:20105, emp:15451, branches:860, txns:8199,  appC:null,  capex:1163 },
  { yr:"FY24", clients:22173, emp:15747, branches:866, txns:9891,  appC:null,  capex:1157 },
  { yr:"FY25", clients:24132, emp:16935, branches:880, txns:11071, appC:12900, capex:1373 },
  { yr:"FY26", clients:25802, emp:17672, branches:885, txns:12312, appC:15300, capex:1136 },
];
const DVD = [
  { yr:"FY22", dps:3640, cover:2.0 },
  { yr:"FY23", dps:4200, cover:1.9 },
  { yr:"FY24", dps:4875, cover:1.9 },
  { yr:"FY25", dps:6510, cover:1.8 },
  { yr:"FY26", dps:7980, cover:1.8 },
];
const TXN_CHANNELS = [
  { name:"Digital + VAS",    value:3180, fill:"#10B981" },
  { name:"Card Payments",    value:3743, fill:"#3B82F6" },
  { name:"System-generated", value:4717, fill:"#8B5CF6" },
  { name:"Cash",             value:619,  fill:"#F59E0B" },
  { name:"Branch",           value:53,   fill:"#94A3B8" },
];
const SIX_CAPS = [
  { cap:"Financial",     score:88, icon:"💰", color:"#10B981",
    kpis:["ROE 31% (+2pp)","CAR 33% (above min)","Market Cap R550.7bn","HLe +23% to R16.8bn"] },
  { cap:"Social & Rel.", score:85, icon:"🤝", color:"#3B82F6",
    kpis:["CSAT score 85%","25.8m active clients","R8.6bn interest paid","R98.3bn loans disbursed"] },
  { cap:"Human",         score:82, icon:"👥", color:"#8B5CF6",
    kpis:["17 672 employees (+4%)","R10.3bn remuneration","170+ black mgmt nominations","First Internship Programme"] },
  { cap:"Intellectual",  score:90, icon:"💡", color:"#F59E0B",
    kpis:["15.3m app clients (+19%)","VAS R5.65bn (+34%)","Connect R442m (>100%)","3.18bn digital txns (+26%)"] },
  { cap:"Manufactured",  score:78, icon:"🏗", color:"#EF4444",
    kpis:["885 branches (+5 net)","8 771 cash devices","Card txns +23% to 3.74bn","Capex R1.1bn"] },
  { cap:"Natural",       score:62, icon:"🌱", color:"#06B6D4",
    kpis:["Limited direct footprint","Net zero pathway committed","ESG performance improving","Sustainability focus"] },
];
const STRAT = [
  { name:"Client Obsession",
    status:"On Track",
    lifecycle:"Established pillar — scaling phase",
    pct:80,
    icon:"🎯",
    metric:"+100k clients/month",
    desc:"7% client growth maintained with 100k+ new clients/month sustained. Consistent long-term trajectory anchored in Capitec's founding fundamentals and digital-first acquisition model." },

  { name:"Digital Platform",
    status:"Exceeding",
    lifecycle:"Scaling ahead of expectations",
    pct:95,
    icon:"📱",
    metric:"15.3m app clients",
    desc:"App clients +19% vs. active client base +7% — digital adoption outpacing overall growth. 59% of active clients now on the banking app; digital and VAS transaction volumes up 26%." },

  { name:"VAS & Insurance",
    status:"Exceeding",
    lifecycle:"Scaling ahead of expectations",
    pct:92,
    icon:"🛡",
    metric:"+38% non-int. income",
    desc:"Three simultaneous beats: Connect +129% to R442m, VAS +34% to R5.65bn, Credit Life fully transferred to own Capitec Life licence from September 2025. Own-licence transition materially improves unit economics." },

  { name:"Business Banking",
    status:"Building",
    lifecycle:"Early-to-mid scale phase",
    pct:60,
    icon:"🏢",
    metric:"CLR 2.4%",
    desc:"Entrepreneur Account launched December 2025 targeting sole proprietors and informal SMEs. Management explicitly frames FY2027 as 'continuing to build the business bank of choice for SMEs'." },

  { name:"International – AvaFin",
    status:"Building",
    lifecycle:"Integration and early scale phase",
    pct:45,
    icon:"🌍",
    metric:"Consolidated May 2024",
    desc:"~21 months post-acquisition. CLR at 53.2% signals credit book still normalising. Too early to assess structural performance — integration and early scale phase by management's own framing." },

  { name:"Cost Leadership",
    status:"On Track",
    lifecycle:"Embedded discipline — investment phase",
    pct:75,
    icon:"⚙",
    metric:"CTI 39%",
    desc:"CTI held at 39% despite 12% opex growth and full-year AvaFin consolidation. Management: 'Cost discipline gives us the capacity to invest from strength, not under duress.'" },
];

/* ──────────────────────────────────────────────────────────────────────
   THEMES
────────────────────────────────────────────────────────────────────── */
const TH = {
  light:{
    bg:"#F4F2EC", surface:"#FFFFFF", surfaceAlt:"#F8F7F2",
    border:"#E6E3D8", text:"#0D1520", textSub:"#475569", textMuted:"#94A3B8",
    green:"#10B981", amber:"#D97706", red:"#DC2626", blue:"#2563EB", purple:"#7C3AED",
    accentBg:"#ECFDF5", headerBg:"#0D1520", headerBorder:"#1E293B",
    navBg:"#FFFFFF", navBorder:"#E6E3D8", grid:"#E2E8F0",
    c1:"#0D5C40", c2:"#10B981", c3:"#F59E0B", c4:"#3B82F6", c5:"#8B5CF6",
  },
  dark:{
    bg:"#0A1220", surface:"#0F1E31", surfaceAlt:"#0C1826",
    border:"#172840", text:"#E1EAF6", textSub:"#8FA3BF", textMuted:"#3D5470",
    green:"#10B981", amber:"#F59E0B", red:"#EF4444", blue:"#60A5FA", purple:"#A78BFA",
    accentBg:"#0A2E20", headerBg:"#07101D", headerBorder:"#172840",
    navBg:"#0A1220", navBorder:"#172840", grid:"#172840",
    c1:"#10B981", c2:"#34D399", c3:"#FCD34D", c4:"#60A5FA", c5:"#A78BFA",
  },
};
const TABS = ["Overview","Income","Balance Sheet","Business Model","Six Capitals","Strategy"];

/* ──────────────────────────────────────────────────────────────────────
   LAYOUT HELPER
   g(mobile, tablet, desktop) — picks value for current breakpoint
   cols(m, tb, d) — returns { display:"grid", gridTemplateColumns:... }
────────────────────────────────────────────────────────────────────── */
const mkH = (mob, tab) => ({
  g:    (m, tb, d) => mob ? m : tab ? tb : d,
  cols: (m, tb, d) => ({ display:"grid", gridTemplateColumns: mob ? m : tab ? tb : d }),
});

/* ──────────────────────────────────────────────────────────────────────
   SHARED COMPONENTS
────────────────────────────────────────────────────────────────────── */
function KpiCard({ label, value, change, note, t, accentColor }) {
  const pos = change && !change.startsWith("-");
  const neg = change && change.startsWith("-");
  return (
    <div className="hover-lift" style={{
      background:t.surface, border:`1px solid ${t.border}`, borderRadius:12,
      padding:"14px 16px", overflow:"hidden",
      borderTop: accentColor ? `3px solid ${accentColor}` : `1px solid ${t.border}`,
    }}>
      <div style={{ fontSize:9, fontWeight:700, letterSpacing:"0.1em", textTransform:"uppercase", color:t.textMuted, marginBottom:8 }}>{label}</div>
      <div className="serif" style={{ fontSize:22, color:t.text, lineHeight:1.1 }}>{value}</div>
      {(change||note) && (
        <div style={{ marginTop:6, display:"flex", alignItems:"center", gap:6, flexWrap:"wrap" }}>
          {change && <span style={{ fontSize:11, fontWeight:600, color:neg?t.red:pos?t.green:t.textMuted }}>{change} YoY</span>}
          {note  && <span style={{ fontSize:10, color:t.textMuted }}>{note}</span>}
        </div>
      )}
    </div>
  );
}

function Card({ title, subtitle, children, t }) {
  return (
    <div style={{ background:t.surface, border:`1px solid ${t.border}`, borderRadius:12, padding:"16px 18px" }}>
      {title && (
        <div style={{ marginBottom:14 }}>
          <div style={{ fontSize:13, fontWeight:700, color:t.text }}>{title}</div>
          {subtitle && <div style={{ fontSize:11, color:t.textMuted, marginTop:2 }}>{subtitle}</div>}
        </div>
      )}
      {children}
    </div>
  );
}

function TTip({ active, payload, label, t, fmt }) {
  if (!active || !payload?.length) return null;
  return (
    <div style={{ background:t.surface, border:`1px solid ${t.border}`, borderRadius:8, padding:"10px 14px", fontSize:12, boxShadow:"0 4px 16px rgba(0,0,0,0.15)", maxWidth:220 }}>
      <div style={{ fontWeight:700, color:t.textSub, marginBottom:6 }}>{label}</div>
      {payload.map((p, i) => (
        <div key={i} style={{ display:"flex", alignItems:"center", gap:6, marginBottom:3, flexWrap:"wrap" }}>
          <div style={{ width:8, height:8, borderRadius:2, background:p.color||p.fill, flexShrink:0 }} />
          <span style={{ color:t.textSub }}>{p.name}:</span>
          <span style={{ fontWeight:700, color:t.text }}>{fmt ? fmt(p.value,p.name) : `R${Number(p.value).toLocaleString()}m`}</span>
        </div>
      ))}
    </div>
  );
}

function SectionHero({ title, subtitle, t, mob }) {
  return (
    <div style={{ background:t.surface, border:`1px solid ${t.border}`, borderRadius:12, padding: mob?"16px 18px":"22px 28px" }}>
      <h2 className="serif" style={{ fontSize:mob?18:22, color:t.text, marginBottom:6 }}>{title}</h2>
      {subtitle && <p style={{ fontSize:mob?12:13, color:t.textSub, lineHeight:1.7 }}>{subtitle}</p>}
    </div>
  );
}

function ProgressBar({ label, value, max, color, t }) {
  const pct = Math.round((value/max)*100);
  return (
    <div style={{ marginBottom:14 }}>
      <div style={{ display:"flex", justifyContent:"space-between", fontSize:12, marginBottom:5, gap:8 }}>
        <span style={{ color:t.textSub, flexShrink:0 }}>{label}</span>
        <span style={{ color:t.text, fontWeight:600, whiteSpace:"nowrap" }}>R{(value/1000).toFixed(1)}bn ({pct}%)</span>
      </div>
      <div style={{ background:t.border, borderRadius:4, height:8, overflow:"hidden" }}>
        <div style={{ width:`${pct}%`, height:"100%", background:color, borderRadius:4 }} />
      </div>
    </div>
  );
}

/* ──────────────────────────────────────────────────────────────────────
   OVERVIEW TAB
────────────────────────────────────────────────────────────────────── */
function OverviewTab({ t, mob, tab }) {
  const { cols } = mkH(mob, tab);
  return (
    <div className="fade-in" style={{ display:"flex", flexDirection:"column", gap:16 }}>

      {/* Hero */}
      <div style={{ background:`linear-gradient(130deg,${t.c1} 0%,${t.c2} 100%)`, borderRadius:16, padding:mob?"20px 18px":"28px 32px", color:"white", position:"relative", overflow:"hidden" }}>
        {!mob && <><div style={{ position:"absolute",top:-50,right:-50,width:220,height:220,borderRadius:"50%",background:"rgba(255,255,255,0.06)" }}/><div style={{ position:"absolute",bottom:-60,right:80,width:160,height:160,borderRadius:"50%",background:"rgba(255,255,255,0.04)" }}/></>}
        <div style={{ display:"flex", flexDirection:mob?"column":"row", justifyContent:"space-between", alignItems:"flex-start", gap:16 }}>
          <div style={{ flex:1 }}>
            <div style={{ fontSize:10, fontWeight:600, letterSpacing:"0.12em", textTransform:"uppercase", opacity:0.7, marginBottom:8 }}>{CO.sector} · {CO.country} · {CO.exchange} · {CO.fy}</div>
            <h1 className="serif" style={{ fontSize:mob?22:28, fontWeight:400, marginBottom:8, lineHeight:1.15 }}>FY2026 Research Summary</h1>
            <p style={{ fontSize:mob?12:13, opacity:0.85, lineHeight:1.7 }}>{CO.purpose}</p>
          </div>
          <div style={{ display:"grid", gridTemplateColumns:mob?"1fr 1fr":"1fr", gap:6, width:mob?"100%":"auto" }}>
            {CO.highlights.map((h,i) => (
              <div key={i} style={{ fontSize:mob?10:12, background:"rgba(255,255,255,0.12)", borderRadius:6, padding:mob?"5px 9px":"4px 12px", backdropFilter:"blur(8px)", lineHeight:1.4 }}>✓ {h}</div>
            ))}
          </div>
        </div>
      </div>

      {/* KPI rows — 2-col mobile/tablet, 4-col desktop */}
      <div style={{ ...cols("1fr 1fr","1fr 1fr","repeat(4,1fr)"), gap:10 }}>
        <KpiCard label="Headline Earnings"  value="R16.8bn" change="+23%" t={t} accentColor={t.green}  />
        <KpiCard label="Return on Equity"   value="31%"     change="+2pp" t={t} accentColor={t.blue}   />
        <KpiCard label="Cost-to-Income"     value="39%"     change="-2pp" note="(favourable)" t={t} accentColor={t.amber}  />
        <KpiCard label="Op. Profit bfr Tax" value="R22.2bn" change="+25%" t={t} accentColor={t.purple} />
      </div>
      <div style={{ ...cols("1fr 1fr","1fr 1fr","repeat(4,1fr)"), gap:10 }}>
        <KpiCard label="Active Clients"      value="25.8m"   change="+7%"  t={t} accentColor={t.c4}    />
        <KpiCard label="App Clients"         value="15.3m"   change="+19%" t={t} accentColor="#06B6D4"  />
        <KpiCard label="Full-year DPS"       value="7 980c"  change="+23%" t={t} accentColor={t.red}    />
        <KpiCard label="Market Cap"          value="R550.7bn"change="+54%" t={t} accentColor={t.green}  />
      </div>

      {/* Charts — stacked on mobile, 2-col tablet, 2fr+1fr+1fr desktop */}
      <div style={{ ...cols("1fr","1fr 1fr","2fr 1fr 1fr"), gap:14 }}>
        <Card title="Revenue & Headline Earnings — 5 Year" subtitle="R'm | bars=NII+NNII | line=headline earnings" t={t}>
          <ResponsiveContainer width="100%" height={mob?200:230}>
            <ComposedChart data={FIN} margin={{ top:4,right:4,left:0,bottom:0 }}>
              <CartesianGrid strokeDasharray="3 3" stroke={t.grid} />
              <XAxis dataKey="yr" tick={{ fontSize:10,fill:t.textMuted }} axisLine={false} tickLine={false} />
              <YAxis yAxisId="left"  tick={{ fontSize:9,fill:t.textMuted }} axisLine={false} tickLine={false} width={mob?44:58} tickFormatter={v=>`R${(v/1000).toFixed(0)}bn`} />
              <YAxis yAxisId="right" orientation="right" tick={{ fontSize:9,fill:t.textMuted }} axisLine={false} tickLine={false} width={mob?42:58} tickFormatter={v=>`R${(v/1000).toFixed(0)}bn`} />
              <Tooltip content={<TTip t={t} />} />
              <Legend wrapperStyle={{ fontSize:10,color:t.textMuted }} />
              <Bar yAxisId="left" dataKey="nii"  name="NII"  stackId="a" fill={t.c1} />
              <Bar yAxisId="left" dataKey="nnii" name="NNII" stackId="a" fill={t.c2} radius={[3,3,0,0]} />
              <Line yAxisId="right" type="monotone" dataKey="hlE" name="Headline Earnings" stroke={t.amber} strokeWidth={2.5} dot={{ r:3,fill:t.amber,stroke:t.surface,strokeWidth:2 }} />
            </ComposedChart>
          </ResponsiveContainer>
        </Card>
        <Card title="Active Client Base" subtitle="millions of clients — 5 year" t={t}>
          <ResponsiveContainer width="100%" height={mob?180:230}>
            <AreaChart data={OPS} margin={{ top:4,right:4,left:0,bottom:0 }}>
              <defs><linearGradient id="cg1" x1="0" y1="0" x2="0" y2="1"><stop offset="5%" stopColor={t.c4} stopOpacity={0.3}/><stop offset="95%" stopColor={t.c4} stopOpacity={0}/></linearGradient></defs>
              <CartesianGrid strokeDasharray="3 3" stroke={t.grid} />
              <XAxis dataKey="yr" tick={{ fontSize:10,fill:t.textMuted }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fontSize:9,fill:t.textMuted }} axisLine={false} tickLine={false} width={mob?40:50} tickFormatter={v=>`${(v/1000).toFixed(0)}m`} />
              <Tooltip content={<TTip t={t} fmt={v=>`${(v/1000).toFixed(1)}m`} />} />
              <Area type="monotone" dataKey="clients" name="Active Clients" stroke={t.c4} fill="url(#cg1)" strokeWidth={2.5} dot={{ r:3 }} />
            </AreaChart>
          </ResponsiveContainer>
        </Card>
        <Card title="ROE vs CTI" subtitle="% — 5 year" t={t}>
          <ResponsiveContainer width="100%" height={mob?180:230}>
            <LineChart data={FIN} margin={{ top:4,right:4,left:0,bottom:0 }}>
              <CartesianGrid strokeDasharray="3 3" stroke={t.grid} />
              <XAxis dataKey="yr" tick={{ fontSize:10,fill:t.textMuted }} axisLine={false} tickLine={false} />
              <YAxis domain={[20,55]} tick={{ fontSize:9,fill:t.textMuted }} axisLine={false} tickLine={false} width={32} tickFormatter={v=>`${v}%`} />
              <Tooltip content={<TTip t={t} fmt={v=>`${v}%`} />} />
              <Legend wrapperStyle={{ fontSize:10,color:t.textMuted }} />
              <Line type="monotone" dataKey="roe" name="ROE %" stroke={t.green} strokeWidth={2.5} dot={{ r:3 }} />
              <Line type="monotone" dataKey="cti" name="CTI %" stroke={t.amber} strokeWidth={2.5} dot={{ r:3 }} strokeDasharray="5 3" />
            </LineChart>
          </ResponsiveContainer>
        </Card>
      </div>

      {/* Footer cards — 1-col mobile, 2-col tablet, 3-col desktop */}
      <div style={{ ...cols("1fr","1fr 1fr","1fr 1fr 1fr"), gap:14 }}>
        <Card t={t} title="Company Profile">
          {[["CEO",CO.ceo],["CFO",CO.cfo],["Year Founded",CO.founded],["FY End",CO.fy],["Sector",CO.sector],["Exchange",`${CO.ticker} · ${CO.exchange}`]].map(([k,v]) => (
            <div key={k} style={{ display:"flex", justifyContent:"space-between", padding:"7px 0", borderBottom:`1px solid ${t.border}`, fontSize:12, gap:8, flexWrap:"wrap" }}>
              <span style={{ color:t.textSub }}>{k}</span>
              <span style={{ color:t.text, fontWeight:600, textAlign:"right" }}>{v}</span>
            </div>
          ))}
        </Card>
        <Card t={t} title="Market Snapshot">
          {[["Share Price",CO.sharePrice],["YTD Performance",CO.shareChg],["Market Cap",CO.mktCap],["P/E Ratio",CO.pe],["NAV/Share",CO.nav],["Shares in Issue","116.1m"]].map(([k,v]) => (
            <div key={k} style={{ display:"flex", justifyContent:"space-between", padding:"7px 0", borderBottom:`1px solid ${t.border}`, fontSize:12, gap:8 }}>
              <span style={{ color:t.textSub }}>{k}</span>
              <span style={{ color:t.text, fontWeight:600 }}>{v}</span>
            </div>
          ))}
        </Card>
        <Card t={t} title="FY2026 Headlines">
          {CO.highlights.map((h,i) => (
            <div key={i} style={{ display:"flex", gap:8, padding:"6px 0", borderBottom:`1px solid ${t.border}`, alignItems:"flex-start" }}>
              <span style={{ color:t.green, fontWeight:700, flexShrink:0, marginTop:1 }}>✓</span>
              <span style={{ fontSize:12, color:t.textSub, lineHeight:1.5 }}>{h}</span>
            </div>
          ))}
        </Card>
      </div>
    </div>
  );
}

/* ──────────────────────────────────────────────────────────────────────
   INCOME TAB
────────────────────────────────────────────────────────────────────── */
function IncomeTab({ t, mob, tab }) {
  const { cols } = mkH(mob, tab);
  const insData = FIN.map((f,i) => ({ yr:f.yr, "Credit Life":INS[i].creditLife, "Funeral/Life":INS[i].funeral }));
  return (
    <div className="fade-in" style={{ display:"flex", flexDirection:"column", gap:16 }}>
      <SectionHero title="Income Statement Analysis" subtitle="Five-year P&L trend. Revenue = NII from lending/investments + NNII from transactions, VAS, insurance and FX." t={t} mob={mob} />
      <div style={{ ...cols("1fr 1fr","repeat(3,1fr)","repeat(5,1fr)"), gap:10 }}>
        <KpiCard label="Net Interest Income"   value="R24.1bn" change="+19%"                 t={t} accentColor={t.c1}   />
        <KpiCard label="Net Non-Interest Inc." value="R28.3bn" change="+19%"                 t={t} accentColor={t.c2}   />
        <KpiCard label="Credit Impairments"    value="R10.0bn" change="+21%" note="CLR 8.1%" t={t} accentColor={t.red}  />
        <KpiCard label="Operating Expenses"    value="R20.2bn" change="+12%"                 t={t} accentColor={t.amber} />
        <KpiCard label="Op. Profit bfr Tax"    value="R22.2bn" change="+25%"                 t={t} accentColor={t.blue} />
      </div>
      <div style={{ ...cols("1fr","1fr","3fr 2fr"), gap:14 }}>
        <Card title="Income Composition — 5 Year" subtitle="Stacked: NII & NNII (R'm)" t={t}>
          <ResponsiveContainer width="100%" height={mob?200:260}>
            <BarChart data={FIN} barSize={mob?22:38} margin={{ top:4,right:4,left:0,bottom:0 }}>
              <CartesianGrid strokeDasharray="3 3" stroke={t.grid} />
              <XAxis dataKey="yr" tick={{ fontSize:10,fill:t.textMuted }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fontSize:9,fill:t.textMuted }} axisLine={false} tickLine={false} width={mob?44:60} tickFormatter={v=>`R${(v/1000).toFixed(0)}bn`} />
              <Tooltip content={<TTip t={t} />} /><Legend wrapperStyle={{ fontSize:10,color:t.textMuted }} />
              <Bar dataKey="nii"  name="Net Interest Income"     stackId="a" fill={t.c1} />
              <Bar dataKey="nnii" name="Net Non-Interest Income" stackId="a" fill={t.c2} radius={[3,3,0,0]} />
            </BarChart>
          </ResponsiveContainer>
        </Card>
        <Card title="Headline Earnings Trend" subtitle="R'm — ~19% CAGR" t={t}>
          <ResponsiveContainer width="100%" height={mob?180:260}>
            <AreaChart data={FIN} margin={{ top:4,right:4,left:0,bottom:0 }}>
              <defs><linearGradient id="eg1" x1="0" y1="0" x2="0" y2="1"><stop offset="5%" stopColor={t.green} stopOpacity={0.28}/><stop offset="95%" stopColor={t.green} stopOpacity={0}/></linearGradient></defs>
              <CartesianGrid strokeDasharray="3 3" stroke={t.grid} />
              <XAxis dataKey="yr" tick={{ fontSize:10,fill:t.textMuted }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fontSize:9,fill:t.textMuted }} axisLine={false} tickLine={false} width={mob?44:62} tickFormatter={v=>`R${(v/1000).toFixed(0)}bn`} />
              <Tooltip content={<TTip t={t} />} />
              <Area type="monotone" dataKey="hlE" name="Headline Earnings" stroke={t.green} fill="url(#eg1)" strokeWidth={2.5} dot={{ r:3 }} />
            </AreaChart>
          </ResponsiveContainer>
        </Card>
      </div>
      <div style={{ ...cols("1fr","1fr 1fr","1fr 1fr 1fr"), gap:14 }}>
        <Card title="Credit Impairments & CLR" subtitle="R'm (bars) | CLR % (line)" t={t}>
          <ResponsiveContainer width="100%" height={mob?170:200}>
            <ComposedChart data={FIN} margin={{ top:4,right:8,left:0,bottom:0 }}>
              <CartesianGrid strokeDasharray="3 3" stroke={t.grid} />
              <XAxis dataKey="yr" tick={{ fontSize:10,fill:t.textMuted }} axisLine={false} tickLine={false} />
              <YAxis yAxisId="l" tick={{ fontSize:9,fill:t.textMuted }} axisLine={false} tickLine={false} width={mob?42:58} tickFormatter={v=>`R${(v/1000).toFixed(1)}bn`} />
              <YAxis yAxisId="r" orientation="right" domain={[0,12]} tick={{ fontSize:9,fill:t.textMuted }} axisLine={false} tickLine={false} width={28} tickFormatter={v=>`${v}%`} />
              <Tooltip content={<TTip t={t} fmt={(v,n)=>n==="CLR %"?`${v}%`:`R${Number(v).toLocaleString()}m`} />} />
              <Bar yAxisId="l" dataKey="imp" name="Impairments" fill={t.red} opacity={0.75} radius={[3,3,0,0]} />
              <Line yAxisId="r" type="monotone" dataKey="clr" name="CLR %" stroke={t.amber} strokeWidth={2.5} dot={{ r:3 }} connectNulls={false} />
            </ComposedChart>
          </ResponsiveContainer>
        </Card>
        <Card title="Insurance Income" subtitle="Credit Life vs Funeral/Life (R'm)" t={t}>
          <ResponsiveContainer width="100%" height={mob?170:200}>
            <BarChart data={insData} margin={{ top:4,right:4,left:0,bottom:0 }}>
              <CartesianGrid strokeDasharray="3 3" stroke={t.grid} />
              <XAxis dataKey="yr" tick={{ fontSize:10,fill:t.textMuted }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fontSize:9,fill:t.textMuted }} axisLine={false} tickLine={false} width={mob?42:58} tickFormatter={v=>`R${(v/1000).toFixed(1)}bn`} />
              <Tooltip content={<TTip t={t} />} /><Legend wrapperStyle={{ fontSize:10,color:t.textMuted }} />
              <Bar dataKey="Credit Life"  stackId="a" fill={t.c4} />
              <Bar dataKey="Funeral/Life" stackId="a" fill={t.c5} radius={[3,3,0,0]} />
            </BarChart>
          </ResponsiveContainer>
        </Card>
        <Card title="VAS & Connect Revenue" subtitle="Non-interest income diversification (R'm)" t={t}>
          <ResponsiveContainer width="100%" height={mob?170:200}>
            <BarChart data={FIN} margin={{ top:4,right:4,left:0,bottom:0 }}>
              <CartesianGrid strokeDasharray="3 3" stroke={t.grid} />
              <XAxis dataKey="yr" tick={{ fontSize:10,fill:t.textMuted }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fontSize:9,fill:t.textMuted }} axisLine={false} tickLine={false} width={mob?42:58} tickFormatter={v=>`R${(v/1000).toFixed(1)}bn`} />
              <Tooltip content={<TTip t={t} />} />
              <Bar dataKey="vas" name="VAS & Connect" fill={t.amber} radius={[3,3,0,0]}>
                {FIN.map((_,i)=><Cell key={i} fill={i===4?t.amber:t.amber+"99"} />)}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </Card>
      </div>
      {/* P&L Table */}
      <div style={{ background:t.surface, border:`1px solid ${t.border}`, borderRadius:12, overflow:"hidden" }}>
        <div style={{ padding:"14px 18px", borderBottom:`1px solid ${t.border}` }}>
          <span style={{ fontSize:13, fontWeight:700, color:t.text }}>5-Year P&L Summary (R'm)</span>
        </div>
        <div style={{ overflowX:"auto", WebkitOverflowScrolling:"touch" }}>
          <table style={{ width:"100%", borderCollapse:"collapse", fontSize:mob?11:12, minWidth:480 }}>
            <thead>
              <tr style={{ background:t.surfaceAlt }}>
                {["Line Item","FY22","FY23","FY24","FY25","FY26","CAGR"].map((h,i)=>(
                  <th key={i} style={{ padding:mob?"7px 10px":"10px 16px", textAlign:i===0?"left":"right", color:t.textMuted, fontWeight:600, fontSize:10, textTransform:"uppercase", letterSpacing:"0.04em", borderBottom:`1px solid ${t.border}`, whiteSpace:"nowrap" }}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {[
                ["Net Interest Inc.",     [12616,14206,16464,20185,24079],false],
                ["Net Non-Interest Inc.", [14346,15545,19579,23882,28341],false],
                ["Total Income",          [26962,29751,36043,44067,52420],false],
                ["Credit Impairments",    [3508, 6329, 8725, 8258, 9976], false],
                ["Op. Expenses",          [12555,11877,13941,18099,20238],false],
                ["Op. Profit bfr Tax",    [10935,11643,13448,17740,22179],false],
                ["Headline Earnings",     [8440, 9153,10578,13739,16848], true ],
              ].map(([label,vals,highlight],ri)=>{
                const cagr=(((vals[4]/vals[0])**(1/4))-1)*100;
                return (
                  <tr key={ri} style={{ borderBottom:`1px solid ${t.border}`, background:highlight?t.accentBg:ri%2===0?"transparent":t.surfaceAlt }}>
                    <td style={{ padding:mob?"7px 10px":"9px 16px", color:highlight?t.green:t.text, fontWeight:highlight?700:500, whiteSpace:"nowrap" }}>{label}</td>
                    {vals.map((v,i)=>(
                      <td key={i} style={{ padding:mob?"7px 10px":"9px 16px", textAlign:"right", color:highlight?t.green:t.text, fontWeight:highlight?700:400, fontFamily:"monospace" }}>{v.toLocaleString()}</td>
                    ))}
                    <td style={{ padding:mob?"7px 10px":"9px 16px", textAlign:"right", fontWeight:700, fontFamily:"monospace", color:cagr>18?t.green:cagr>10?t.amber:t.red }}>{cagr.toFixed(1)}%</td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

/* ──────────────────────────────────────────────────────────────────────
   BALANCE SHEET TAB
────────────────────────────────────────────────────────────────────── */
function BalanceSheetTab({ t, mob, tab }) {
  const { cols } = mkH(mob, tab);
  return (
    <div className="fade-in" style={{ display:"flex", flexDirection:"column", gap:16 }}>
      <SectionHero title="Balance Sheet Analysis" subtitle="Total assets grew 10% to R263.3bn in FY2026 with strong equity growth and robust capital adequacy." t={t} mob={mob} />
      <div style={{ ...cols("1fr 1fr","repeat(3,1fr)","repeat(5,1fr)"), gap:10 }}>
        <KpiCard label="Total Assets"         value="R263.3bn" change="+10%" t={t} accentColor={t.blue}  />
        <KpiCard label="Loans & Advances"     value="R103.8bn" change="+16%" t={t} accentColor={t.c1}   />
        <KpiCard label="Cash & Investments"   value="R138.6bn" change="+8%"  t={t} accentColor={t.c4}   />
        <KpiCard label="Deposits & Funding"   value="R190.6bn" change="+9%"  t={t} accentColor={t.c5}   />
        <KpiCard label="Shareholders' Equity" value="R59.4bn"  change="+17%" t={t} accentColor={t.amber} />
      </div>
      <div style={{ ...cols("1fr","1fr","2fr 1fr"), gap:14 }}>
        <Card title="Asset Base Growth" subtitle="Total assets vs Loans and Deposits (R'bn)" t={t}>
          <ResponsiveContainer width="100%" height={mob?200:260}>
            <AreaChart data={BS} margin={{ top:4,right:4,left:0,bottom:0 }}>
              <defs>
                <linearGradient id="ag1" x1="0" y1="0" x2="0" y2="1"><stop offset="5%" stopColor={t.blue} stopOpacity={0.2}/><stop offset="95%" stopColor={t.blue} stopOpacity={0}/></linearGradient>
                <linearGradient id="lg1" x1="0" y1="0" x2="0" y2="1"><stop offset="5%" stopColor={t.green} stopOpacity={0.2}/><stop offset="95%" stopColor={t.green} stopOpacity={0}/></linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke={t.grid} />
              <XAxis dataKey="yr" tick={{ fontSize:10,fill:t.textMuted }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fontSize:9,fill:t.textMuted }} axisLine={false} tickLine={false} width={mob?44:65} tickFormatter={v=>`R${(v/1000).toFixed(0)}bn`} />
              <Tooltip content={<TTip t={t} />} /><Legend wrapperStyle={{ fontSize:10,color:t.textMuted }} />
              <Area type="monotone" dataKey="assets" name="Total Assets"     stroke={t.blue}  fill="url(#ag1)" strokeWidth={2} />
              <Area type="monotone" dataKey="loans"  name="Loans & Advances" stroke={t.green} fill="url(#lg1)" strokeWidth={2} />
              <Area type="monotone" dataKey="deps"   name="Deposits"         stroke={t.c5}    fill="none"      strokeWidth={1.5} strokeDasharray="5 3" />
            </AreaChart>
          </ResponsiveContainer>
        </Card>
        <Card title="FY2026 Asset & Funding Mix" t={t}>
          <div style={{ fontSize:11,color:t.textMuted,fontWeight:700,textTransform:"uppercase",letterSpacing:"0.08em",marginBottom:12 }}>Assets</div>
          <ProgressBar label="Cash & Investments" value={138596} max={263284} color={t.c4}       t={t} />
          <ProgressBar label="Loans & Advances"   value={103760} max={263284} color={t.green}    t={t} />
          <ProgressBar label="Other Assets"       value={20928}  max={263284} color={t.textMuted} t={t} />
          <div style={{ marginTop:16,paddingTop:14,borderTop:`1px solid ${t.border}` }}>
            <div style={{ fontSize:11,color:t.textMuted,fontWeight:700,textTransform:"uppercase",letterSpacing:"0.08em",marginBottom:12 }}>Funding</div>
            <ProgressBar label="Deposits & Wholesale" value={190575} max={263284} color={t.c5}   t={t} />
            <ProgressBar label="Shareholders' Equity" value={59437}  max={263284} color={t.amber} t={t} />
            <ProgressBar label="Other Liabilities"    value={13272}  max={263284} color={t.red}   t={t} />
          </div>
        </Card>
      </div>
      <div style={{ ...cols("1fr","1fr 1fr","1fr 1fr 1fr"), gap:14 }}>
        <Card title="Equity Growth & NAV/Share" subtitle="Equity R'm (bars) | NAV cents (line)" t={t}>
          <ResponsiveContainer width="100%" height={mob?170:200}>
            <ComposedChart data={BS} margin={{ top:4,right:8,left:0,bottom:0 }}>
              <CartesianGrid strokeDasharray="3 3" stroke={t.grid} />
              <XAxis dataKey="yr" tick={{ fontSize:10,fill:t.textMuted }} axisLine={false} tickLine={false} />
              <YAxis yAxisId="l" tick={{ fontSize:9,fill:t.textMuted }} axisLine={false} tickLine={false} width={mob?40:60} tickFormatter={v=>`R${(v/1000).toFixed(0)}bn`} />
              <YAxis yAxisId="r" orientation="right" tick={{ fontSize:9,fill:t.textMuted }} axisLine={false} tickLine={false} width={mob?38:55} tickFormatter={v=>`${(v/100).toFixed(0)}c`} />
              <Tooltip content={<TTip t={t} fmt={(v,n)=>n==="NAV/Share"?`${v.toLocaleString()}c`:`R${(v/1000).toFixed(1)}bn`} />} />
              <Bar yAxisId="l" dataKey="equity" name="Equity"    fill={t.amber} opacity={0.8} radius={[3,3,0,0]} />
              <Line yAxisId="r" type="monotone" dataKey="nav"  name="NAV/Share" stroke={t.blue} strokeWidth={2.5} dot={{ r:3 }} />
            </ComposedChart>
          </ResponsiveContainer>
        </Card>
        <Card title="Loan Book vs Cash Investments" subtitle="R'm — 5 year" t={t}>
          <ResponsiveContainer width="100%" height={mob?170:200}>
            <BarChart data={BS} barSize={mob?16:26} margin={{ top:4,right:4,left:0,bottom:0 }}>
              <CartesianGrid strokeDasharray="3 3" stroke={t.grid} />
              <XAxis dataKey="yr" tick={{ fontSize:10,fill:t.textMuted }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fontSize:9,fill:t.textMuted }} axisLine={false} tickLine={false} width={mob?42:60} tickFormatter={v=>`R${(v/1000).toFixed(0)}bn`} />
              <Tooltip content={<TTip t={t} />} /><Legend wrapperStyle={{ fontSize:10,color:t.textMuted }} />
              <Bar dataKey="loans" name="Loans"       fill={t.green} />
              <Bar dataKey="cash"  name="Cash & Inv." fill={t.c4}   />
            </BarChart>
          </ResponsiveContainer>
        </Card>
        <Card title="Capital Adequacy Ratio (CAR)" subtitle="% — min. regulatory requirement ~10.5%" t={t}>
          <ResponsiveContainer width="100%" height={mob?170:200}>
            <BarChart data={BS} margin={{ top:4,right:4,left:0,bottom:0 }}>
              <CartesianGrid strokeDasharray="3 3" stroke={t.grid} />
              <XAxis dataKey="yr" tick={{ fontSize:10,fill:t.textMuted }} axisLine={false} tickLine={false} />
              <YAxis domain={[0,50]} tick={{ fontSize:9,fill:t.textMuted }} axisLine={false} tickLine={false} width={32} tickFormatter={v=>`${v}%`} />
              <Tooltip content={<TTip t={t} fmt={v=>`${v}%`} />} />
              <Bar dataKey="car" name="CAR %" radius={[3,3,0,0]}>
                {BS.map((d,i)=><Cell key={i} fill={d.car>=35?t.green:d.car>=25?t.amber:t.red} />)}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </Card>
      </div>
      {/* BS Table */}
      <div style={{ background:t.surface, border:`1px solid ${t.border}`, borderRadius:12, overflow:"hidden" }}>
        <div style={{ padding:"14px 18px", borderBottom:`1px solid ${t.border}` }}>
          <span style={{ fontSize:13,fontWeight:700,color:t.text }}>5-Year Balance Sheet Summary (R'm)</span>
        </div>
        <div style={{ overflowX:"auto", WebkitOverflowScrolling:"touch" }}>
          <table style={{ width:"100%", borderCollapse:"collapse", fontSize:mob?11:12, minWidth:420 }}>
            <thead>
              <tr style={{ background:t.surfaceAlt }}>
                {["","FY22","FY23","FY24","FY25","FY26"].map((h,i)=>(
                  <th key={i} style={{ padding:mob?"7px 10px":"10px 16px", textAlign:i===0?"left":"right", color:t.textMuted, fontWeight:600, fontSize:10, textTransform:"uppercase", letterSpacing:"0.04em", borderBottom:`1px solid ${t.border}`, whiteSpace:"nowrap" }}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {[
                ["Total Assets",          BS.map(b=>b.assets),         false],
                ["  Loans & Advances",    BS.map(b=>b.loans),          false],
                ["  Cash & Investments",  BS.map(b=>b.cash),           false],
                ["Total Liabilities",     BS.map(b=>b.totalLiab),false],
                ["  Deposits",            BS.map(b=>b.deps),           false],
                ["Shareholders' Equity",  BS.map(b=>b.equity),         true ],
                ["CAR %",                 BS.map(b=>b.car),            false,"%"],
                ["ROE %",                 FIN.map(f=>f.roe),           false,"%"],
              ].map(([label,vals,highlight,suffix],ri)=>(
                <tr key={ri} style={{ borderBottom:`1px solid ${t.border}`, background:highlight?t.accentBg:ri%2===0?"transparent":t.surfaceAlt }}>
                  <td style={{ padding:mob?"7px 10px":"9px 16px", color:highlight?t.green:t.text, fontWeight:highlight?700:500, whiteSpace:"nowrap" }}>{label}</td>
                  {vals.map((v,i)=>(
                    <td key={i} style={{ padding:mob?"7px 10px":"9px 16px", textAlign:"right", color:highlight?t.green:t.text, fontWeight:highlight?700:400, fontFamily:"monospace" }}>
                      {suffix?`${v}${suffix}`:v.toLocaleString()}
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

/* ──────────────────────────────────────────────────────────────────────
   BUSINESS MODEL TAB
────────────────────────────────────────────────────────────────────── */
function BusinessModelTab({ t, mob, tab }) {
  const { cols } = mkH(mob, tab);
  const segments = [
    { name:"Personal Banking",       icon:"🏦", color:t.c1,    desc:"Core retail banking — transact, save, credit and rewards. App-first delivery.", metrics:["CLR 8.2%","15.3m app clients","Credit Life + Rewards"] },
    { name:"Insurance",              icon:"🛡", color:t.c4,    desc:"Credit Life, Funeral Cover and Life Cover. Own-licence transition improves unit economics.", metrics:["Net result +38%","R5.2bn net income","R5.7bn claims paid"] },
    { name:"Business Banking",       icon:"🏢", color:t.amber, desc:"SME and merchant banking with forex, rental finance and emerging markets.", metrics:["CLR 2.4%","Merchant services","Forex + Rental Fin."] },
    { name:"Fintech — VAS",          icon:"📱", color:t.c5,    desc:"Value-Added Services and Capitec Connect MVNO. High-growth fintech revenue layer.", metrics:["VAS R5.65bn (+34%)","Connect R442m","3.18bn digital txns"] },
    { name:"International (AvaFin)", icon:"🌍", color:"#06B6D4",desc:"AvaFin acquired May 2024 — extends Capitec model to European fintech lending.", metrics:["Consolidated FY25","Short & instalment loans","Revolving credit"] },
  ];
  return (
    <div className="fade-in" style={{ display:"flex", flexDirection:"column", gap:16 }}>
      <SectionHero title="Business Model & Value Creation" subtitle="Simple, affordable and accessible financial solutions through a technology-enabled platform." t={t} mob={mob} />
      <div>
        <div style={{ fontSize:11,fontWeight:700,letterSpacing:"0.1em",textTransform:"uppercase",color:t.textMuted,marginBottom:10 }}>Founding Fundamentals</div>
        <div style={{ ...cols("1fr 1fr","1fr 1fr","repeat(4,1fr)"), gap:10 }}>
          {[["Simplicity is Power",t.green,"Intuitive products, clear communication, frictionless digital channels."],["Affordability Matters",t.blue,"Transparent, competitive pricing enabling broad access to the formal financial system."],["Accessibility is Non-Negotiable",t.amber,"Technology, inclusive design and a broad physical + digital distribution network."],["Personal Experience is Essential",t.c5,"Every client treated with individual care, respect and attention to their unique needs."]].map(([title,color,desc],i)=>(
            <div key={i} style={{ background:t.surface, border:`1px solid ${t.border}`, borderRadius:12, padding:"14px 16px", borderTop:`3px solid ${color}` }}>
              <div style={{ fontSize:12,fontWeight:700,color:t.text,marginBottom:5 }}>{title}</div>
              <div style={{ fontSize:11,color:t.textMuted,lineHeight:1.6 }}>{desc}</div>
            </div>
          ))}
        </div>
      </div>
      <div>
        <div style={{ fontSize:11,fontWeight:700,letterSpacing:"0.1em",textTransform:"uppercase",color:t.textMuted,marginBottom:10 }}>Business Segments</div>
        <div style={{ ...cols("1fr 1fr","repeat(3,1fr)","repeat(5,1fr)"), gap:10 }}>
          {segments.map((s,i)=>(
            <div key={i} className="hover-lift" style={{ background:t.surface, border:`1px solid ${t.border}`, borderRadius:12, padding:"14px 14px", borderTop:`3px solid ${s.color}` }}>
              <div style={{ fontSize:mob?18:22, marginBottom:8 }}>{s.icon}</div>
              <div style={{ fontSize:12,fontWeight:700,color:t.text,marginBottom:5 }}>{s.name}</div>
              <div style={{ fontSize:11,color:t.textMuted,lineHeight:1.5,marginBottom:10 }}>{s.desc}</div>
              {s.metrics.map((m,j)=>(
                <div key={j} style={{ fontSize:10,background:t.surfaceAlt,borderRadius:4,padding:"3px 7px",color:t.textSub,marginBottom:3 }}>↗ {m}</div>
              ))}
            </div>
          ))}
        </div>
      </div>
      <div style={{ ...cols("1fr","1fr","1fr 1fr"), gap:14 }}>
        <Card title="Transaction Volume by Channel" subtitle="FY26 — millions of transactions" t={t}>
          <ResponsiveContainer width="100%" height={mob?180:230}>
            <BarChart data={TXN_CHANNELS} layout="vertical" barSize={mob?14:18} margin={{ top:4,right:24,left:0,bottom:0 }}>
              <CartesianGrid strokeDasharray="3 3" stroke={t.grid} horizontal={false} />
              <XAxis type="number" tick={{ fontSize:9,fill:t.textMuted }} axisLine={false} tickLine={false} tickFormatter={v=>`${v}m`} />
              <YAxis type="category" dataKey="name" tick={{ fontSize:mob?9:11,fill:t.textMuted }} axisLine={false} tickLine={false} width={mob?88:100} />
              <Tooltip content={<TTip t={t} fmt={v=>`${Number(v).toLocaleString()}m txns`} />} />
              <Bar dataKey="value" name="Volume" radius={[0,4,4,0]}>
                {TXN_CHANNELS.map((e,i)=><Cell key={i} fill={e.fill} />)}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </Card>
        <Card title="Operational Scale — FY2026" t={t}>
          <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:10 }}>
            {[["Active Clients","25.8m",t.blue,"+7% YoY"],["App Clients","15.3m",t.green,"+19% YoY"],["Employees","17 672",t.amber,"+4% YoY"],["Branches","885",t.c5,"+5 net"],["Cash Devices","8 771","#06B6D4","-0.3%"],["Txn Volume","12.3bn",t.red,"+11% YoY"]].map(([label,val,color,note])=>(
              <div key={label} style={{ background:t.surfaceAlt,borderRadius:9,padding:"12px 12px",borderLeft:`3px solid ${color}` }}>
                <div style={{ fontSize:9,color:t.textMuted,fontWeight:700,textTransform:"uppercase",letterSpacing:"0.07em",marginBottom:3 }}>{label}</div>
                <div className="serif" style={{ fontSize:mob?17:20,color:t.text }}>{val}</div>
                <div style={{ fontSize:10,color,fontWeight:600,marginTop:2 }}>{note}</div>
              </div>
            ))}
          </div>
        </Card>
      </div>
      <Card title="Client Base & Digital Adoption" subtitle="Active clients (millions) vs Banking App Clients" t={t}>
        <ResponsiveContainer width="100%" height={mob?180:210}>
          <ComposedChart data={OPS} margin={{ top:4,right:4,left:0,bottom:0 }}>
            <CartesianGrid strokeDasharray="3 3" stroke={t.grid} />
            <XAxis dataKey="yr" tick={{ fontSize:10,fill:t.textMuted }} axisLine={false} tickLine={false} />
            <YAxis tick={{ fontSize:9,fill:t.textMuted }} axisLine={false} tickLine={false} width={mob?42:55} tickFormatter={v=>`${(v/1000).toFixed(0)}m`} />
            <Tooltip content={<TTip t={t} fmt={v=>`${(v/1000).toFixed(1)}m`} />} /><Legend wrapperStyle={{ fontSize:10,color:t.textMuted }} />
            <Bar dataKey="clients" name="Active Clients" fill={t.c4} opacity={0.6} radius={[3,3,0,0]} />
            <Line type="monotone" dataKey="appC" name="App Clients" stroke={t.green} strokeWidth={2.5} dot={{ r:4,fill:t.green }} connectNulls={false} />
          </ComposedChart>
        </ResponsiveContainer>
      </Card>
    </div>
  );
}

/* ──────────────────────────────────────────────────────────────────────
   SIX CAPITALS TAB
────────────────────────────────────────────────────────────────────── */
function SixCapitalsTab({ t, mob, tab }) {
  const { cols } = mkH(mob, tab);
  const radarData = SIX_CAPS.map(c=>({ cap:c.cap, score:c.score }));
  return (
    <div className="fade-in" style={{ display:"flex", flexDirection:"column", gap:16 }}>
      <SectionHero title="Six Capitals — Value Creation Model" subtitle="Capitec's 6 capitals interact dynamically to support performance, innovation, stakeholder trust and long-term sustainability." t={t} mob={mob} />
      <div style={{ ...cols("1fr","1fr","1fr 2fr"), gap:16 }}>
        <Card title="Six Capitals Scorecard" subtitle="Analyst Qualitative Assessment: 0–100" t={t}>
          <ResponsiveContainer width="100%" height={mob?250:310}>
            <RadarChart data={radarData} margin={{ top:15,right:mob?8:20,left:mob?8:20,bottom:15 }}>
              <PolarGrid stroke={t.grid} />
              <PolarAngleAxis dataKey="cap" tick={{ fontSize:mob?9:10,fill:t.textSub }} />
              <PolarRadiusAxis angle={90} domain={[0,100]} tick={{ fontSize:8,fill:t.textMuted }} axisLine={false} />
              <Radar name="Score" dataKey="score" stroke={t.green} fill={t.green} fillOpacity={0.18} strokeWidth={2} dot={{ r:3,fill:t.green }} />
              <Tooltip content={<TTip t={t} fmt={v=>`${v}/100`} />} />
            </RadarChart>
          </ResponsiveContainer>
        </Card>
        {/* Capital cards — 2-col on mobile, 3-col on tablet + desktop */}
        <div style={{ ...cols("1fr 1fr","1fr 1fr 1fr","1fr 1fr 1fr"), gap:10 }}>
          {SIX_CAPS.map((c,i)=>(
            <div key={i} className="hover-lift" style={{ background:t.surface, border:`1px solid ${t.border}`, borderRadius:12, padding:"14px 14px", borderTop:`3px solid ${c.color}` }}>
              <div style={{ display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:8 }}>
                <div style={{ fontSize:mob?16:20 }}>{c.icon}</div>
                <div style={{ fontSize:mob?16:20,fontWeight:800,color:c.color,fontFamily:"monospace" }}>{c.score}</div>
              </div>
              <div style={{ fontSize:12,fontWeight:700,color:t.text,marginBottom:6 }}>{c.cap}</div>
              <div style={{ background:t.border,borderRadius:4,height:5,marginBottom:10,overflow:"hidden" }}>
                <div style={{ width:`${c.score}%`,height:"100%",background:`linear-gradient(90deg,${c.color}88,${c.color})`,borderRadius:4 }} />
              </div>
              {c.kpis.map((k,j)=>(
                <div key={j} style={{ fontSize:10,color:t.textSub,padding:"2px 0",paddingLeft:9,position:"relative",lineHeight:1.45 }}>
                  <span style={{ position:"absolute",left:0,color:c.color,fontWeight:800 }}>·</span>{k}
                </div>
              ))}
            </div>
          ))}
        </div>
      </div>
      {/* Stakeholder table — 2-col mobile, 3-col tablet, 5-col desktop */}
      <div style={{ background:t.surface, border:`1px solid ${t.border}`, borderRadius:12, overflow:"hidden" }}>
        <div style={{ padding:"14px 18px",borderBottom:`1px solid ${t.border}` }}>
          <span style={{ fontSize:13,fontWeight:700,color:t.text }}>Value Created per Stakeholder — FY2026</span>
        </div>
        <div style={{ ...cols("1fr 1fr","repeat(3,1fr)","repeat(5,1fr)") }}>
          {[
            { who:"Clients",      icon:"👤", color:t.blue,   items:["CSAT score 85%","R98.3bn loans disbursed","R8.6bn interest paid","R5.7bn claims paid"] },
            { who:"Employees",    icon:"👩‍💼", color:t.green,  items:["R10.3bn remuneration","Leadership Academy","16 Internship placements","Transformation progress"] },
            { who:"Shareholders", icon:"📈", color:t.amber,  items:["R16.8bn headline earnings","7 980c DPS","ROE 31%","+54% share price"] },
            { who:"Regulators",   icon:"🏛", color:t.c5,    items:["CAR 33%","SARB compliance","R8.2bn Income and other taxes","Responsible lending"] },
            { who:"Society",      icon:"🌍", color:"#06B6D4",items:["R149.1m Financial Ed & CSI","+100k clients/month","Youth employment","Economic inclusion"] },
          ].map((s,i)=>(
            <div key={i} style={{ padding:mob?"14px 14px":"18px 16px", borderRight:i<4?`1px solid ${t.border}`:"none", borderBottom:mob&&i>=2?`1px solid ${t.border}`:"none" }}>
              <div style={{ fontSize:mob?18:22,marginBottom:6 }}>{s.icon}</div>
              <div style={{ fontSize:12,fontWeight:700,color:s.color,marginBottom:8 }}>{s.who}</div>
              {s.items.map((item,j)=>(
                <div key={j} style={{ fontSize:mob?10:11,color:t.textSub,padding:"4px 0",borderBottom:`1px solid ${t.border}`,lineHeight:1.4 }}>{item}</div>
              ))}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

/* ──────────────────────────────────────────────────────────────────────
   STRATEGY TAB
────────────────────────────────────────────────────────────────────── */
function StrategyTab({ t, mob, tab }) {
  const { cols } = mkH(mob, tab);
  return (
    <div className="fade-in" style={{ display:"flex", flexDirection:"column", gap:16 }}>
      <SectionHero title="Strategy & Competitive Position" subtitle="Capitec's platform approach enables deepening of client relationships while expanding into insurance, business banking, fintech and international adjacencies." t={t} mob={mob} />
      {/* Pillars — 1-col mobile, 2-col tablet, 3-col desktop */}
      <div style={{ ...cols("1fr","1fr 1fr","repeat(3,1fr)"), gap:12 }}>
        {STRAT.map((s,i)=>{
          const sc={"Exceeding":t.green,"On Track":t.blue,"Building":t.amber}[s.status]||t.textMuted;
          return (
            <div key={i} className="hover-lift" style={{ background:t.surface,border:`1px solid ${t.border}`,borderRadius:12,padding:"18px 18px" }}>
              <div style={{ display:"flex",justifyContent:"space-between",alignItems:"flex-start",marginBottom:10 }}>
                <div style={{ fontSize:mob?20:26 }}>{s.icon}</div>
                <span style={{ fontSize:10,fontWeight:700,letterSpacing:"0.08em",background:`${sc}22`,color:sc,padding:"3px 10px",borderRadius:20,textTransform:"uppercase" }}>{s.status}</span>
              </div>
              <div style={{ fontSize:13,fontWeight:700,color:t.text,marginBottom:4 }}>{s.name}</div>
              <div style={{ fontSize:12,fontWeight:600,color:sc,marginBottom:7 }}>{s.metric}</div>
              <div style={{ fontSize:12,color:t.textMuted,lineHeight:1.65,marginBottom:14 }}>{s.desc}</div>
              <div style={{ background:t.border,borderRadius:4,height:5,overflow:"hidden" }}>
                <div style={{ width:`${s.pct}%`,height:"100%",background:`linear-gradient(90deg,${sc}88,${sc})`,borderRadius:4 }} />
              </div>
              <div style={{ fontSize:10,color:t.textMuted,marginTop:4,textAlign:"right" }}>{s.lifecycle}</div>
            </div>
          );
        })}
      </div>
      <div style={{ ...cols("1fr","1fr 1fr","1fr 1fr"), gap:14 }}>
        <Card title="Competitive Moats" t={t}>
          {["Low-cost digital + branch distribution at scale","Brand trust & NPS leadership in SA retail banking","Proprietary risk models + data assets (25.8m clients)","Simplicity doctrine embedded in all product decisions","Scale in personal banking unmatched by any SA peer","Insurance own-licence economics — superior to cell captive","Network effects via Capitec Connect (MVNO) platform","AvaFin gives international optionality on the Capitec formula"].map((m,i)=>(
            <div key={i} style={{ display:"flex",gap:10,padding:"7px 0",borderBottom:`1px solid ${t.border}`,fontSize:12,alignItems:"flex-start" }}>
              <span style={{ color:t.green,fontWeight:700,flexShrink:0,fontSize:13 }}>⬡</span>
              <span style={{ color:t.textSub,lineHeight:1.5 }}>{m}</span>
            </div>
          ))}
        </Card>
        <div style={{ display:"flex",flexDirection:"column",gap:12 }}>
          <Card title="Management Outlook" t={t}>
            <div style={{ fontSize:12,color:t.textSub,lineHeight:1.8,borderLeft:`3px solid ${t.green}`,paddingLeft:14,fontStyle:"italic" }}>
              "Our digital platform is the growth engine. Fifteen million app clients is a truly unique asset in South African banking. The insurance own-licence transition materially improves economics. AvaFin gives us international optionality. Our bench strength philosophy means leadership transitions happen without disruption."
            </div>
            <div style={{ marginTop:8,fontSize:11,color:t.textMuted }}>— Synthesised from CEO/CFO Report, FY2026</div>
          </Card>
          <Card title="FY27 Watch Points" t={t}>
            {["Credit loss ratio at 8.1% — elevated, trajectory key","AvaFin integration maturity and international performance","Business Banking scale and credit quality discipline","VAS & Connect revenue normalisation post-surge","Interest rate sensitivity on deposit cost of funding","Cost-to-income discipline as investment cycle continues"].map((w,i)=>(
              <div key={i} style={{ fontSize:12,color:t.textSub,padding:"6px 0",borderBottom:`1px solid ${t.border}`,display:"flex",gap:8,alignItems:"flex-start" }}>
                <span style={{ color:t.amber,flexShrink:0,marginTop:1 }}>⚠</span>{w}
              </div>
            ))}
          </Card>
        </div>
      </div>
      <div style={{ ...cols("1fr","1fr 1fr","1fr 1fr"), gap:14 }}>
        <Card title="Dividend History" subtitle="DPS (cents) and dividend cover (times)" t={t}>
          <ResponsiveContainer width="100%" height={mob?180:210}>
            <ComposedChart data={DVD} margin={{ top:4,right:8,left:0,bottom:0 }}>
              <CartesianGrid strokeDasharray="3 3" stroke={t.grid} />
              <XAxis dataKey="yr" tick={{ fontSize:10,fill:t.textMuted }} axisLine={false} tickLine={false} />
              <YAxis yAxisId="l" tick={{ fontSize:9,fill:t.textMuted }} axisLine={false} tickLine={false} width={mob?46:65} tickFormatter={v=>`${v.toLocaleString()}c`} />
              <YAxis yAxisId="r" orientation="right" domain={[0,4]} tick={{ fontSize:9,fill:t.textMuted }} axisLine={false} tickLine={false} width={30} tickFormatter={v=>`${v}x`} />
              <Tooltip content={<TTip t={t} fmt={(v,n)=>n==="Cover"?`${v}x`:`${v.toLocaleString()}c`} />} />
              <Bar yAxisId="l" dataKey="dps"   name="DPS (cents)" fill={t.amber} opacity={0.8} radius={[3,3,0,0]} />
              <Line yAxisId="r" type="monotone" dataKey="cover" name="Cover" stroke={t.blue} strokeWidth={2.5} dot={{ r:3 }} />
            </ComposedChart>
          </ResponsiveContainer>
        </Card>
        <Card title="Headline Earnings Growth" subtitle="R'm — compounding shareholder value" t={t}>
          <ResponsiveContainer width="100%" height={mob?180:210}>
            <AreaChart data={FIN} margin={{ top:4,right:4,left:0,bottom:0 }}>
              <defs><linearGradient id="epsGrad" x1="0" y1="0" x2="0" y2="1"><stop offset="5%" stopColor={t.c5} stopOpacity={0.25}/><stop offset="95%" stopColor={t.c5} stopOpacity={0}/></linearGradient></defs>
              <CartesianGrid strokeDasharray="3 3" stroke={t.grid} />
              <XAxis dataKey="yr" tick={{ fontSize:10,fill:t.textMuted }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fontSize:9,fill:t.textMuted }} axisLine={false} tickLine={false} width={mob?44:60} tickFormatter={v=>`R${(v/1000).toFixed(0)}bn`} />
              <Tooltip content={<TTip t={t} fmt={v=>`R${(v/1000).toFixed(1)}bn`} />} />
              <Area type="monotone" dataKey="hlE" name="Headline Earnings" stroke={t.c5} fill="url(#epsGrad)" strokeWidth={2.5} dot={{ r:3,fill:t.c5,stroke:t.surface,strokeWidth:2 }} />
            </AreaChart>
          </ResponsiveContainer>
        </Card>
      </div>
    </div>
  );
}

/* ──────────────────────────────────────────────────────────────────────
   ROOT APP
────────────────────────────────────────────────────────────────────── */
export default function App() {
  const [dark, setDark] = useState(false);
  const [tab,  setTab]  = useState("Overview");
  const t   = dark ? TH.dark : TH.light;
  const w   = useWindowWidth();
  const mob = w < 640;
  const isTab = w < 1024;

  /* Inject viewport meta if missing — critical for mobile rendering */
  useEffect(() => {
    let meta = document.querySelector('meta[name="viewport"]');
    if (!meta) {
      meta = document.createElement("meta");
      meta.name = "viewport";
      document.head.appendChild(meta);
    }
    meta.content = "width=device-width, initial-scale=1, maximum-scale=5";
  }, []);

  const tp = { t, mob, tab: isTab }; // shared props for all tab components

  return (
    <div style={{ background:t.bg, minHeight:"100vh", fontFamily:"'DM Sans', sans-serif", transition:"background 0.2s" }}>
      <style dangerouslySetInnerHTML={{ __html: GLOBAL_CSS }} />

      {/* ── HEADER ── */}
      <header style={{
        background:t.headerBg,
        minHeight: mob?52:62,
        display:"flex", alignItems:"center", justifyContent:"space-between",
        padding: mob?"0 14px":"0 28px",
        position:"sticky", top:0, zIndex:200,
        borderBottom:`1px solid ${t.headerBorder}`,
        gap:8,
      }}>
        {/* Logo + name */}
        <div style={{ display:"flex", alignItems:"center", gap:10, minWidth:0, overflow:"hidden" }}>
          <div style={{ width:32, height:32, flexShrink:0, borderRadius:8, background:"linear-gradient(135deg,#0D5C40,#10B981)", display:"flex", alignItems:"center", justifyContent:"center", fontSize:10, fontWeight:800, color:"white" }}>CPI</div>
          <div style={{ minWidth:0, overflow:"hidden" }}>
            <div style={{ color:"#E1EAF6", fontWeight:700, fontSize:mob?12:14, overflow:"hidden", textOverflow:"ellipsis", whiteSpace:"nowrap" }}>
              {mob ? "Capitec Bank" : "Capitec Bank Holdings Limited"}
            </div>
            {!mob && <div style={{ color:"#3D5470", fontSize:11 }}>CPI · JSE · Retail Banking · FY2026 by Nduvho Kutama (MPhil Corp Strategy)</div>}
          </div>
        </div>

        {/* Right: price + market stats (collapsed on mobile) + theme toggle */}
        <div style={{ display:"flex", alignItems:"center", gap:mob?10:20, flexShrink:0 }}>
          <div style={{ textAlign:"right" }}>
            <div style={{ color:"#10B981", fontWeight:800, fontSize:mob?13:16, fontFamily:"monospace" }}>R4,743.54</div>
            <div style={{ color:"#10B981", fontSize:9, fontWeight:600 }}>+54% YTD</div>
          </div>
          {!mob && (
            <>
              <div style={{ fontSize:12, paddingLeft:16, borderLeft:"1px solid #172840" }}>
                <span style={{ color:"#8FA3BF" }}>Mkt Cap </span>
                <span style={{ color:"#E1EAF6", fontWeight:700 }}>R550.7bn</span>
              </div>
              <div style={{ fontSize:12 }}>
                <span style={{ color:"#8FA3BF" }}>P/E </span>
                <span style={{ color:"#E1EAF6", fontWeight:700 }}>~32x</span>
              </div>
              <div style={{ fontSize:12 }}>
                <span style={{ color:"#8FA3BF" }}>ROE </span>
                <span style={{ color:"#10B981", fontWeight:700 }}>31%</span>
              </div>
            </>
          )}
          <button onClick={()=>setDark(!dark)} style={{
            background:dark?"#172840":"#1E293B", border:"1px solid #1E3550",
            borderRadius:8, padding:mob?"6px 10px":"6px 14px",
            color:"#E1EAF6", cursor:"pointer", fontSize:mob?12:12,
            fontWeight:600, display:"flex", alignItems:"center", gap:4,
            fontFamily:"'DM Sans',sans-serif", transition:"background 0.15s",
            whiteSpace:"nowrap",
          }}>
            {dark?"☀":"🌙"}{!mob&&(dark?" Light":" Dark")}
          </button>
        </div>
      </header>

      {/* ── NAV ── scrollable strip, no visible scrollbar */}
      <nav className="nav-scroll" style={{
        background:t.navBg, borderBottom:`1px solid ${t.navBorder}`,
        padding:mob?"0 4px":"0 28px",
        display:"flex", gap:0,
        position:"sticky", top:mob?52:62, zIndex:199,
      }}>
        {TABS.map(tb=>(
          <button key={tb} className="tab-btn" onClick={()=>setTab(tb)}
            style={{
              padding:mob?"0 12px":"13px 18px",
              fontSize:mob?12:13, fontWeight:600,
              background:"none", border:"none", cursor:"pointer",
              borderBottom:tab===tb?`2px solid ${t.green}`:"2px solid transparent",
              color:tab===tb?t.green:t.textMuted,
              whiteSpace:"nowrap", fontFamily:"'DM Sans',sans-serif",
            }}>
            {tb}
          </button>
        ))}
        {!mob && (
          <div style={{ marginLeft:"auto", display:"flex", alignItems:"center", paddingRight:4 }}>
            <span style={{ fontSize:11,color:t.textMuted,background:t.surfaceAlt,border:`1px solid ${t.border}`,borderRadius:6,padding:"4px 10px",whiteSpace:"nowrap" }}>
              Research Dashboard · v1.0 · Capitec FY2026
            </span>
          </div>
        )}
      </nav>

      {/* ── MAIN ── */}
      <main style={{ padding:mob?"12px 12px":isTab?"18px 20px":"24px 28px", maxWidth:1440, margin:"0 auto" }}>
        {tab==="Overview"       && <OverviewTab       {...tp} />}
        {tab==="Income"         && <IncomeTab          {...tp} />}
        {tab==="Balance Sheet"  && <BalanceSheetTab    {...tp} />}
        {tab==="Business Model" && <BusinessModelTab   {...tp} />}
        {tab==="Six Capitals"   && <SixCapitalsTab     {...tp} />}
        {tab==="Strategy"       && <StrategyTab         {...tp} />}
      </main>
    </div>
  );
}
