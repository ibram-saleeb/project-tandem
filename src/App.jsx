import React, { useState, useMemo } from 'react';
import { useLocalStorage } from './storage/useLocalStorage';
import { DEFAULT_APP_STATE } from './storage/defaults';
import { calculateHousehold } from './logic/calculator';
import { useTrialState } from './storage/useTrialState';

import { DesktopSidebar } from './components/DesktopSidebar';
import { NavTabs } from './components/NavTabs';
import { HeroDashboard } from './components/HeroDashboard';
import { IncomeSection } from './components/IncomeSection';
import { ExpenseSection } from './components/ExpenseSection';
import { ScenarioEngine } from './components/ScenarioEngine';
import { AssumptionsModal } from './components/AssumptionsModal';
import { ExportModal } from './components/ExportModal';
import FeedbackModal from './components/FeedbackModal';
import { PaywallModal } from './components/PaywallModal';

export default function App() {
  const [appState, setAppState] = useLocalStorage('project_tandem_app_v1', DEFAULT_APP_STATE, 'household_clarity_app_v1');
  const [activeTab, setActiveTab] = useState('overview'); // 'overview' | 'income' | 'expenses' | 'scenario'
  const [isAssumptionsModalOpen, setIsAssumptionsModalOpen] = useState(false);
  const [isExportModalOpen, setIsExportModalOpen] = useState(false);
  const [isFeedbackModalOpen, setIsFeedbackModalOpen] = useState(false);
  
  // 14-Day Free Trial State
  const trialState = useTrialState();
  const [isPaywallExplicitlyOpen, setIsPaywallExplicitlyOpen] = useState(false);
  const [dismissedExpiredSession, setDismissedExpiredSession] = useState(false);

  const isPaywallVisible = isPaywallExplicitlyOpen || (trialState.isExpired && !dismissedExpiredSession);

  // Recalculate household calculations live on every state change
  const calculatedData = useMemo(() => {
    return calculateHousehold(appState);
  }, [appState]);

  // Handler functions
  const handleUpdatePartner = (updatedPartners) => {
    setAppState((prev) => ({
      ...prev,
      partners: updatedPartners
    }));
  };

  const handleUpdateExpenses = (updatedExpenses) => {
    setAppState((prev) => ({
      ...prev,
      expenses: updatedExpenses
    }));
  };

  const handleSavingsChange = (newTarget) => {
    setAppState((prev) => ({
      ...prev,
      savingsTargetMonthly: newTarget
    }));
  };

  const handleToggleScenario = () => {
    setAppState((prev) => {
      const nextScenarioMode = !prev.scenarioMode;
      if (nextScenarioMode) {
        setActiveTab('scenario');
      }
      return {
        ...prev,
        scenarioMode: nextScenarioMode
      };
    });
  };

  const handleUpdateScenario = (updatedScenario) => {
    setAppState((prev) => {
      const scenarios = prev.scenarios && prev.scenarios.length > 0 ? prev.scenarios : [DEFAULT_APP_STATE.scenarios[0]];
      const activeId = prev.activeScenarioId || scenarios[0]?.id;
      const updatedList = scenarios.map((s) => (s.id === activeId ? { ...s, ...updatedScenario } : s));
      return {
        ...prev,
        scenarios: updatedList,
        scenario: updatedScenario
      };
    });
  };

  const handleAddScenario = (name = "Custom Scenario") => {
    setAppState((prev) => {
      const newId = `scen-${Date.now()}`;
      const newScen = {
        id: newId,
        name,
        presetKey: 'custom',
        incomeOverrides: {
          p1: { salary: null, salaryPercent: 100 },
          p2: { salary: null, salaryPercent: 100 }
        },
        expensesOverride: null,
        savingsTargetMonthly: prev.savingsTargetMonthly || 1500
      };
      const existing = prev.scenarios || [];
      return {
        ...prev,
        scenarios: [...existing, newScen],
        activeScenarioId: newId,
        scenario: newScen,
        scenarioMode: true
      };
    });
    setActiveTab('scenario');
  };

  const handleDeleteScenario = (id) => {
    setAppState((prev) => {
      const existing = prev.scenarios || [];
      const filtered = existing.filter((s) => s.id !== id);
      const nextActive = filtered[0] || DEFAULT_APP_STATE.scenarios[0];
      return {
        ...prev,
        scenarios: filtered.length > 0 ? filtered : [DEFAULT_APP_STATE.scenarios[0]],
        activeScenarioId: nextActive.id,
        scenario: nextActive
      };
    });
  };

  const handleSelectActiveScenario = (id) => {
    setAppState((prev) => {
      const existing = prev.scenarios || [];
      const found = existing.find((s) => s.id === id);
      if (!found) return prev;
      return {
        ...prev,
        activeScenarioId: id,
        scenario: found,
        scenarioMode: true
      };
    });
  };

  return (
    <div className="app-shell">
      {/* Desktop Left Sidebar Rail */}
      <DesktopSidebar
        activeTab={activeTab}
        onTabChange={setActiveTab}
        partners={appState.partners}
        trialDaysLeft={trialState.daysRemaining}
        onOpenExport={() => setIsExportModalOpen(true)}
        onOpenPaywall={() => setIsPaywallExplicitlyOpen(true)}
      />

      {/* Main App Content Area */}
      <main className="main-content-layout">
        {/* Overview / Month Tab */}
        {activeTab === 'overview' && (
          <HeroDashboard
            data={calculatedData}
            scenarioMode={appState.scenarioMode}
            savingsTargetMonthly={appState.savingsTargetMonthly}
            onSavingsChange={handleSavingsChange}
            expenses={appState.expenses}
          />
        )}

        {/* Expenses / Spending Tab */}
        {activeTab === 'expenses' && (
          <ExpenseSection
            expenses={appState.expenses}
            onUpdateExpenses={handleUpdateExpenses}
            partners={appState.partners}
          />
        )}

        {/* Income Tab */}
        {activeTab === 'income' && (
          <IncomeSection
            partners={appState.partners}
            onUpdatePartner={handleUpdatePartner}
            calculatedData={calculatedData}
          />
        )}

        {/* What-If Scenario Tab */}
        {activeTab === 'scenario' && (
          <ScenarioEngine
            scenarioMode={appState.scenarioMode}
            onToggleScenario={handleToggleScenario}
            scenarioData={{
              ...appState.scenario,
              baseline: calculatedData.baseline,
              scenario: calculatedData.scenario,
              deltas: calculatedData.deltas,
              multiScenarios: calculatedData.multiScenarios,
              activeScenarioId: appState.activeScenarioId || calculatedData.activeScenarioId
            }}
            onUpdateScenario={handleUpdateScenario}
            onAddScenario={handleAddScenario}
            onDeleteScenario={handleDeleteScenario}
            onSelectScenario={handleSelectActiveScenario}
            partners={appState.partners}
            baselineExpenses={appState.expenses}
          />
        )}
      </main>

      {/* Mobile Floating 56px Frosted Navigation Pill Bar */}
      <NavTabs
        activeTab={activeTab}
        onTabChange={setActiveTab}
        scenarioMode={appState.scenarioMode}
      />

      {/* Modals & Tools */}
      <ExportModal
        isOpen={isExportModalOpen}
        onClose={() => setIsExportModalOpen(false)}
        appState={appState}
        onImportState={(newState) => setAppState(newState)}
      />

      <AssumptionsModal
        isOpen={isAssumptionsModalOpen}
        onClose={() => setIsAssumptionsModalOpen(false)}
      />

      <FeedbackModal
        isOpen={isFeedbackModalOpen}
        onClose={() => setIsFeedbackModalOpen(false)}
      />

      {isPaywallVisible && (
        <PaywallModal
          isOpen={true}
          onClose={() => setDismissedExpiredSession(true)}
          trialState={trialState}
        />
      )}
    </div>
  );
}
