import React, { useMemo, useState, useEffect } from 'react';
import { 
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, 
  PieChart, Pie, Cell, AreaChart, Area, Legend
} from 'recharts';
import { 
  Users, Star, MapPin, Award, Filter, RefreshCcw, 
  BarChart3, PieChart as PieChartIcon, MessageSquare, TrendingUp
} from 'lucide-react';
import { motion } from 'motion/react';
import { PollResponse } from './types';
import { cn, formatNumber } from './lib/utils';

// --- Theme Colors ---
const CHART_COLORS = ['#6366f1', '#10b981', '#f59e0b', '#ef4444', '#8b5cf6'];

export default function App() {
  const [rawData, setRawData] = useState<PollResponse[]>([]);
  const [pipelinePreview, setPipelinePreview] = useState<{ raw: string[], cleaned: any[] } | null>(null);
  const [loading, setLoading] = useState(true);
  const [filters, setFilters] = useState({
    region: 'All',
    age_group: 'All'
  });

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    setLoading(true);
    try {
      const [dataRes, previewRes] = await Promise.all([
        fetch('/api/poll-data'),
        fetch('/api/pipeline-preview')
      ]);
      const data = await dataRes.json();
      const preview = await previewRes.json();
      setRawData(data);
      setPipelinePreview(preview);
    } catch (error) {
      console.error('Failed to fetch data:', error);
    } finally {
      setLoading(false);
    }
  };

  const filteredData = useMemo(() => {
    return rawData.filter(item => {
      const regionMatch = filters.region === 'All' || item.region === filters.region;
      const ageMatch = filters.age_group === 'All' || item.age_group === filters.age_group;
      return regionMatch && ageMatch;
    });
  }, [rawData, filters]);

  const stats = useMemo(() => {
    if (filteredData.length === 0) return { total: 0, avgSatisfaction: 0, topTool: 'N/A', regions: 0 };
    
    const total = filteredData.length;
    const avgSatisfaction = filteredData.reduce((acc, curr) => acc + curr.satisfaction, 0) / total;
    
    const tools: Record<string, number> = {};
    filteredData.forEach(item => {
      tools[item.preferred_tool] = (tools[item.preferred_tool] || 0) + 1;
    });
    const topTool = Object.entries(tools).sort((a, b) => b[1] - a[1])[0]?.[0] || 'N/A';
    
    const regions = new Set(filteredData.map(item => item.region)).size;
    
    return { total, avgSatisfaction, topTool, regions };
  }, [filteredData]);

  const toolCountData = useMemo(() => {
    const counts: Record<string, number> = {};
    filteredData.forEach(item => {
      counts[item.preferred_tool] = (counts[item.preferred_tool] || 0) + 1;
    });
    return Object.entries(counts)
      .map(([name, value]) => ({ name, value }))
      .sort((a, b) => b.value - a.value);
  }, [filteredData]);

  const satisfactionData = useMemo(() => {
    const counts: Record<number, number> = { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0 };
    filteredData.forEach(item => {
      counts[item.satisfaction]++;
    });
    return Object.entries(counts).map(([name, value]) => ({ name: `${name} ★`, value }));
  }, [filteredData]);

  const dailyTrendData = useMemo(() => {
    const counts: Record<string, number> = {};
    filteredData.forEach(item => {
      const date = item.timestamp.split('T')[0];
      counts[date] = (counts[date] || 0) + 1;
    });
    return Object.entries(counts)
      .map(([date, count]) => ({ date, count }))
      .sort((a, b) => a.date.localeCompare(b.date));
  }, [filteredData]);

  const wordCloudData = useMemo(() => {
    const words: Record<string, number> = {};
    filteredData.forEach(item => {
      item.feedback.split(' ').forEach(word => {
        const clean = word.toLowerCase().replace(/[^a-z]/g, '');
        if (clean.length > 3) {
          words[clean] = (words[clean] || 0) + 1;
        }
      });
    });
    return Object.entries(words)
      .sort((a, b) => b[1] - a[1])
      .slice(0, 20);
  }, [filteredData]);

  if (loading && rawData.length === 0) {
    return (
      <div className="flex items-center justify-center h-screen bg-brand-bg">
        <div className="flex flex-col items-center gap-4">
          <RefreshCcw className="w-8 h-8 text-brand-accent animate-spin" />
          <p className="text-brand-muted font-medium">Extracting Insights...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen bg-brand-bg text-brand-text font-sans selection:bg-indigo-100">
      {/* --- Sidebar --- */}
      <aside className="w-[280px] bg-brand-sidebar text-white p-8 flex flex-col gap-10 sticky top-0 h-screen overflow-y-auto shrink-0">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 bg-brand-accent rounded-lg flex items-center justify-center shadow-lg shadow-brand-accent/20">
            <TrendingUp className="w-5 h-5 text-white" />
          </div>
          <span className="text-xl font-bold tracking-tight">PollVisualizer <span className="text-indigo-400 font-medium text-sm">v1.2</span></span>
        </div>

        <nav className="flex flex-col gap-8">
          <div className="space-y-4">
            <label className="text-[11px] font-bold uppercase tracking-[0.1em] text-slate-400">Regions Selection</label>
            <div className="relative group">
              <select 
                value={filters.region}
                onChange={(e) => setFilters(prev => ({ ...prev, region: e.target.value }))}
                className="w-full bg-slate-800 border border-slate-700 text-slate-100 px-4 py-3 rounded-xl appearance-none focus:ring-2 focus:ring-brand-accent focus:border-transparent outline-none transition-all cursor-pointer text-sm"
              >
                <option value="All">All Regions</option>
                {Array.from(new Set(rawData.map(d => d.region))).sort().map(r => (
                  <option key={r} value={r}>{r}</option>
                ))}
              </select>
              <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none text-slate-500 group-hover:text-slate-300 transition-colors">
                <Filter className="w-4 h-4" />
              </div>
            </div>
          </div>

          <div className="space-y-4">
            <label className="text-[11px] font-bold uppercase tracking-[0.1em] text-slate-400">Age Demographics</label>
            <div className="relative group">
              <select 
                value={filters.age_group}
                onChange={(e) => setFilters(prev => ({ ...prev, age_group: e.target.value }))}
                className="w-full bg-slate-800 border border-slate-700 text-slate-100 px-4 py-3 rounded-xl appearance-none focus:ring-2 focus:ring-brand-accent focus:border-transparent outline-none transition-all cursor-pointer text-sm"
              >
                <option value="All">All Age Groups</option>
                {Array.from(new Set(rawData.map(d => d.age_group))).sort().map(ag => (
                  <option key={ag} value={ag}>{ag}</option>
                ))}
              </select>
              <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none text-slate-500 group-hover:text-slate-300 transition-colors">
                <Users className="w-4 h-4" />
              </div>
            </div>
          </div>
        </nav>

        <div className="mt-auto pt-8 border-t border-slate-800/50">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
            <span className="text-xs font-semibold uppercase tracking-wider text-slate-400">Pipeline Active</span>
          </div>
          <p className="text-[11px] leading-relaxed text-slate-500 font-medium">
            Ingesting 400 rows of synthetic response data. Last synchronized 2m ago.
          </p>
        </div>
      </aside>

      {/* --- Main Content --- */}
      <main className="flex-1 p-8 lg:p-12 overflow-y-auto">
        <header className="flex items-center justify-between mb-12">
          <div>
            <h1 className="text-3xl font-bold tracking-tight text-brand-text">Poll Results Dashboard</h1>
            <p className="text-brand-muted mt-1 font-medium">Live Deployment Overview & Interaction</p>
          </div>
          <div className="flex items-center gap-4">
            <button 
              onClick={fetchData}
              className="flex items-center gap-2 px-5 py-2.5 bg-brand-card border border-brand-border rounded-xl text-sm font-semibold text-brand-text hover:bg-slate-50 transition-all active:scale-95"
            >
              <RefreshCcw className={cn("w-4 h-4 text-brand-accent", loading && "animate-spin")} />
              Sync Data
            </button>
            <div className="px-4 py-1.5 bg-emerald-100 text-emerald-700 border border-emerald-200 rounded-full text-xs font-bold uppercase tracking-wider">
              Live Production
            </div>
          </div>
        </header>

        <div className="space-y-10">
          {/* --- KPI Grid --- */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            <KPICard 
              label="Total Responses" 
              value={formatNumber(stats.total)} 
              icon={<Users className="w-5 h-5 text-brand-accent" />} 
            />
            <KPICard 
              label="Avg Satisfaction" 
              value={`${stats.avgSatisfaction.toFixed(2)}`} 
              icon={<Star className="w-5 h-5 text-amber-500" />} 
              subValue="↑ 0.4"
            />
            <KPICard 
              label="Top Preferred Tool" 
              value={stats.topTool} 
              icon={<Award className="w-5 h-5 text-emerald-500" />} 
            />
            <KPICard 
              label="Unique Regions" 
              value={stats.regions.toString()} 
              icon={<MapPin className="w-5 h-5 text-indigo-500" />} 
            />
          </div>

          {/* --- Charts Section --- */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            
            <SectionCard title="Most Preferred Data Tools — Vote Count" className="lg:col-span-2">
              <div className="h-[320px] w-full mt-6">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={toolCountData} margin={{ left: -20, right: 10, top: 10, bottom: 20 }}>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                    <XAxis 
                      dataKey="name" 
                      axisLine={false} 
                      tickLine={false} 
                      tick={{ fontSize: 11, fill: '#94a3b8', fontWeight: 500 }}
                    />
                    <YAxis 
                      axisLine={false} 
                      tickLine={false} 
                      tick={{ fontSize: 11, fill: '#94a3b8', fontWeight: 500 }}
                    />
                    <Tooltip 
                      cursor={{ fill: '#f8fafc' }}
                      contentStyle={{ borderRadius: '12px', border: '1px solid #e2e8f0', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
                    />
                    <Bar dataKey="value" fill="#6366f1" radius={[4, 4, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </SectionCard>

            <SectionCard title="Satisfaction Distribution">
              <div className="h-[280px] w-full mt-6">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={satisfactionData} margin={{ left: -20, bottom: 20 }}>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                    <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fontSize: 10, fill: '#94a3b8' }} />
                    <Tooltip contentStyle={{ borderRadius: '12px', border: '1px solid #e2e8f0' }} />
                    <Bar dataKey="value" fill="#94a3b8">
                      {satisfactionData.map((_, index) => (
                        <Cell key={`cell-${index}`} fill={index === 3 ? '#6366f1' : '#94a3b8'} />
                      ))}
                    </Bar>
                  </BarChart>
                </ResponsiveContainer>
              </div>
              <div className="flex justify-between text-[11px] font-bold text-slate-400 uppercase tracking-wider px-2">
                 <span>1 (Poor)</span>
                 <span>5 (Great)</span>
              </div>
            </SectionCard>

            <SectionCard title="Daily Submissions Trend" className="lg:col-span-2">
               <div className="h-[260px] w-full mt-6">
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={dailyTrendData} margin={{ left: -20, right: 10 }}>
                    <defs>
                      <linearGradient id="colorAcc" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#6366f1" stopOpacity={0.15}/>
                        <stop offset="95%" stopColor="#6366f1" stopOpacity={0}/>
                      </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                    <XAxis dataKey="date" hide />
                    <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 11, fill: '#94a3b8' }} />
                    <Tooltip contentStyle={{ borderRadius: '12px', border: '1px solid #e2e8f0' }} />
                    <Area type="monotone" dataKey="count" stroke="#6366f1" strokeWidth={3} fill="url(#colorAcc)" />
                  </AreaChart>
                </ResponsiveContainer>
               </div>
            </SectionCard>

            <SectionCard title="Feedback Word Cloud">
               <div className="mt-6 flex flex-wrap gap-4 items-center justify-center p-6 min-h-[220px]">
                  {wordCloudData.length > 0 ? wordCloudData.slice(0, 12).map(([word, count], idx) => (
                    <motion.span 
                      key={word}
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={{ delay: idx * 0.05 }}
                      className={cn(
                        "font-bold text-brand-accent tracking-tight",
                        idx % 3 === 0 ? "text-2xl" : idx % 2 === 0 ? "text-lg opacity-80" : "text-sm opacity-60"
                      )}
                    >
                      {word}
                    </motion.span>
                  )) : (
                    <p className="text-slate-400 text-sm italic">Analytics processing...</p>
                  )}
               </div>
            </SectionCard>
          </div>

          {/* --- Data Pipeline Integrity Section (Gap Fix) --- */}
          <SectionCard title="Data Ingestion & Integrity Pipeline" className="lg:col-span-3">
             <div className="grid grid-cols-1 xl:grid-cols-2 gap-12 mt-6">
                <div>
                  <div className="flex items-center gap-3 mb-4">
                    <span className="px-2 py-0.5 bg-red-100 text-red-600 rounded text-[10px] font-bold uppercase tracking-wider">Raw Input</span>
                    <h3 className="text-sm font-bold text-slate-700">Source CSV Preview (dirty)</h3>
                  </div>
                  <div className="overflow-x-auto rounded-xl border border-slate-200 bg-slate-50">
                    <table className="w-full text-[11px] text-left">
                      <thead>
                        <tr className="bg-slate-100 border-b border-slate-200">
                           {pipelinePreview?.raw[0]?.split(',').map((h, i) => (
                             <th key={i} className="px-3 py-2 font-bold text-slate-600 truncate">{h}</th>
                           ))}
                        </tr>
                      </thead>
                      <tbody>
                        {pipelinePreview?.raw.slice(1).map((row, i) => (
                          <tr key={i} className="border-b border-slate-100 last:border-0">
                            {row.split(',').map((cell, j) => (
                              <td key={j} className="px-3 py-2 text-slate-500 font-mono whitespace-nowrap">
                                {cell || <span className="text-slate-300 italic">null</span>}
                              </td>
                            ))}
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                  <p className="text-[10px] text-brand-muted mt-3 italic">
                    Note: Highlighting leading spaces, inconsistent casing, and missing values in raw survey export.
                  </p>
                </div>

                <div>
                  <div className="flex items-center gap-3 mb-4">
                    <span className="px-2 py-0.5 bg-emerald-100 text-emerald-600 rounded text-[10px] font-bold uppercase tracking-wider">Cleaned Output</span>
                    <h3 className="text-sm font-bold text-slate-700">Preprocessing Result (Structured)</h3>
                  </div>
                  <div className="overflow-x-auto rounded-xl border border-emerald-100 bg-emerald-50/10">
                    <table className="w-full text-[11px] text-left">
                      <thead>
                        <tr className="bg-emerald-50 border-b border-emerald-100">
                           {Object.keys(pipelinePreview?.cleaned[0] || {}).map((h, i) => (
                             <th key={i} className="px-3 py-2 font-bold text-emerald-700">{h}</th>
                           ))}
                        </tr>
                      </thead>
                      <tbody>
                        {pipelinePreview?.cleaned.map((row, i) => (
                          <tr key={i} className="border-b border-emerald-50 last:border-0 hover:bg-emerald-50/50 transition-colors">
                            {Object.values(row).map((cell: any, j) => (
                              <td key={j} className="px-3 py-2 text-brand-text font-medium whitespace-nowrap">
                                {cell?.toString()}
                              </td>
                            ))}
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                  <p className="text-[10px] text-brand-success mt-3 font-semibold">
                    Actions: Trimming, Title-Casing, Type Conversion (String → Number), and Missing Value Attribution applied.
                  </p>
                </div>
             </div>
          </SectionCard>

          {/* --- Interview Section --- */}
          <div className="bg-brand-card border border-brand-border rounded-2xl p-10 mt-12 overflow-hidden relative">
             <div className="absolute top-0 right-0 w-64 h-64 bg-brand-accent/5 rounded-full -mr-32 -mt-32 blur-3xl pointer-events-none" />
             <div className="relative z-10 grid grid-cols-1 lg:grid-cols-2 gap-12">
               <div>
                  <h2 className="text-2xl font-bold text-brand-text mb-6">Portfolio Strategy & Architecture</h2>
                  <div className="space-y-8">
                     <div className="group">
                        <h4 className="flex items-center gap-3 font-bold text-brand-text mb-2 group-hover:text-brand-accent transition-colors">
                          <div className="w-1.5 h-6 bg-brand-accent rounded-full" />
                          Business Value Mapping
                        </h4>
                        <p className="text-brand-muted text-sm leading-relaxed pl-4.5">
                          Survey analytics project bridges the gap between raw data and decision-making. 
                          I implemented automated cleaning pipelines to ensure 100% data integrity before 
                          reaching the dashboard layer.
                        </p>
                     </div>
                     <div className="group">
                        <h4 className="flex items-center gap-3 font-bold text-brand-text mb-2 group-hover:text-brand-accent transition-colors">
                          <div className="w-1.5 h-6 bg-emerald-500 rounded-full" />
                          Scalable Architecture
                        </h4>
                        <p className="text-brand-muted text-sm leading-relaxed pl-4.5">
                          While current state processes 400 rows in memory, the backend is designed for 
                          stateless conversion to Paginated SQL or Cloud Storage blobs for million-record scaling.
                        </p>
                     </div>
                  </div>
               </div>
               <div className="bg-brand-sidebar rounded-2xl p-8 text-white flex flex-col justify-between shadow-2xl shadow-slate-900/10">
                  <div className="flex justify-between items-start mb-12">
                     <Award className="text-indigo-400 w-8 h-8" />
                     <div className="flex gap-2">
                        <span className="w-3 h-3 rounded-full bg-red-400" />
                        <span className="w-3 h-3 rounded-full bg-amber-400" />
                        <span className="w-3 h-3 rounded-full bg-emerald-400" />
                     </div>
                  </div>
                  <div>
                    <h3 className="text-lg font-bold mb-3">Project Meta-Summary</h3>
                    <p className="text-slate-400 text-sm leading-relaxed mb-6 italic">
                      "Engineered for high-fidelity information retrieval with a 
                      focus on semantic clarity and visual ergonomics."
                    </p>
                    <div className="flex flex-wrap gap-3">
                       {['Clean Architecture', 'Recharts OLAP', 'Motion UI'].map(tag => (
                         <span key={tag} className="px-3 py-1 bg-white/5 rounded-md text-[10px] uppercase font-heavy tracking-[0.1em] text-slate-300">
                           {tag}
                         </span>
                       ))}
                    </div>
                  </div>
               </div>
             </div>
          </div>

          <footer className="mt-12 pb-12 flex flex-col md:flex-row items-center justify-between text-brand-muted text-sm gap-4">
            <p>© 2026 InsightPoll Analytics. Placement-Ready Research Dashboard.</p>
            <div className="flex items-center gap-6">
              <span className="flex items-center gap-2 italic">Refining raw data into strategic intelligence</span>
            </div>
          </footer>
        </div>
      </main>
    </div>
  );
}

// --- Internal Components ---

function KPICard({ label, value, icon, subValue }: { label: string; value: string; icon: React.ReactNode; subValue?: string }) {
  return (
    <motion.div 
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-brand-card p-6 rounded-2xl border border-brand-border shadow-sm hover:shadow-md transition-all duration-300 group"
    >
      <div className="flex justify-between items-start mb-4">
        <span className="text-[11px] font-bold text-brand-muted uppercase tracking-widest">{label}</span>
        <div className="p-2 bg-slate-50 rounded-lg group-hover:bg-brand-accent/5 transition-colors">
           {icon}
        </div>
      </div>
      <div className="flex items-baseline gap-3">
        <h3 className="text-2xl font-bold text-brand-text tracking-tight">{value}</h3>
        {subValue && (
          <span className="text-xs font-bold text-brand-success">{subValue}</span>
        )}
      </div>
    </motion.div>
  );
}

function SectionCard({ title, children, className }: { title: string; children: React.ReactNode; className?: string }) {
  return (
    <motion.section 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className={cn("bg-brand-card p-6 rounded-2xl border border-brand-border shadow-sm flex flex-col", className)}
    >
      <h2 className="text-sm font-bold tracking-tight text-brand-text">{title}</h2>
      <div className="flex-1 flex flex-col">
        {children}
      </div>
    </motion.section>
  );
}
