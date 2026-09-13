import React from 'react';
import { ResponsiveContainer, BarChart, Bar, XAxis, YAxis, Tooltip, Legend } from 'recharts';
import { formatMoney } from '../utils/formatters.js';

export function PartnerTaxBarChart({ calculatedData }) {
  const p1 = calculatedData?.baseline?.p1;
  const p2 = calculatedData?.baseline?.p2;

  if (!p1 || !p2) return null;

  const data = [
    {
      name: p1.name || 'Partner 1',
      'Spendable Take-Home': Math.round(p1.spendableIncomeMonthly || 0),
      'ATO Tax & Medicare': Math.round(p1.totalTaxMonthly || 0),
      'Super Guarantee': Math.round(p1.superMonthly || 0)
    },
    {
      name: p2.name || 'Partner 2',
      'Spendable Take-Home': Math.round(p2.spendableIncomeMonthly || 0),
      'ATO Tax & Medicare': Math.round(p2.totalTaxMonthly || 0),
      'Super Guarantee': Math.round(p2.superMonthly || 0)
    }
  ];

  const CustomTooltip = ({ active, payload, label }) => {
    if (active && payload && payload.length) {
      return (
        <div className="custom-chart-tooltip">
          <div className="tooltip-cat-title">{label} Monthly Distribution</div>
          {payload.map((entry, idx) => (
            <div key={idx} className="tooltip-row" style={{ color: entry.color }}>
              <span>{entry.name}:</span>
              <strong>{formatMoney(entry.value)} /mo</strong>
            </div>
          ))}
        </div>
      );
    }
    return null;
  };

  return (
    <div className="partner-bar-chart-card" aria-label="Partner Income & Tax Distribution Comparison">
      <h3 className="chart-card-title">🤝 Partner Income & Tax Distribution Comparison</h3>
      <div style={{ width: '100%', height: 260 }}>
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={data} margin={{ top: 15, right: 15, left: -10, bottom: 5 }}>
            <XAxis dataKey="name" stroke="#8e958e" fontSize={12} tickLine={false} />
            <YAxis stroke="#8e958e" fontSize={11} tickFormatter={(v) => `$${v}`} tickLine={false} />
            <Tooltip content={<CustomTooltip />} />
            <Legend wrapperStyle={{ fontSize: '11.5px', paddingTop: '10px' }} />
            <Bar dataKey="Spendable Take-Home" stackId="a" fill="#7fe3cf" radius={[0, 0, 0, 0]} />
            <Bar dataKey="ATO Tax & Medicare" stackId="a" fill="#f43f5e" radius={[0, 0, 0, 0]} />
            <Bar dataKey="Super Guarantee" stackId="a" fill="#3dbfa8" radius={[4, 4, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
