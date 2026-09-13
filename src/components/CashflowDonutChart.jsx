import React from 'react';
import { ResponsiveContainer, PieChart, Pie, Cell, Tooltip } from 'recharts';
import { formatMoney } from '../utils/formatters.js';

const CATEGORY_COLORS = {
  Housing: '#0f6e62',
  Living: '#3dbfa8',
  Transport: '#7fe3cf',
  Insurance: '#c9873f',
  Personal: '#e8c9a0',
  Debt: '#f43f5e',
  Childcare: '#a78bfa',
  General: '#6d746c'
};

export function CashflowDonutChart({ expenses = [], activeCategory = 'all', onSelectCategory }) {
  if (!expenses || expenses.length === 0) {
    return (
      <div className="donut-chart-placeholder">
        No expense data to display chart.
      </div>
    );
  }

  // Aggregate category totals
  const categoryTotals = expenses.reduce((acc, exp) => {
    const amount = Number(exp.amount) || 0;
    let monthlyVal = amount;
    if (exp.frequency === 'annual') monthlyVal = amount / 12;
    if (exp.frequency === 'weekly') monthlyVal = (amount * 52) / 12;
    if (exp.frequency === 'fortnightly') monthlyVal = (amount * 26) / 12;

    const cat = exp.category || 'General';
    acc[cat] = (acc[cat] || 0) + monthlyVal;
    return acc;
  }, {});

  const data = Object.keys(categoryTotals).map((cat) => ({
    name: cat,
    value: Math.round(categoryTotals[cat]),
    color: CATEGORY_COLORS[cat] || '#6d746c'
  })).filter(item => item.value > 0);

  const totalMonthlySpend = data.reduce((sum, item) => sum + item.value, 0);
  const activeItem = activeCategory !== 'all' ? data.find(d => d.name.toLowerCase() === activeCategory.toLowerCase()) : null;

  const CustomTooltip = ({ active, payload }) => {
    if (active && payload && payload.length) {
      const item = payload[0];
      const pct = totalMonthlySpend > 0 ? Math.round((item.value / totalMonthlySpend) * 100) : 0;
      return (
        <div className="custom-chart-tooltip">
          <div className="tooltip-cat-title" style={{ color: item.payload.color }}>
            ● {item.name}
          </div>
          <div className="tooltip-cat-value">
            {formatMoney(item.value)} /mo
          </div>
          <div className="tooltip-row" style={{ color: 'var(--text-muted)' }}>
            <span>Share of spending:</span>
            <strong>{pct}%</strong>
          </div>
        </div>
      );
    }
    return null;
  };

  const handleSliceClick = (entry) => {
    if (onSelectCategory) {
      onSelectCategory(entry.name);
    }
  };

  return (
    <div className="donut-chart-wrapper" aria-label="Expenses category donut chart">
      <div style={{ position: 'relative', width: '100%', height: 220 }}>
        <ResponsiveContainer width="100%" height={220}>
          <PieChart>
            <Pie
              data={data}
              cx="50%"
              cy="50%"
              innerRadius={58}
              outerRadius={82}
              paddingAngle={3}
              dataKey="value"
              stroke="none"
              onClick={handleSliceClick}
              cursor="pointer"
            >
              {data.map((entry, index) => {
                const isSelected = !activeItem || activeItem.name === entry.name;
                return (
                  <Cell
                    key={`cell-${index}`}
                    fill={entry.color}
                    opacity={isSelected ? 1 : 0.35}
                    style={{ outline: 'none', transition: 'opacity 0.2s ease' }}
                  />
                );
              })}
            </Pie>
            <Tooltip content={<CustomTooltip />} />
          </PieChart>
        </ResponsiveContainer>

        {/* Center Readout Metric */}
        <div className="donut-center-metric">
          <div className="donut-center-label">
            {activeItem ? activeItem.name : 'Total Out'}
          </div>
          <div className="donut-center-value">
            {formatMoney(activeItem ? activeItem.value : totalMonthlySpend)}
          </div>
        </div>
      </div>

      {/* Chart Legend with interactive filtering */}
      <div className="donut-legend-grid">
        {data.map((item) => {
          const isActive = activeCategory !== 'all' && activeCategory.toLowerCase() === item.name.toLowerCase();
          return (
            <button
              key={item.name}
              type="button"
              className={`legend-item ${isActive ? 'active' : ''}`}
              onClick={() => onSelectCategory && onSelectCategory(item.name)}
              title={`Filter by ${item.name}`}
            >
              <span className="legend-dot" style={{ backgroundColor: item.color }} />
              <span className="legend-name">{item.name}</span>
              <span className="legend-val">{formatMoney(item.value)}</span>
            </button>
          );
        })}
      </div>
    </div>
  );
}
