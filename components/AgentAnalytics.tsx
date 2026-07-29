import React, { useState, useMemo } from 'react';
import { 
  ResponsiveContainer, 
  AreaChart, 
  Area, 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  Legend, 
  PieChart, 
  Pie, 
  Cell 
} from 'recharts';
import { Property } from '../types';
import { initialProperties } from '../store/mockData';

interface AgentAnalyticsProps {
  agentProperties: Property[];
  onSelectPropertyForEdit?: (property: Property) => void;
}

export const AgentAnalytics: React.FC<AgentAnalyticsProps> = ({ 
  agentProperties,
  onSelectPropertyForEdit 
}) => {
  const [timeframe, setTimeframe] = useState<'7' | '14' | '30'>('30');
  const [selectedPropertyId, setSelectedPropertyId] = useState<string>('all');
  const [chartType, setChartType] = useState<'trend' | 'comparison' | 'channels'>('trend');

  // Use agent properties or fallback to system properties so charts are always populated and informative
  const activeListings = useMemo(() => {
    return agentProperties.length > 0 ? agentProperties : initialProperties;
  }, [agentProperties]);

  // Generate 30-day realistic analytics dataset based on listings
  const { analyticsData, propertyComparison, channelData, totalViews, totalLeads, avgConversionRate, topListing } = useMemo(() => {
    const daysCount = parseInt(timeframe, 10);
    const dailyData = [];
    const now = new Date();

    const filteredProps = selectedPropertyId === 'all' 
      ? activeListings 
      : activeListings.filter(p => p.id === selectedPropertyId);

    const propMultiplier = selectedPropertyId === 'all' ? Math.max(1, activeListings.length) : 1.2;

    let sumViews = 0;
    let sumLeads = 0;

    for (let i = daysCount - 1; i >= 0; i--) {
      const d = new Date();
      d.setDate(now.getDate() - i);
      const displayDate = d.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
      const dayOfWeek = d.getDay();
      const isWeekend = dayOfWeek === 0 || dayOfWeek === 6;

      // Seed calculation for steady deterministic chart data
      const seed = (d.getDate() * 11 + d.getMonth() * 19 + (selectedPropertyId.charCodeAt(0) || 7)) % 50;
      const baseViews = Math.round((30 + seed + (isWeekend ? 28 : 5)) * propMultiplier);
      const baseLeads = Math.max(1, Math.round(baseViews * (0.045 + (seed % 7) * 0.005)));

      sumViews += baseViews;
      sumLeads += baseLeads;

      dailyData.push({
        date: d.toISOString().split('T')[0],
        displayDate,
        views: baseViews,
        leads: baseLeads,
        inquiries: Math.round(baseLeads * 1.4)
      });
    }

    // Property level breakdown
    const propStats = activeListings.map((p, idx) => {
      const seed = (p.title.length * 13 + idx * 29) % 40;
      const pViews = Math.round((280 + seed * 14) * (daysCount / 30));
      const pLeads = Math.round(pViews * (0.042 + (seed % 5) * 0.008));
      const rate = pViews > 0 ? ((pLeads / pViews) * 100).toFixed(1) : '0.0';
      return {
        id: p.id,
        rawProperty: p,
        title: p.title.length > 22 ? p.title.substring(0, 20) + '...' : p.title,
        fullTitle: p.title,
        location: p.location,
        price: p.price,
        currency: p.currency,
        views: pViews,
        leads: pLeads,
        conversionRate: `${rate}%`
      };
    });

    // Find top listing
    const sortedProps = [...propStats].sort((a, b) => b.views - a.views);
    const topProp = sortedProps[0] || null;

    // Traffic acquisition channels
    const channels = [
      { name: 'Direct Search', value: Math.round(sumViews * 0.42), color: '#1e3a8a' }, // Deep Blue
      { name: 'WhatsApp & Direct Call', value: Math.round(sumViews * 0.28), color: '#d97706' }, // Amber/Yellow
      { name: 'Email Inquiry', value: Math.round(sumViews * 0.18), color: '#2563eb' }, // Royal Blue
      { name: 'Social & Referrals', value: Math.round(sumViews * 0.12), color: '#f59e0b' }  // Light Gold
    ];

    const convRate = sumViews > 0 ? ((sumLeads / sumViews) * 100).toFixed(1) : '0.0';

    return {
      analyticsData: dailyData,
      propertyComparison: propStats,
      channelData: channels,
      totalViews: sumViews,
      totalLeads: sumLeads,
      avgConversionRate: `${convRate}%`,
      topListing: topProp
    };
  }, [timeframe, selectedPropertyId, activeListings]);

  // Custom Chart Tooltip
  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-blue-950 text-white p-4 rounded-xl shadow-xl border border-blue-800 text-xs font-sans">
          <p className="font-bold text-yellow-400 mb-2 border-b border-blue-800/80 pb-1">{label}</p>
          {payload.map((entry: any, index: number) => (
            <div key={`item-${index}`} className="flex items-center justify-between gap-4 my-1">
              <span className="flex items-center gap-1.5 text-slate-200">
                <span className="w-2.5 h-2.5 rounded-full inline-block" style={{ backgroundColor: entry.color }} />
                {entry.name}:
              </span>
              <span className="font-bold text-white text-sm">{entry.value.toLocaleString()}</span>
            </div>
          ))}
        </div>
      );
    }
    return null;
  };

  return (
    <div className="bg-white border border-slate-200/80 rounded-3xl p-6 md:p-8 shadow-sm space-y-8 my-8">
      {/* Header & Controls */}
      <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-4 border-b border-slate-100 pb-6">
        <div>
          <div className="flex items-center gap-2">
            <span className="px-3 py-1 bg-yellow-50 text-yellow-700 text-xs font-bold rounded-full border border-yellow-200">
              <i className="fas fa-chart-line mr-1"></i> Listing Performance Insights
            </span>
            {agentProperties.length === 0 && (
              <span className="px-2.5 py-0.5 bg-blue-50 text-blue-700 text-[11px] font-medium rounded-full">
                Sample Market Benchmarks
              </span>
            )}
          </div>
          <h2 className="text-2xl font-extrabold text-blue-950 mt-2">Agent Analytics Dashboard</h2>
          <p className="text-slate-500 text-sm mt-0.5">
            Monitor buyer inquiries, property views, and conversion rates across Sierra Leone listings.
          </p>
        </div>

        {/* Filters */}
        <div className="flex flex-wrap items-center gap-3 w-full lg:w-auto">
          {/* Property Selector */}
          <div className="flex-1 sm:flex-initial">
            <select
              value={selectedPropertyId}
              onChange={(e) => setSelectedPropertyId(e.target.value)}
              className="w-full sm:w-auto bg-slate-50 border border-slate-200 text-slate-700 text-xs font-semibold rounded-xl px-3 py-2.5 outline-none focus:ring-2 focus:ring-yellow-500 transition-all cursor-pointer"
            >
              <option value="all">🏢 All Properties ({activeListings.length})</option>
              {activeListings.map(p => (
                <option key={p.id} value={p.id}>
                  {p.title.length > 25 ? p.title.substring(0, 23) + '...' : p.title}
                </option>
              ))}
            </select>
          </div>

          {/* Timeframe Selector */}
          <div className="inline-flex bg-slate-100 p-1 rounded-xl border border-slate-200 text-xs font-bold text-slate-600">
            <button
              onClick={() => setTimeframe('7')}
              className={`px-3 py-1.5 rounded-lg transition-all ${timeframe === '7' ? 'bg-white text-blue-950 shadow-sm' : 'hover:text-blue-900'}`}
            >
              7 Days
            </button>
            <button
              onClick={() => setTimeframe('14')}
              className={`px-3 py-1.5 rounded-lg transition-all ${timeframe === '14' ? 'bg-white text-blue-950 shadow-sm' : 'hover:text-blue-900'}`}
            >
              14 Days
            </button>
            <button
              onClick={() => setTimeframe('30')}
              className={`px-3 py-1.5 rounded-lg transition-all ${timeframe === '30' ? 'bg-white text-blue-950 shadow-sm' : 'hover:text-blue-900'}`}
            >
              30 Days
            </button>
          </div>
        </div>
      </div>

      {/* Metric Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Total Views */}
        <div className="bg-gradient-to-br from-blue-900 to-blue-950 text-white p-5 rounded-2xl shadow-md relative overflow-hidden group">
          <div className="absolute top-3 right-3 text-white/10 group-hover:text-white/20 text-4xl transition-colors">
            <i className="fas fa-eye"></i>
          </div>
          <p className="text-blue-200 text-xs font-medium uppercase tracking-wider">Property Views ({timeframe}D)</p>
          <div className="flex items-baseline gap-2 mt-2">
            <span className="text-3xl font-extrabold text-white">{totalViews.toLocaleString()}</span>
            <span className="text-xs font-bold text-emerald-400 bg-emerald-500/20 px-2 py-0.5 rounded-full flex items-center gap-1">
              <i className="fas fa-arrow-up text-[10px]"></i> +18.4%
            </span>
          </div>
          <p className="text-[11px] text-blue-300/80 mt-2">
            Avg. {Math.round(totalViews / parseInt(timeframe, 10))} views / day
          </p>
        </div>

        {/* Lead Conversions */}
        <div className="bg-white border border-slate-200 p-5 rounded-2xl shadow-sm relative overflow-hidden group hover:border-yellow-500/50 transition-colors">
          <div className="absolute top-3 right-3 text-yellow-500/20 group-hover:text-yellow-500/40 text-4xl transition-colors">
            <i className="fas fa-user-check"></i>
          </div>
          <p className="text-slate-500 text-xs font-medium uppercase tracking-wider">Lead Conversions</p>
          <div className="flex items-baseline gap-2 mt-2">
            <span className="text-3xl font-extrabold text-blue-950">{totalLeads.toLocaleString()}</span>
            <span className="text-xs font-bold text-yellow-700 bg-yellow-100 px-2 py-0.5 rounded-full">
              Inquiries
            </span>
          </div>
          <p className="text-[11px] text-slate-400 mt-2">
            Direct buyer contacts & calls
          </p>
        </div>

        {/* Conversion Rate */}
        <div className="bg-white border border-slate-200 p-5 rounded-2xl shadow-sm relative overflow-hidden group hover:border-blue-500/50 transition-colors">
          <div className="absolute top-3 right-3 text-blue-500/20 group-hover:text-blue-500/40 text-4xl transition-colors">
            <i className="fas fa-bullseye"></i>
          </div>
          <p className="text-slate-500 text-xs font-medium uppercase tracking-wider">Conversion Rate</p>
          <div className="flex items-baseline gap-2 mt-2">
            <span className="text-3xl font-extrabold text-yellow-600">{avgConversionRate}</span>
            <span className="text-xs font-bold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-full">
              High
            </span>
          </div>
          <p className="text-[11px] text-slate-400 mt-2">
            Views to inquiry ratio
          </p>
        </div>

        {/* Top Performer */}
        <div className="bg-amber-50/60 border border-amber-200/80 p-5 rounded-2xl shadow-sm relative overflow-hidden">
          <p className="text-amber-800 text-xs font-bold uppercase tracking-wider flex items-center gap-1.5">
            <i className="fas fa-trophy text-yellow-600"></i> Top Performer
          </p>
          {topListing ? (
            <div className="mt-2">
              <h4 className="font-bold text-blue-950 text-sm truncate" title={topListing.fullTitle}>
                {topListing.fullTitle}
              </h4>
              <div className="flex items-center gap-3 mt-1 text-xs text-amber-900 font-semibold">
                <span><i className="fas fa-eye text-amber-600 mr-1"></i>{topListing.views} views</span>
                <span>•</span>
                <span><i className="fas fa-comment-dots text-yellow-700 mr-1"></i>{topListing.leads} leads</span>
              </div>
            </div>
          ) : (
            <p className="text-xs text-amber-700 mt-2">No listing data available</p>
          )}
        </div>
      </div>

      {/* Main Visualizations Box */}
      <div className="bg-slate-50/80 border border-slate-200 rounded-2xl p-6">
        {/* Visualization Tabs */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-6">
          <div className="inline-flex bg-white p-1 rounded-xl border border-slate-200 shadow-sm text-xs font-bold">
            <button
              onClick={() => setChartType('trend')}
              className={`px-4 py-2 rounded-lg flex items-center gap-2 transition-all ${
                chartType === 'trend' ? 'bg-blue-950 text-yellow-400 shadow-sm' : 'text-slate-600 hover:text-blue-950'
              }`}
            >
              <i className="fas fa-chart-area"></i> Daily Trend ({timeframe} Days)
            </button>
            <button
              onClick={() => setChartType('comparison')}
              className={`px-4 py-2 rounded-lg flex items-center gap-2 transition-all ${
                chartType === 'comparison' ? 'bg-blue-950 text-yellow-400 shadow-sm' : 'text-slate-600 hover:text-blue-950'
              }`}
            >
              <i className="fas fa-chart-bar"></i> Listing Comparison
            </button>
            <button
              onClick={() => setChartType('channels')}
              className={`px-4 py-2 rounded-lg flex items-center gap-2 transition-all ${
                chartType === 'channels' ? 'bg-blue-950 text-yellow-400 shadow-sm' : 'text-slate-600 hover:text-blue-950'
              }`}
            >
              <i className="fas fa-chart-pie"></i> Lead Sources
            </button>
          </div>

          <div className="text-xs text-slate-500 font-medium flex items-center gap-2">
            <span className="inline-block w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
            Real-time Sierra Leone Listing Telemetry
          </div>
        </div>

        {/* Chart Render Area */}
        <div className="h-[340px] w-full pt-2">
          {chartType === 'trend' && (
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={analyticsData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <defs>
                  <linearGradient id="colorViews" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#1e3a8a" stopOpacity={0.8}/>
                    <stop offset="95%" stopColor="#1e3a8a" stopOpacity={0.05}/>
                  </linearGradient>
                  <linearGradient id="colorLeads" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#d97706" stopOpacity={0.8}/>
                    <stop offset="95%" stopColor="#d97706" stopOpacity={0.05}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" />
                <XAxis 
                  dataKey="displayDate" 
                  tickLine={false} 
                  axisLine={false} 
                  tick={{ fill: '#64748b', fontSize: 11 }}
                  interval={timeframe === '30' ? 3 : timeframe === '14' ? 1 : 0}
                />
                <YAxis tickLine={false} axisLine={false} tick={{ fill: '#64748b', fontSize: 11 }} />
                <Tooltip content={<CustomTooltip />} />
                <Legend 
                  verticalAlign="top" 
                  height={36} 
                  formatter={(value) => <span className="text-xs font-bold text-slate-700">{value}</span>}
                />
                <Area 
                  type="monotone" 
                  dataKey="views" 
                  name="Property Views" 
                  stroke="#1e3a8a" 
                  strokeWidth={3}
                  fillOpacity={1} 
                  fill="url(#colorViews)" 
                />
                <Area 
                  type="monotone" 
                  dataKey="leads" 
                  name="Lead Conversions" 
                  stroke="#d97706" 
                  strokeWidth={2.5}
                  fillOpacity={1} 
                  fill="url(#colorLeads)" 
                />
              </AreaChart>
            </ResponsiveContainer>
          )}

          {chartType === 'comparison' && (
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={propertyComparison} margin={{ top: 10, right: 10, left: -10, bottom: 20 }}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" />
                <XAxis 
                  dataKey="title" 
                  tickLine={false} 
                  axisLine={false} 
                  tick={{ fill: '#1e293b', fontSize: 11, fontWeight: 600 }}
                  angle={-15}
                  textAnchor="end"
                />
                <YAxis tickLine={false} axisLine={false} tick={{ fill: '#64748b', fontSize: 11 }} />
                <Tooltip content={<CustomTooltip />} />
                <Legend 
                  verticalAlign="top" 
                  height={36} 
                  formatter={(value) => <span className="text-xs font-bold text-slate-700">{value}</span>}
                />
                <Bar 
                  dataKey="views" 
                  name="Property Views" 
                  fill="#1e3a8a" 
                  radius={[6, 6, 0, 0]} 
                  barSize={32}
                />
                <Bar 
                  dataKey="leads" 
                  name="Lead Conversions" 
                  fill="#d97706" 
                  radius={[6, 6, 0, 0]} 
                  barSize={24}
                />
              </BarChart>
            </ResponsiveContainer>
          )}

          {chartType === 'channels' && (
            <div className="flex flex-col md:flex-row items-center justify-center h-full gap-8">
              <div className="w-full md:w-1/2 h-[260px]">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={channelData}
                      cx="50%"
                      cy="50%"
                      innerRadius={60}
                      outerRadius={95}
                      paddingAngle={4}
                      dataKey="value"
                    >
                      {channelData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} stroke="#ffffff" strokeWidth={2} />
                      ))}
                    </Pie>
                    <Tooltip 
                      formatter={(val: any) => [`${val} Inquiries`, 'Volume']}
                      contentStyle={{ borderRadius: '12px', background: '#0f172a', color: '#fff', border: 'none' }}
                    />
                  </PieChart>
                </ResponsiveContainer>
              </div>

              <div className="w-full md:w-1/2 space-y-3">
                <h4 className="text-xs font-bold text-slate-500 uppercase tracking-wider">Acquisition Channels</h4>
                {channelData.map((channel, i) => (
                  <div key={i} className="flex items-center justify-between p-3 bg-white rounded-xl border border-slate-200/80">
                    <div className="flex items-center gap-2.5">
                      <span className="w-3.5 h-3.5 rounded-full" style={{ backgroundColor: channel.color }}></span>
                      <span className="text-xs font-bold text-slate-800">{channel.name}</span>
                    </div>
                    <div className="text-right">
                      <span className="text-xs font-extrabold text-blue-950 block">{channel.value} inquiries</span>
                      <span className="text-[10px] text-slate-400 font-medium">
                        {Math.round((channel.value / totalViews) * 100)}% of views
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>

      {/* AI Insights & Optimization Tips */}
      <div className="bg-gradient-to-r from-blue-900 to-indigo-950 rounded-2xl p-6 text-white flex flex-col md:flex-row items-start md:items-center justify-between gap-6 shadow-lg border border-blue-800">
        <div className="space-y-2 max-w-2xl">
          <div className="inline-flex items-center gap-2 px-3 py-1 bg-yellow-500/20 border border-yellow-500/30 rounded-full text-yellow-400 text-xs font-bold">
            <i className="fas fa-lightbulb"></i> Optimization Tip
          </div>
          <h3 className="text-lg font-bold">Weekend Inquiries Spiked by +42% in Freetown Properties</h3>
          <p className="text-xs text-blue-100/90 leading-relaxed font-light">
            Properties featuring complete amenities (like backup generators, ocean view verandas, and gated security) received double the lead conversions. Updating listing photos during peak weekend hours improves conversion rates by 35%.
          </p>
        </div>
        <div className="shrink-0 w-full md:w-auto">
          <button 
            onClick={() => {
              if (activeListings[0] && onSelectPropertyForEdit) {
                onSelectPropertyForEdit(activeListings[0]);
              }
            }}
            className="w-full md:w-auto px-5 py-3 bg-yellow-500 hover:bg-yellow-400 text-blue-950 font-extrabold text-xs rounded-xl transition-all shadow-md active:scale-95 flex items-center justify-center gap-2"
          >
            <i className="fas fa-magic"></i> Enhance Active Listings
          </button>
        </div>
      </div>

      {/* Listings Performance Table */}
      <div className="space-y-4">
        <div className="flex justify-between items-center">
          <h3 className="text-lg font-extrabold text-blue-950">Property Performance Summary</h3>
          <span className="text-xs font-semibold text-slate-500">{propertyComparison.length} Active Tracked Listings</span>
        </div>

        <div className="overflow-x-auto border border-slate-200 rounded-2xl">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50 border-b border-slate-200 text-slate-500 font-bold uppercase tracking-wider">
              <tr>
                <th className="p-4">Listing Title</th>
                <th className="p-4">Location</th>
                <th className="p-4">Price</th>
                <th className="p-4 text-center">30D Views</th>
                <th className="p-4 text-center">Inquiries</th>
                <th className="p-4 text-center">Conversion</th>
                <th className="p-4 text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 bg-white">
              {propertyComparison.map((p) => (
                <tr key={p.id} className="hover:bg-slate-50/80 transition-colors">
                  <td className="p-4 font-bold text-blue-950 flex items-center gap-3">
                    <img 
                      src={p.rawProperty.image} 
                      alt={p.fullTitle} 
                      className="w-10 h-10 rounded-lg object-cover border border-slate-200 shrink-0" 
                    />
                    <span className="truncate max-w-[180px]" title={p.fullTitle}>{p.fullTitle}</span>
                  </td>
                  <td className="p-4 text-slate-600 font-medium">{p.location}</td>
                  <td className="p-4 font-bold text-blue-900">
                    {p.currency === 'SLE' ? 'Le' : '$'}{p.price.toLocaleString()}
                  </td>
                  <td className="p-4 text-center font-extrabold text-slate-800">
                    {p.views.toLocaleString()}
                  </td>
                  <td className="p-4 text-center">
                    <span className="px-2.5 py-1 bg-yellow-100 text-yellow-800 font-bold rounded-full">
                      {p.leads}
                    </span>
                  </td>
                  <td className="p-4 text-center font-bold text-emerald-600">
                    {p.conversionRate}
                  </td>
                  <td className="p-4 text-right">
                    {onSelectPropertyForEdit && (
                      <button
                        onClick={() => onSelectPropertyForEdit(p.rawProperty)}
                        className="text-xs font-bold text-blue-900 hover:text-yellow-600 bg-blue-50 px-3 py-1.5 rounded-lg transition-colors"
                      >
                        Edit
                      </button>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
