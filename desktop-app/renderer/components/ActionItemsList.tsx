import React, { useEffect, useState } from 'react';

const fallbackActions = [
  'Finalize roadmap one-pager — Maya',
  'Spike on transcript indexing — Devon',
  'Deliver mind-map specs — Lina',
];

export function ActionItemsList() {
  const [actions, setActions] = useState<string[]>(fallbackActions);

  useEffect(() => {
    async function fetchActionItems() {
      try {
        const res = await fetch('http://localhost:3000/api/summary');
        const data = await res.json();
        if (data.ok && data.summaries) {
          const actionCategory = data.summaries.find(
            (s: any) => s.category === 'Action Items'
          );
          if (actionCategory && actionCategory.items) {
            setActions(actionCategory.items);
          }
        }
      } catch (err) {
        console.warn('Could not connect to summary API, using fallback data:', err);
      }
    }

    fetchActionItems();
  }, []);

  return (
    <div style={{ marginTop: 18 }}>
      <div style={{
        fontSize: 11,
        textTransform: 'uppercase',
        letterSpacing: '0.05em',
        color: 'oklch(0.72 0.16 248)',
        fontWeight: 600,
        marginBottom: 8
      }}>
        Open Action Items
      </div>
      <ul style={{
        margin: 0,
        paddingLeft: 16,
        color: 'rgba(238, 242, 255, 0.85)',
        fontSize: 13,
        lineHeight: 1.5
      }}>
        {actions.map((item, index) => (
          <li key={index} style={{ marginBottom: 6 }}>
            {item}
          </li>
        ))}
      </ul>
    </div>
  );
}
