import React from 'react';
import PhaseShell from './PhaseShell';

const data = {
  title: 'Product Development',
  subtitle: 'Build your Minimum Viable Product. Focus on the core features that solve the primary problem, then iterate fast based on real user feedback.',
  objectives: [
    'Define your MVP feature set (must-haves only)',
    'Design a clean and intuitive UI/UX',
    'Develop and deploy the core product',
    'Conduct alpha testing with real users',
  ],
  actions: [
    'Create wireframes and clickable prototypes in Figma',
    'Hire or onboard developers / freelancers',
    'Set up your development and staging environments',
    'Run closed alpha with 10–20 test users',
    'Document all bugs and prioritize fixes in a backlog',
  ],
};

export default function Phase5() {
  return <PhaseShell phaseIndex={4} accentColor="#00bbf9" defaultData={data} />;
}
