import React, { useState, useMemo } from 'react';
import { 
  Building2, 
  Search, 
  AlertTriangle, 
  CheckCircle2, 
  ArrowUpDown, 
  TrendingUp, 
  TrendingDown, 
  Download, 
  Layers, 
  Sparkles,
  Award,
  Check,
  CalendarRange
} from 'lucide-react';
import { OFFICIAL_INSTITUTIONS, OfficialInstitution } from '../data/officialData';
import { Institution, TimePeriodFilter, CustomDateRange, getPeriodDisplayLabel } from '../types';
import { INSTITUTIONS } from '../data/mockData';

interface InstitutionsTableViewProps {
  selectedInstitution?: Institution;
  onSelectInstitution?: (institution: Institution) => void;
  periodFilter?: TimePeriodFilter;
  customDateRange?: CustomDateRange;
}

export const InstitutionsTableView: React.FC<InstitutionsTableViewProps> = ({ 
  selectedInstitution,
  onSelectInstitution,
  periodFilter = 'month',
  customDateRange,
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [qualityFilter, setQualityFilter] = useState<'all' | 'ok' | 'divergence'>('all');
  const [onlySelected, setOnlySelected] = useState(false);
  const [sortField, setSortField] = useState<keyof OfficialInstitution>('service_revenue_total');
  const [sortAsc, setSortAsc] = useState(false);

  const periodLabel = getPeriodDisplayLabel(periodFilter, customDateRange);

  const filtered = useMemo(() => {
    return OFFICIAL_INSTITUTIONS.filter((item) => {
      if (onlySelected && selectedInstitution) {
        const isMatch = item.institution_id === selectedInstitution.id || 
                        item.institution.toLowerCase().includes(selectedInstitution.name.toLowerCase().slice(0, 8));
        if (!isMatch) return false;
      }

      const matchesSearch = 
        item.institution.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.center.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.institution_id.toLowerCase().includes(searchQuery.toLowerCase());
      
      const matchesQuality = 
        qualityFilter === 'all' ||
        (qualityFilter === 'ok' && item.data_quality === 'OK') ||
        (qualityFilter === 'divergence' && item.data_quality !== 'OK');

      return matchesSearch && matchesQuality;
    }).sort((a, b) => {
      const valA = a[sortField];
      const valB = b[sortField];
      if (typeof valA === 'number' && typeof valB === 'number') {
        return sortAsc ? valA - valB : valB - valA;
      }
      return sortAsc 
        ? String(valA).localeCompare(String(valB)) 
        : String(valB).localeCompare(String(valA));
    });
  }, [searchQuery, qualityFilter, sortField, sortAsc, onlySelected, selectedInstitution]);

  const handleSort = (field: keyof OfficialInstitution) => {
    if (sortField === field) {
      setSortAsc(!sortAsc);
    } else {
      setSortField(field);
      setSortAsc(false);
    }
  };

  const handleRowClick = (item: OfficialInstitution) => {
    if (!onSelectInstitution) return;
    const found = INSTITUTIONS.find(i => i.id === item.institution_id) || {
      id: item.institution_id,
      name: item.institution,
      city: item.center,
      type: item.institution_type,
      events2025: item.events_2025,
      events2026: item.events_2026,
      growthPct: item.event_growth_pct,
      trainedStaff: item.trained_people_total,
      creativeProducts: item.creative_products_total,
      serviceRevenueTotal: item.service_revenue_total,
      revenueGrowthPct: item.event_growth_pct > 0 ? +(item.event_growth_pct * 0.9).toFixed(1) : 4.2,
      dataQuality: item.data_quality === 'OK' ? 'ok' : 'divergence_detected',
      status: 'active',
    };
    onSelectInstitution(found);
  };

  const totalRevenue = useMemo(() => {
    return OFFICIAL_INSTITUTIONS.reduce((sum, item) => sum + item.service_revenue_total, 0);
  }, []);

  const totalEvents2026 = useMemo(() => {
    return OFFICIAL_INSTITUTIONS.reduce((sum, item) => sum + item.events_2026, 0);
  }, []);

  const flaggedCount = OFFICIAL_INSTITUTIONS.filter(i => i.data_quality !== 'OK').length;

  return (
    <div className="space-y-6">
      {/* Live Filter Context Card */}
      {selectedInstitution && (
        <div className="bg-white p-4 sm:p-5 rounded-[20px] border border-[#e8e7e2] shadow-[0_1px_2px_rgba(16,16,15,0.04),0_10px_24px_rgba(16,16,15,0.035)] flex flex-wrap items-center justify-between gap-4">
          <div className="flex items-center gap-3.5 min-w-0">
            <div className="w-10 h-10 rounded-2xl bg-[#ff7a45]/10 border border-[#ff7a45]/20 flex items-center justify-center text-[#ff7a45] shrink-0 font-bold">
              <Building2 className="w-5 h-5" />
            </div>
            <div className="min-w-0">
              <div className="flex flex-wrap items-center gap-2">
                <span className="text-xs font-black text-[#121214] font-['Unbounded',sans-serif]">
                  Текущее учреждение: {selectedInstitution.name}
                </span>
                <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-[#fafaf7] text-[#73737a] border border-[#e8e7e2]">
                  {selectedInstitution.city}
                </span>
                <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-[#ff7a45]/10 text-[#ff7a45] border border-[#ff7a45]/20">
                  {selectedInstitution.id}
                </span>
              </div>
              <div className="text-xs text-[#73737a] mt-0.5 flex flex-wrap items-center gap-2">
                <span>План 2026: <strong className="text-[#121214]">{selectedInstitution.events2026} событий</strong></span>
                <span>•</span>
                <span>Выручка: <strong className="text-[#121214]">{(selectedInstitution.serviceRevenueTotal / 1_000_000).toFixed(1)} млн ₽</strong></span>
                <span>•</span>
                <span>Период фильтра: <strong className="text-[#ff7a45]">{periodLabel}</strong></span>
              </div>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            <button
              type="button"
              onClick={() => setOnlySelected(!onlySelected)}
              className={`px-3.5 py-1.5 rounded-full text-xs font-bold transition-all cursor-pointer flex items-center gap-1.5 ${
                onlySelected
                  ? 'bg-[#ff7a45] text-white shadow-xs'
                  : 'bg-[#fafaf7] text-[#73737a] border border-[#e8e7e2] hover:text-[#121214]'
              }`}
            >
              <Check className="w-3.5 h-3.5" />
              <span>{onlySelected ? 'Показать все 19 учреждений' : 'Изолировать в таблице'}</span>
            </button>
          </div>
        </div>
      )}

      {/* Top Overview Banner */}
      <div className="bg-white p-6 rounded-[20px] border border-[#e8e7e2] shadow-[0_1px_2px_rgba(16,16,15,0.04),0_10px_24px_rgba(16,16,15,0.035)] space-y-5">
        <div className="flex flex-wrap items-start justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 mb-1.5">
              <span className="px-2.5 py-0.5 rounded-full text-[10px] sm:text-[11px] font-bold uppercase tracking-wider bg-[#ff7a45]/10 text-[#ff7a45] border border-[#ff7a45]/20">
                07 КОЛЛЕКЦИЯ / РЕЕСТР УЧРЕЖДЕНИЙ
              </span>
              <span className="text-[11px] text-[#8b8b92] font-semibold">Официальный свод Минкультуры РФ</span>
            </div>
            <h2 className="text-xl sm:text-2xl font-black text-[#121214] font-['Unbounded',sans-serif] tracking-tight">
              Официальные показатели 19 учреждений и центров
            </h2>
            <p className="text-xs sm:text-sm text-[#73737a] mt-1 max-w-3xl leading-relaxed">
              Сводная аналитика творческих центров и прототипирования: динамика мероприятий 2025–2026, подготовленные кадры, патенты, выручка от услуг и статус верификации данных.
            </p>
          </div>

          <div className="flex items-center gap-2">
            <span className="px-3.5 py-1.5 rounded-full bg-[#fafaf7] border border-[#e8e7e2] text-xs font-bold text-[#121214]">
              19 учреждений
            </span>
            <span className="px-3.5 py-1.5 rounded-full bg-[#e8a13c]/10 border border-[#e8a13c]/30 text-xs font-bold text-[#b45309] flex items-center gap-1.5">
              <AlertTriangle className="w-3.5 h-3.5 text-[#e8a13c]" />
              {flaggedCount} с расхождениями
            </span>
          </div>
        </div>

        {/* Aggregate KPI line */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-2 border-t border-[#e8e7e2] text-xs">
          <div className="p-4 bg-[#fafaf7] rounded-[16px] border border-[#e8e7e2]">
            <div className="text-[#888892] font-semibold uppercase text-[10px]">Общая выручка от услуг</div>
            <div className="text-lg font-black text-[#121214] mt-1 font-['Unbounded',sans-serif]">
              {Math.round(totalRevenue / 1000000)} млн ₽
            </div>
          </div>
          <div className="p-4 bg-[#fafaf7] rounded-[16px] border border-[#e8e7e2]">
            <div className="text-[#888892] font-semibold uppercase text-[10px]">Мероприятий в 2026 году</div>
            <div className="text-lg font-black text-[#ff7a45] mt-1 font-['Unbounded',sans-serif]">
              {totalEvents2026} событий
            </div>
          </div>
          <div className="p-4 bg-[#fafaf7] rounded-[16px] border border-[#e8e7e2]">
            <div className="text-[#888892] font-semibold uppercase text-[10px]">Обучено специалистов</div>
            <div className="text-lg font-black text-[#121214] mt-1 font-['Unbounded',sans-serif]">
              {OFFICIAL_INSTITUTIONS.reduce((s, i) => s + i.trained_people_total, 0).toLocaleString('ru-RU')} чел.
            </div>
          </div>
          <div className="p-4 bg-[#fafaf7] rounded-[16px] border border-[#e8e7e2]">
            <div className="text-[#888892] font-semibold uppercase text-[10px]">Творческих продуктов</div>
            <div className="text-lg font-black text-[#121214] mt-1 font-['Unbounded',sans-serif]">
              {OFFICIAL_INSTITUTIONS.reduce((s, i) => s + i.creative_products_total, 0).toLocaleString('ru-RU')} ед.
            </div>
          </div>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="flex flex-wrap items-center justify-between gap-3 bg-white p-4 rounded-[20px] border border-[#e8e7e2] shadow-[0_1px_2px_rgba(16,16,15,0.04),0_10px_24px_rgba(16,16,15,0.035)]">
        <div className="relative flex-1 min-w-[240px]">
          <Search className="w-4 h-4 text-[#9e9ea6] absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Поиск по учреждению, центру или коду (напр. INST_001)..."
            className="w-full pl-10 pr-4 py-2 bg-[#fafaf7] border border-[#e8e7e2] rounded-full text-xs text-[#121214] placeholder:text-[#9e9ea6] focus:outline-none focus:border-[#ff7a45] transition-colors"
          />
        </div>

        <div className="flex items-center gap-2">
          <span className="text-xs text-[#73737a] font-semibold">Верификация:</span>
          <div className="flex rounded-full border border-[#e8e7e2] bg-[#fafaf7] p-1 text-xs font-bold">
            <button
              onClick={() => setQualityFilter('all')}
              className={`px-3.5 py-1 rounded-full transition-all ${
                qualityFilter === 'all' ? 'bg-[#121214] text-white shadow-xs' : 'text-[#73737a] hover:text-[#121214]'
              }`}
            >
              Все (19)
            </button>
            <button
              onClick={() => setQualityFilter('ok')}
              className={`px-3.5 py-1 rounded-full transition-all ${
                qualityFilter === 'ok' ? 'bg-[#7fbf8a] text-white shadow-xs' : 'text-[#73737a] hover:text-[#121214]'
              }`}
            >
              OK (16)
            </button>
            <button
              onClick={() => setQualityFilter('divergence')}
              className={`px-3.5 py-1 rounded-full transition-all ${
                qualityFilter === 'divergence' ? 'bg-[#e8a13c] text-white shadow-xs' : 'text-[#73737a] hover:text-[#121214]'
              }`}
            >
              С расхождениями (3)
            </button>
          </div>
        </div>
      </div>

      {/* Main Official Table */}
      <div className="bg-white rounded-[20px] border border-[#e8e7e2] shadow-[0_1px_2px_rgba(16,16,15,0.04),0_10px_24px_rgba(16,16,15,0.035)] overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs border-collapse">
            <thead>
              <tr className="border-b border-[#e8e7e2] bg-[#fafaf7] text-[#73737a] font-bold uppercase text-[10px] tracking-wider font-['Unbounded',sans-serif]">
                <th className="py-3.5 px-4">Код</th>
                <th 
                  onClick={() => handleSort('institution')}
                  className="py-3.5 px-4 cursor-pointer hover:text-[#121214]"
                >
                  <div className="flex items-center gap-1.5">
                    <span>Учреждение / Центр</span>
                    <ArrowUpDown className="w-3 h-3 text-[#9e9ea6]" />
                  </div>
                </th>
                <th className="py-3.5 px-4">Направление</th>
                <th 
                  onClick={() => handleSort('events_2026')}
                  className="py-3.5 px-4 text-right cursor-pointer hover:text-[#121214]"
                >
                  <div className="flex items-center justify-end gap-1.5">
                    <span>События (25/26)</span>
                    <ArrowUpDown className="w-3 h-3 text-[#9e9ea6]" />
                  </div>
                </th>
                <th 
                  onClick={() => handleSort('event_growth_pct')}
                  className="py-3.5 px-4 text-right cursor-pointer hover:text-[#121214]"
                >
                  <div className="flex items-center justify-end gap-1.5">
                    <span>Динамика %</span>
                    <ArrowUpDown className="w-3 h-3 text-[#9e9ea6]" />
                  </div>
                </th>
                <th 
                  onClick={() => handleSort('trained_people_total')}
                  className="py-3.5 px-4 text-right cursor-pointer hover:text-[#121214]"
                >
                  <div className="flex items-center justify-end gap-1.5">
                    <span>Обучено</span>
                    <ArrowUpDown className="w-3 h-3 text-[#9e9ea6]" />
                  </div>
                </th>
                <th 
                  onClick={() => handleSort('service_revenue_total')}
                  className="py-3.5 px-4 text-right cursor-pointer hover:text-[#121214]"
                >
                  <div className="flex items-center justify-end gap-1.5">
                    <span>Выручка</span>
                    <ArrowUpDown className="w-3 h-3 text-[#9e9ea6]" />
                  </div>
                </th>
                <th className="py-3.5 px-4 text-center">Контроль качества</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#e8e7e2]/60">
              {filtered.map((inst) => {
                const isDivergent = inst.data_quality !== 'OK';
                const isCurrent = selectedInstitution?.id === inst.institution_id || 
                                  selectedInstitution?.name.toLowerCase() === inst.institution.toLowerCase();
                return (
                  <tr 
                    key={inst.institution_id}
                    onClick={() => handleRowClick(inst)}
                    className={`cursor-pointer transition-all ${
                      isCurrent 
                        ? 'bg-[#ff7a45]/10 hover:bg-[#ff7a45]/15 font-medium ring-1 ring-inset ring-[#ff7a45]/40' 
                        : isDivergent 
                          ? 'bg-[#e8a13c]/5 hover:bg-[#e8a13c]/10' 
                          : 'hover:bg-[#fafaf7]'
                    }`}
                  >
                    <td className="py-3.5 px-4 font-mono font-bold text-[#73737a] text-[11px]">
                      <div className="flex items-center gap-1.5">
                        {isCurrent && <span className="w-1.5 h-1.5 rounded-full bg-[#ff7a45]" />}
                        <span>{inst.institution_id}</span>
                      </div>
                    </td>
                    <td className="py-3.5 px-4 max-w-[280px]">
                      <div className="flex items-center gap-2">
                        <span className={`font-bold line-clamp-1 ${isCurrent ? 'text-[#ff7a45]' : 'text-[#121214]'}`}>
                          {inst.institution}
                        </span>
                        {isCurrent && (
                          <span className="px-1.5 py-0.5 rounded text-[9px] font-bold uppercase bg-[#ff7a45] text-white shrink-0">
                            Выбрано
                          </span>
                        )}
                      </div>
                      <div className="text-[11px] text-[#73737a] line-clamp-1">{inst.center}</div>
                    </td>
                    <td className="py-3.5 px-4 text-[#73737a] text-[11px]">
                      {inst.institution_type}
                    </td>
                    <td className="py-3.5 px-4 text-right font-medium text-[#73737a]">
                      {inst.events_2025} → <strong className="font-black text-[#121214] font-['Unbounded',sans-serif]">{inst.events_2026}</strong>
                    </td>
                    <td className="py-3.5 px-4 text-right">
                      {inst.event_growth_pct > 0 ? (
                        <span className="text-[#2e7d32] font-black inline-flex items-center gap-0.5 font-['Unbounded',sans-serif]">
                          <TrendingUp className="w-3 h-3" />
                          +{inst.event_growth_pct.toFixed(1)}%
                        </span>
                      ) : inst.event_growth_pct < 0 ? (
                        <span className="text-[#c62828] font-black inline-flex items-center gap-0.5 font-['Unbounded',sans-serif]">
                          <TrendingDown className="w-3 h-3" />
                          {inst.event_growth_pct.toFixed(1)}%
                        </span>
                      ) : (
                        <span className="text-[#9e9ea6] font-medium">0.0%</span>
                      )}
                    </td>
                    <td className="py-3.5 px-4 text-right font-semibold text-[#121214]">
                      {inst.trained_people_total.toLocaleString('ru-RU')} чел.
                    </td>
                    <td className="py-3.5 px-4 text-right font-black text-[#121214] font-['Unbounded',sans-serif]">
                      {inst.service_revenue_total ? `${Math.round(inst.service_revenue_total).toLocaleString('ru-RU')} ₽` : '—'}
                    </td>
                    <td className="py-3.5 px-4 text-center">
                      {inst.data_quality === 'OK' ? (
                        <span className="inline-flex items-center gap-1.5 px-3 py-0.5 rounded-full text-[10px] font-bold bg-[#7fbf8a]/15 text-[#2e7d32] border border-[#7fbf8a]/30">
                          <CheckCircle2 className="w-3 h-3 text-[#2e7d32]" />
                          Верифицировано
                        </span>
                      ) : (
                        <span 
                          title={inst.data_quality}
                          className="inline-flex items-center gap-1.5 px-3 py-0.5 rounded-full text-[10px] font-bold bg-[#e8a13c]/15 text-[#b45309] border border-[#e8a13c]/30 cursor-help"
                        >
                          <AlertTriangle className="w-3 h-3 text-[#b45309]" />
                          {inst.data_quality.length > 22 ? `${inst.data_quality.slice(0, 22)}…` : inst.data_quality}
                        </span>
                      )}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
