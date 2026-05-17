import React from 'react';
import PhaseShell from './PhaseShell';

const data = {
  title: 'Idea Generation',
  subtitle: 'Every great startup begins with a spark. Identify real problems, brainstorm solutions, and validate your initial concepts before investing time and money.',
  objectives: [
    'Identify a problem worth solving',
    'Brainstorm at least 10 potential solutions',
    'Conduct initial market research',
    'Define your target audience clearly',
  ],
  actions: [
    'Write down 10 startup ideas in 30 minutes',
    'Interview 5 potential customers about their pain points',
    'Create a lean canvas model for your top idea',
    'Analyze 3 direct competitors',
    'Validate your idea with a simple landing page or survey',
  ],
};

export default function Phase1() {
  return <PhaseShell phaseIndex={0} accentColor="#f8b400" defaultData={data} />;
}
