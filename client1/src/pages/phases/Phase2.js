import React from 'react';
import PhaseShell from './PhaseShell';

const data = {
  title: 'Business Planning',
  subtitle: 'Turn your idea into a structured plan. Define your business model, revenue streams, and operational strategy to build a rock-solid foundation.',
  objectives: [
    'Develop a comprehensive business plan',
    'Define your unique value proposition',
    'Structure your revenue model',
    'Plan your initial 6-month budget',
  ],
  actions: [
    'Draft your mission and vision statements',
    'Complete a full SWOT analysis',
    'Register your business name and legal structure',
    'Set up a dedicated business bank account',
    'Build a 12-month financial projection spreadsheet',
  ],
};

export default function Phase2() {
  return <PhaseShell phaseIndex={1} accentColor="#ff6b6b" defaultData={data} />;
}
