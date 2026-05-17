import React from 'react';
import PhaseShell from './PhaseShell';

const data = {
  title: 'Market Research',
  subtitle: 'Analyze the market landscape, understand your competitors, and uncover what your customers truly need so you can position your startup for success.',
  objectives: [
    'Analyze market trends and total addressable size',
    'Identify direct and indirect competitors',
    'Understand core customer pain points',
    'Validate product-market fit hypothesis',
  ],
  actions: [
    'Build a competitor analysis matrix (at least 5 competitors)',
    'Survey 20+ potential customers online',
    'Read 3 recent industry reports in your space',
    'Define your ideal buyer persona in detail',
    'Map the customer journey from awareness to purchase',
  ],
};

export default function Phase3() {
  return <PhaseShell phaseIndex={2} accentColor="#6bc1ff" defaultData={data} />;
}
