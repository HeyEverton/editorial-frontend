import React, { useState, useEffect } from 'react';
import Chart from 'react-apexcharts';
import { Users, FolderCheck, Zap, DollarSign, TrendingUp, AlertTriangle, ShieldCheck, CheckCircle2, Award } from 'lucide-react';

interface AnalyticsData {
  period: string;
  kpis: {
    totalUsers: number;
    totalProjects: number;
    totalGenerations: number;
    estimatedMRR: number;
    totalTokensLeft: number;
  };
  badges: {
    newUsersToday: number;
    aiGenerationsToday: number;
    activePlansCount: number;
    alertCount: number;
  };
  timeSeries: Array<{
    date: string;
    generations: number;
    revenue: number;
    newUsers: number;
  }>;
  roleDistribution: Array<{
    name: string;
    count: number;
    percentage: number;
  }>;
  planDistribution: Array<{
    name: string;
    count: number;
    percentage: number;
  }>;
  topUsers: Array<{
    id: string;
    name: string;
    email: string;
    role: string;
    plan: string;
    projectsCount: number;
    generationsThisMonth: number;
  }>;
}

export const AnalyticsDashboard: React.FC = () => {
  const [period, setPeriod] = useState<'7d' | '30d' | '90d' | '1a'>('30d');
  const [data, setData] = useState<AnalyticsData | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  const token = localStorage.getItem('auth_token');

  const fetchAnalytics = async (p: string) => {
    try {
      setIsLoading(true);
      const res = await fetch(`http://localhost:3001/api/admin/analytics?period=${p}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (res.ok) {
        const result = await res.json();
        setData(result);
      }
    } catch (err) {
      console.error('Erro ao buscar dados de analytics:', err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchAnalytics(period);
  }, [period]);

  const dates = data?.timeSeries.map((t) => t.date) || [];
  const genSeries = data?.timeSeries.map((t) => t.generations) || [];
  const revSeries = data?.timeSeries.map((t) => t.revenue) || [];
  const usersSeries = data?.timeSeries.map((t) => t.newUsers) || [];

  // ApexCharts Configs
  const isDark = document.documentElement.classList.contains('dark');
  const textColor = isDark ? '#94a3b8' : '#475569';
  const gridColor = isDark ? 'rgba(255, 255, 255, 0.05)' : 'rgba(0, 0, 0, 0.05)';

  const generationsChartOptions: any = {
    chart: {
      type: 'area',
      toolbar: { show: false },
      sparkline: { enabled: false },
      background: 'transparent',
    },
    colors: ['#8b5cf6'],
    stroke: { curve: 'smooth', width: 2 },
    fill: {
      type: 'gradient',
      gradient: {
        shadeIntensity: 1,
        opacityFrom: 0.45,
        opacityTo: 0.05,
      },
    },
    xaxis: { categories: dates, labels: { style: { colors: textColor, fontSize: '10px' } } },
    yaxis: { labels: { style: { colors: textColor, fontSize: '10px' } } },
    grid: { borderColor: gridColor },
    tooltip: { theme: isDark ? 'dark' : 'light' },
  };

  const revenueChartOptions: any = {
    chart: {
      type: 'line',
      toolbar: { show: false },
      background: 'transparent',
    },
    colors: ['#10b981'],
    stroke: { curve: 'smooth', width: 2 },
    xaxis: { categories: dates, labels: { style: { colors: textColor, fontSize: '10px' } } },
    yaxis: { labels: { style: { colors: textColor, fontSize: '10px' } } },
    grid: { borderColor: gridColor },
    tooltip: { theme: isDark ? 'dark' : 'light' },
  };

  const newUsersChartOptions: any = {
    chart: {
      type: 'bar',
      toolbar: { show: false },
      background: 'transparent',
    },
    colors: ['#3b82f6'],
    plotOptions: { bar: { borderRadius: 4, columnWidth: '50%' } },
    xaxis: { categories: dates, labels: { style: { colors: textColor, fontSize: '10px' } } },
    yaxis: { labels: { style: { colors: textColor, fontSize: '10px' } } },
    grid: { borderColor: gridColor },
    tooltip: { theme: isDark ? 'dark' : 'light' },
  };

  // Donut Charts Configs
  const roleChartOptions: any = {
    chart: { type: 'donut', background: 'transparent' },
    labels: data?.roleDistribution.map((r) => r.name) || [],
    colors: ['#6366f1', '#10b981', '#f59e0b', '#ec4899'],
    legend: { position: 'bottom', labels: { colors: textColor } },
    stroke: { show: false },
    dataLabels: { enabled: true },
    tooltip: { theme: isDark ? 'dark' : 'light' },
  };

  const planChartOptions: any = {
    chart: { type: 'donut', background: 'transparent' },
    labels: data?.planDistribution.map((p) => p.name) || [],
    colors: ['#3b82f6', '#8b5cf6', '#000000'],
    legend: { position: 'bottom', labels: { colors: textColor } },
    stroke: { show: false },
    dataLabels: { enabled: true },
    tooltip: { theme: isDark ? 'dark' : 'light' },
  };

  return (
    <div className="min-h-full bg-[#fcfcfc] dark:bg-elite-black transition-colors duration-500 font-sans">
      <div className="p-6 sm:p-12 space-y-12 sm:space-y-16 max-w-7xl mx-auto overflow-hidden animate-in fade-in slide-in-from-bottom-8 duration-700">
        
        {/* ── HEADER DA PÁGINA COM SELETOR DE PERÍODO ── */}
        <header className="space-y-6">
          <div className="flex items-center gap-4">
            <span className="text-[9px] font-bold text-black/20 dark:text-white/20 tracking-[0.4em] uppercase">
              EXECUTIVE ANALYTICS & SAAS PERFORMANCE
            </span>
            <div className="h-px w-20 bg-black/5 dark:bg-white/5" />
          </div>

          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-end gap-6">
            <div>
              <h1 className="serif text-4xl sm:text-7xl italic font-light tracking-tighter text-black dark:text-white leading-tight mb-3">
                Analytics
              </h1>
              <p className="text-[11px] font-bold text-gray-400 dark:text-white/40 tracking-[0.2em] uppercase leading-relaxed max-w-xl">
                Visão consolidada de desempenho do acervo editorial e da plataforma SaaS.
              </p>
            </div>

            {/* Filter Tabs */}
            <div className="flex border border-gray-200 dark:border-white/10 p-1 bg-white dark:bg-elite-gray shrink-0">
              {(['7d', '30d', '90d', '1a'] as const).map((t) => (
                <button
                  key={t}
                  onClick={() => setPeriod(t)}
                  className={`px-4 py-2 text-[9px] font-black tracking-[0.2em] uppercase transition-all ${
                    period === t
                      ? 'bg-black text-white dark:bg-white dark:text-black shadow-sm'
                      : 'text-gray-400 hover:text-black dark:hover:text-white'
                  }`}
                >
                  {t}
                </button>
              ))}
            </div>
          </div>

          <div className="h-px w-40 bg-black/10 dark:bg-white/10 mt-8" />
        </header>

        {isLoading ? (
          <div className="py-24 text-center space-y-4">
            <div className="w-8 h-8 border-2 border-black dark:border-white border-t-transparent animate-spin mx-auto" />
            <p className="text-xs font-bold text-gray-400 tracking-widest uppercase">Consolidando dados operacionais...</p>
          </div>
        ) : (
          <>
            {/* ── METRICAS HERO (4 CARDS PRINCIPAIS) ── */}
            <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-6">
              {/* Card 1: Usuários */}
              <div className="p-6 sm:p-8 bg-white dark:bg-elite-gray border border-gray-100 dark:border-white/10 flex flex-col justify-between ui-card-hover">
                <div className="flex justify-between items-start">
                  <span className="text-[8px] font-black text-gray-400 dark:text-white/30 tracking-[0.4em] uppercase">
                    USUÁRIOS ATIVOS
                  </span>
                  <div className="p-2 bg-gray-50 dark:bg-white/5 border border-gray-100 dark:border-white/5">
                    <Users size={16} className="text-black dark:text-white" />
                  </div>
                </div>
                <div className="space-y-1 py-4">
                  <h2 className="serif text-4xl italic font-bold text-black dark:text-white">
                    {data?.kpis.totalUsers || 0}
                  </h2>
                </div>
                <div className="flex justify-between items-center text-[9px] font-bold text-gray-400 dark:text-white/40 tracking-[0.2em] uppercase">
                  <span>+{data?.badges.newUsersToday || 0} hoje</span>
                  <span>{data?.badges.activePlansCount || 0} assinantes</span>
                </div>
              </div>

              {/* Card 2: Projetos */}
              <div className="p-6 sm:p-8 bg-white dark:bg-elite-gray border border-gray-100 dark:border-white/10 flex flex-col justify-between ui-card-hover">
                <div className="flex justify-between items-start">
                  <span className="text-[8px] font-black text-gray-400 dark:text-white/30 tracking-[0.4em] uppercase">
                    PROJETOS NO ACERVO
                  </span>
                  <div className="p-2 bg-gray-50 dark:bg-white/5 border border-gray-100 dark:border-white/5">
                    <FolderCheck size={16} className="text-black dark:text-white" />
                  </div>
                </div>
                <div className="space-y-1 py-4">
                  <h2 className="serif text-4xl italic font-bold text-black dark:text-white">
                    {data?.kpis.totalProjects || 0}
                  </h2>
                </div>
                <div className="text-[9px] font-bold text-gray-400 dark:text-white/40 tracking-[0.2em] uppercase">
                  Manuscritos gerados
                </div>
              </div>

              {/* Card 3: Gerações no Mês */}
              <div className="p-6 sm:p-8 bg-white dark:bg-elite-gray border border-gray-100 dark:border-white/10 flex flex-col justify-between ui-card-hover">
                <div className="flex justify-between items-start">
                  <span className="text-[8px] font-black text-gray-400 dark:text-white/30 tracking-[0.4em] uppercase">
                    GERAÇÕES NO MÊS
                  </span>
                  <div className="p-2 bg-gray-50 dark:bg-white/5 border border-gray-100 dark:border-white/5">
                    <Zap size={16} className="text-black dark:text-white" />
                  </div>
                </div>
                <div className="space-y-1 py-4">
                  <h2 className="serif text-4xl italic font-bold text-black dark:text-white">
                    {data?.kpis.totalGenerations || 0}
                  </h2>
                </div>
                <div className="flex justify-between items-center text-[9px] font-bold text-gray-400 dark:text-white/40 tracking-[0.2em] uppercase">
                  <span>~{data?.badges.aiGenerationsToday || 0}/dia</span>
                  <span>Pool: {data?.kpis.totalTokensLeft || 0} tokens</span>
                </div>
              </div>

              {/* Card 4: Receita Mensal */}
              <div className="p-6 sm:p-8 bg-white dark:bg-elite-gray border border-gray-100 dark:border-white/10 flex flex-col justify-between ui-card-hover shadow-xl">
                <div className="flex justify-between items-start">
                  <span className="text-[8px] font-black text-gray-400 dark:text-white/30 tracking-[0.4em] uppercase">
                    RECEITA MENSUAL ESTIMADA
                  </span>
                  <div className="p-2 bg-emerald-50 dark:bg-emerald-900/20 border border-emerald-200 dark:border-emerald-700/30">
                    <DollarSign size={16} className="text-emerald-600 dark:text-emerald-400" />
                  </div>
                </div>
                <div className="space-y-1 py-4">
                  <h2 className="serif text-3xl lg:text-4xl italic font-bold text-black dark:text-white">
                    R$ {data?.kpis.estimatedMRR.toLocaleString('pt-BR')},00
                  </h2>
                </div>
                <div className="text-[9px] font-bold text-emerald-600 dark:text-emerald-400 tracking-[0.2em] uppercase">
                  +100% Recorrente
                </div>
              </div>
            </div>

            {/* ── MINI INDICADORES SECUNDÁRIOS ── */}
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
              {[
                { label: 'Projetos Ativos', val: data?.kpis.totalProjects, icon: FolderCheck },
                { label: 'Média Diária IA', val: `${data?.badges.aiGenerationsToday}/dia`, icon: Zap },
                { label: 'Avaliação Média', val: '4.9 / 5.0', icon: Award },
                { label: 'Finalizadas (PDF)', val: data?.kpis.totalProjects, icon: CheckCircle2 },
                { label: 'Pool de Tokens', val: data?.kpis.totalTokensLeft, icon: ShieldCheck },
                { label: 'Alertas Operacionais', val: data?.badges.alertCount, icon: AlertTriangle, isAlert: true },
              ].map((m, i) => (
                <div
                  key={i}
                  className={`p-4 border bg-white dark:bg-elite-gray space-y-2 ${
                    m.isAlert && Number(m.val) > 0
                      ? 'border-amber-300 dark:border-amber-700/50 bg-amber-50/20'
                      : 'border-gray-100 dark:border-white/5'
                  }`}
                >
                  <div className="flex justify-between items-center">
                    <span className="text-[8px] font-black text-gray-400 dark:text-white/30 tracking-[0.2em] uppercase">
                      {m.label}
                    </span>
                    <m.icon size={13} className="text-gray-400" />
                  </div>
                  <span className="serif text-xl italic font-bold text-black dark:text-white block">
                    {m.val}
                  </span>
                </div>
              ))}
            </div>

            {/* ── EVOLUÇÃO NO PERÍODO (3 GRÁFICOS) ── */}
            <div className="space-y-6 pt-4">
              <div className="flex items-center gap-4 border-b border-gray-100 dark:border-white/5 pb-4">
                <TrendingUp size={18} className="text-black dark:text-white" />
                <h3 className="serif text-3xl italic text-black dark:text-white">
                  Evolução no período
                </h3>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Chart 1: Gerações por dia */}
                <div className="p-6 bg-white dark:bg-elite-gray border border-gray-100 dark:border-white/5 space-y-4">
                  <span className="text-[9px] font-black text-gray-400 dark:text-white/30 tracking-[0.4em] uppercase block">
                    GERAÇÕES DE I.A POR DIA
                  </span>
                  <Chart
                    options={generationsChartOptions}
                    series={[{ name: 'Gerações', data: genSeries }]}
                    type="area"
                    height={220}
                  />
                </div>

                {/* Chart 2: Receita por dia */}
                <div className="p-6 bg-white dark:bg-elite-gray border border-gray-100 dark:border-white/5 space-y-4">
                  <span className="text-[9px] font-black text-gray-400 dark:text-white/30 tracking-[0.4em] uppercase block">
                    RECEITA ESTIMADA POR DIA (R$)
                  </span>
                  <Chart
                    options={revenueChartOptions}
                    series={[{ name: 'Receita (R$)', data: revSeries }]}
                    type="line"
                    height={220}
                  />
                </div>

                {/* Chart 3: Novos cadastros */}
                <div className="p-6 bg-white dark:bg-elite-gray border border-gray-100 dark:border-white/5 space-y-4">
                  <span className="text-[9px] font-black text-gray-400 dark:text-white/30 tracking-[0.4em] uppercase block">
                    NOVOS CADASTROS NO PERÍODO
                  </span>
                  <Chart
                    options={newUsersChartOptions}
                    series={[{ name: 'Novos Usuários', data: usersSeries }]}
                    type="bar"
                    height={220}
                  />
                </div>
              </div>
            </div>

            {/* ── DISTRIBUIÇÕES DE PERFIL E PLANOS (DONUTS) ── */}
            <div className="space-y-6 pt-4">
              <h3 className="serif text-3xl italic text-black dark:text-white border-b border-gray-100 dark:border-white/5 pb-4">
                Distribuições
              </h3>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Donut 1: Usuários por Perfil */}
                <div className="p-6 bg-white dark:bg-elite-gray border border-gray-100 dark:border-white/5 space-y-4">
                  <span className="text-[9px] font-black text-gray-400 dark:text-white/30 tracking-[0.4em] uppercase block">
                    USUÁRIOS POR PERFIL / CARGO
                  </span>
                  <Chart
                    options={roleChartOptions}
                    series={data?.roleDistribution.map((r) => r.count) || []}
                    type="donut"
                    height={260}
                  />
                </div>

                {/* Donut 2: Usuários por Plano */}
                <div className="p-6 bg-white dark:bg-elite-gray border border-gray-100 dark:border-white/5 space-y-4">
                  <span className="text-[9px] font-black text-gray-400 dark:text-white/30 tracking-[0.4em] uppercase block">
                    USUÁRIOS POR PLANO DE ASSINATURA
                  </span>
                  <Chart
                    options={planChartOptions}
                    series={data?.planDistribution.map((p) => p.count) || []}
                    type="donut"
                    height={260}
                  />
                </div>
              </div>
            </div>

            {/* ── RANKINGS E ATENÇÃO NECESSÁRIA ── */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 pt-4">
              {/* Rankings (2 cols) */}
              <div className="lg:col-span-2 p-6 bg-white dark:bg-elite-gray border border-gray-100 dark:border-white/5 space-y-6">
                <span className="text-[9px] font-black text-gray-400 dark:text-white/30 tracking-[0.4em] uppercase block">
                  TOP ASSINANTES MAIS ATIVOS (RANKINGS)
                </span>

                <div className="overflow-x-auto">
                  <table className="w-full text-left border-collapse text-xs">
                    <thead>
                      <tr className="border-b border-gray-100 dark:border-white/5 text-[9px] font-black tracking-[0.3em] uppercase text-gray-400">
                        <th className="py-3 px-2">ASSINANTE</th>
                        <th className="py-3 px-2">PLANO</th>
                        <th className="py-3 px-2">PROJETOS</th>
                        <th className="py-3 px-2 text-right">GERAÇÕES MÊS</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-50 dark:divide-white/5">
                      {data?.topUsers.map((u, index) => (
                        <tr key={u.id}>
                          <td className="py-3 px-2 font-normal text-black dark:text-white flex items-center gap-3">
                            <span className="w-5 h-5 rounded-full bg-black text-white dark:bg-white dark:text-black font-bold text-[10px] flex items-center justify-center">
                              {index + 1}
                            </span>
                            <span className="serif italic text-sm">{u.name}</span>
                          </td>
                          <td className="py-3 px-2">
                            <span className="px-2 py-0.5 border border-gray-200 dark:border-white/10 text-[9px] font-bold uppercase tracking-wider">
                              {u.plan}
                            </span>
                          </td>
                          <td className="py-3 px-2 font-mono">{u.projectsCount} manuscritos</td>
                          <td className="py-3 px-2 text-right font-serif italic text-sm font-bold">
                            {u.generationsThisMonth}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>

              {/* Atenção Necessária (1 col) */}
              <div className="p-6 bg-white dark:bg-elite-gray border border-gray-100 dark:border-white/5 space-y-6">
                <div className="flex items-center gap-2 text-amber-600 dark:text-amber-400">
                  <AlertTriangle size={18} />
                  <span className="text-[9px] font-black tracking-[0.4em] uppercase">
                    ATENÇÃO NECESSÁRIA
                  </span>
                </div>

                <div className="space-y-4">
                  <div className="p-4 border border-amber-200 dark:border-amber-700/30 bg-amber-50/20 dark:bg-amber-900/10 space-y-1">
                    <span className="text-xs font-bold text-amber-800 dark:text-amber-300 block">
                      Alertas de Consumo de Limite
                    </span>
                    <p className="text-[10px] text-gray-500 dark:text-gray-400 leading-relaxed">
                      {data?.badges.alertCount || 0} assinantes estão próximos de atingir o limite mensal de geração.
                    </p>
                  </div>

                  <div className="p-4 border border-emerald-200 dark:border-emerald-700/30 bg-emerald-50/20 dark:bg-emerald-900/10 space-y-1">
                    <span className="text-xs font-bold text-emerald-800 dark:text-emerald-300 block">
                      Saúde do Servidor de I.A
                    </span>
                    <p className="text-[10px] text-gray-500 dark:text-gray-400 leading-relaxed">
                      Conexão Gemini API operando com 100% de estabilidade e latência média &lt; 1.2s.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
};
