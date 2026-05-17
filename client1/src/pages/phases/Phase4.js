import React from 'react';
import PhaseShell from './PhaseShell';

const data = {
  title: 'Funding & Resources',
  subtitle: 'Secure the capital and talent to bring your vision to life. Explore bootstrapping, angel investors, and grants to fuel your startup\'s next phase of growth.',
  objectives: [
    'Determine exact funding requirements for 12 months',
    'Identify the best funding sources for your stage',
    'Prepare compelling financial projections',
    'Secure initial capital or commitments',
  ],
  actions: [
    'Create a 10-slide pitch deck',
    'Research and apply for 3 startup grants',
    'Attend 2 networking events or investor meetups',
    'Explore crowdfunding platforms relevant to your niche',
    'Set up a financial tracking system (bookkeeping)',
  ],
};

export default function Phase4() {
  return <PhaseShell phaseIndex={3} accentColor="#9b5de5" defaultData={data} />;
}
