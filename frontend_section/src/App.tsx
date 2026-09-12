import React, { useState } from 'react';
import { Sidebar } from './components/Sidebar';
import { TopBar } from './components/TopBar';
import { TabType } from './components/Navigation';
import { DashboardView } from './components/DashboardView';
import { AudienceView } from './components/AudienceView';
import { EventsView } from './components/EventsView';
import { FeedbackView } from './components/FeedbackView';
import { ReportsView } from './components/ReportsView';
import { AIChatView } from './components/AIChatView';
import { InstitutionsTableView } from './components/InstitutionsTableView';
import { CreateEventModal } from './components/CreateEventModal';
import { INSTITUTIONS, AUDIENCE_SEGMENTS, EVENTS_DATA } from './data/mockData';
import { Institution, TimePeriodFilter, UserRole, AudienceSegment, CulturalEvent } from './types';
import { OfficialInstitution } from './data/officialData';
import { CustomDateRange } from './components/TopBar';

export default function App() {
  const [selectedInstitution, setSelectedInstitution] = useState<Institution>(INSTITUTIONS[0]);
  const [periodFilter, setPeriodFilter] = useState<TimePeriodFilter>('custom');
  const [customDateRange, setCustomDateRange] = useState<CustomDateRange>({
    start: '2026-08-08',
    end: '2026-09-09',
    label: '8 августа — 9 сентября',
  });
  const [userRole, setUserRole] = useState<UserRole>('organizer');
  const [activeTab, setActiveTab] = useState<TabType>('dashboard');
  const [isCreateEventOpen, setIsCreateEventOpen] = useState(false);
  const [segmentForEvent, setSegmentForEvent] = useState<AudienceSegment | null>(null);
  const [selectedExhibitionFilter, setSelectedExhibitionFilter] = useState<string | null>(null);
  const [customDrafts, setCustomDrafts] = useState<CulturalEvent[]>([]);
  const [isMobileSidebarOpen, setIsMobileSidebarOpen] = useState(false);

  const handlePeriodFilterChange = (period: TimePeriodFilter, customRange?: CustomDateRange) => {
    setPeriodFilter(period);
    if (customRange) {
      setCustomDateRange(customRange);
    }
  };

  // Demo scenarios runner (Blueprint Page 14)
  const handleTriggerScenario = (scenarioNum: number) => {
    switch (scenarioNum) {
      case 1:
        setActiveTab('dashboard');
        setSelectedExhibitionFilter(null);
        break;
      case 2:
        setActiveTab('events');
        setSelectedExhibitionFilter('Время и пространство');
        break;
      case 3:
        setActiveTab('ai_assistant');
        break;
      case 4:
        setActiveTab('audience');
        break;
    }
  };

  const handleOpenCreateEventWithSegment = (segment: AudienceSegment) => {
    setSegmentForEvent(segment);
    setIsCreateEventOpen(true);
  };

  const handleSelectExhibitionFromDashboard = (title: string) => {
    setSelectedExhibitionFilter(title);
    setActiveTab('events');
  };

  const handleApplyFromAIChat = (eventDraft: any) => {
    setIsCreateEventOpen(true);
  };

  const handleSelectOfficialInst = (inst: OfficialInstitution) => {
    const matched = INSTITUTIONS.find(i => i.id === inst.institution_id);
    if (matched) {
      setSelectedInstitution(matched);
    }
    setActiveTab('dashboard');
  };

  const handleSaveDraft = (draftEvent: CulturalEvent) => {
    setCustomDrafts((prev) => [draftEvent, ...prev]);
    // Also prepend to EVENTS_DATA
    EVENTS_DATA.unshift(draftEvent);
    setIsCreateEventOpen(false);
    setActiveTab('events');
  };

  return (
    <div className="min-h-screen bg-[#f5f5f2] text-[#17171a] flex font-sans antialiased selection:bg-[#ff7a45]/20 selection:text-[#ff7a45]">
      {/* Sticky Left Sidebar from photo */}
      <Sidebar
        activeTab={activeTab}
        onSelectTab={setActiveTab}
        isOpenMobile={isMobileSidebarOpen}
        onCloseMobile={() => setIsMobileSidebarOpen(false)}
      />

      {/* Main Right Area */}
      <div className="flex-1 flex flex-col min-w-0 min-h-screen">
        <TopBar
          selectedInstitution={selectedInstitution}
          onSelectInstitution={setSelectedInstitution}
          periodFilter={periodFilter}
          onPeriodFilterChange={handlePeriodFilterChange}
          customDateRange={customDateRange}
          userRole={userRole}
          onUserRoleChange={setUserRole}
          onOpenMobileSidebar={() => setIsMobileSidebarOpen(true)}
          onOpenCreateEvent={() => {
            setSegmentForEvent(null);
            setIsCreateEventOpen(true);
          }}
        />

        {/* Quick Notification banner if dataQuality has divergence */}
        {selectedInstitution.dataQuality === 'divergence_detected' && (
          <div className="mx-4 sm:mx-8 mt-4 px-4 py-2.5 bg-[#fef5ea] border border-[#f5c68b] rounded-xl flex flex-wrap items-center justify-between gap-2 text-xs text-[#9c5400] shadow-xs">
            <div className="flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-[#e8a13c] ring-2 ring-[#fbecd4] shrink-0 animate-pulse" />
              <span>
                <strong>TOR §07/§08 Качество данных:</strong> {selectedInstitution.dataQualityNote || 'Обнаружены расхождения между турникетами и отчетами.'}
              </span>
            </div>
            <button 
              onClick={() => setActiveTab('institutions')}
              className="font-bold underline hover:no-underline text-xs shrink-0 cursor-pointer"
            >
              Смотреть реестр учреждений →
            </button>
          </div>
        )}

        {/* Main Content Area */}
        <main className="flex-1 px-4 sm:px-8 py-5">
          {activeTab === 'dashboard' && (
            <DashboardView
              institution={selectedInstitution}
              periodFilter={periodFilter}
              onPeriodFilterChange={handlePeriodFilterChange}
              customDateRange={customDateRange}
              onNavigateTab={(tab) => setActiveTab(tab)}
              onOpenCreateEvent={() => {
                setSegmentForEvent(null);
                setIsCreateEventOpen(true);
              }}
              onSelectExhibition={handleSelectExhibitionFromDashboard}
            />
          )}

          {activeTab === 'audience' && (
            <AudienceView
              institution={selectedInstitution}
              periodFilter={periodFilter}
              customDateRange={customDateRange}
              onOpenCreateEventWithSegment={handleOpenCreateEventWithSegment}
              onNavigateEvents={() => setActiveTab('events')}
            />
          )}

          {activeTab === 'events' && (
            <EventsView
              institution={selectedInstitution}
              periodFilter={periodFilter}
              customDateRange={customDateRange}
              onOpenCreateEvent={() => {
                setSegmentForEvent(null);
                setIsCreateEventOpen(true);
              }}
              selectedExhibitionTitle={selectedExhibitionFilter}
              onClearSelectedExhibition={() => setSelectedExhibitionFilter(null)}
            />
          )}

          {activeTab === 'feedback' && (
            <FeedbackView
              institution={selectedInstitution}
              periodFilter={periodFilter}
              customDateRange={customDateRange}
            />
          )}

          {activeTab === 'ai_assistant' && (
            <AIChatView
              institution={selectedInstitution}
              periodFilter={periodFilter}
              customDateRange={customDateRange}
              onApplyToCreateEvent={handleApplyFromAIChat}
            />
          )}

          {activeTab === 'institutions' && (
            <InstitutionsTableView
              selectedInstitution={selectedInstitution}
              onSelectInstitution={setSelectedInstitution}
              periodFilter={periodFilter}
              customDateRange={customDateRange}
            />
          )}

          {activeTab === 'reports' && (
            <ReportsView
              institution={selectedInstitution}
              periodFilter={periodFilter}
              customDateRange={customDateRange}
              onSelectInstitution={setSelectedInstitution}
            />
          )}
        </main>
      </div>

      {/* Create Event + AI Assistant Modal */}
      <CreateEventModal
        isOpen={isCreateEventOpen}
        onClose={() => setIsCreateEventOpen(false)}
        onSaveDraft={handleSaveDraft}
        initialSegment={segmentForEvent}
      />
    </div>
  );
}
