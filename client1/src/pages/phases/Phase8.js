import React from 'react';
import PhaseShell from './PhaseShell';

const data = {
  title: 'Growth & Scaling',
  subtitle: 'You launched — now scale. Analyze your data, optimize every funnel, expand to new markets, and build the team that takes your startup to the next level.',
  objectives: [
    'Increase user retention and reduce churn',
    'Grow and diversify revenue streams',
    'Expand into at least one new market or channel',
    'Build a scalable team and operations structure',
  ],
  actions: [
    'Review key metrics weekly: CAC, LTV, churn, MRR',
    'Run A/B tests on your top 3 conversion bottlenecks',
    'Hire or contract for 2 key growth roles',
    'Explore strategic partnerships or distribution deals',
    'Define and document your repeatable sales playbook',
  ],
};

export default function Phase8() {
  return <PhaseShell phaseIndex={7} accentColor="#2a9d8f" defaultData={data} />;
}
