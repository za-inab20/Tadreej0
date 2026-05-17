import React from 'react';
import PhaseShell from './PhaseShell';

const data = {
  title: 'Launch Preparation',
  subtitle: 'Get everything ready for launch day. A smooth launch requires technical readiness, PR groundwork, and a clear go-live checklist.',
  objectives: [
    'Finalize and freeze the product for public release',
    'Prepare customer support channels and FAQs',
    'Plan and schedule the launch event or announcement',
    'Generate pre-launch buzz and a waitlist',
  ],
  actions: [
    'Complete final beta testing and resolve all critical bugs',
    'Write and distribute a press release to relevant outlets',
    'Build a launch-day checklist (servers, payments, support)',
    'Set up analytics tracking (Google Analytics / Mixpanel)',
    'Schedule social media posts and email blast for launch day',
  ],
};

export default function Phase7() {
  return <PhaseShell phaseIndex={6} accentColor="#f4a261" defaultData={data} />;
}
