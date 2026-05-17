import React from 'react';
import PhaseShell from './PhaseShell';

const data = {
  title: 'Marketing Strategy',
  subtitle: 'Build your brand and reach your audience. Develop a content strategy, grow your community, and acquire your first paying customers before launch.',
  objectives: [
    'Build initial brand awareness across key channels',
    'Define your primary and secondary marketing channels',
    'Create a repeatable content strategy',
    'Acquire your first 100 early adopters',
  ],
  actions: [
    'Set up all relevant social media profiles with consistent branding',
    'Build a 4-week content calendar and start posting',
    'Launch an email waitlist or newsletter campaign',
    'Optimize your landing page for SEO (title, meta, speed)',
    'Run a small paid ad test ($50–100) to learn about your audience',
  ],
};

export default function Phase6() {
  return <PhaseShell phaseIndex={5} accentColor="#ff5e78" defaultData={data} />;
}
