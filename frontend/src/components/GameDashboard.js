import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import API from '../api';
import { motion } from 'framer-motion';

import ResourcePanel from './ResourcePanel';
import DecisionModal from './DecisionModal';
import Timeline from './Timeline';
import AchievementBadge from './AchievementBadge';
import LoadingSpinner from './LoadingSpinner';

export default function GameDashboard() {
  const { scenarioId } = useParams();
  const nav = useNavigate();

  // State
  const [sessionId, setSessionId] = useState(null);
  const [points, setPoints] = useState([]);
  const [idx, setIdx] = useState(0);
  const [res, setRes] = useState({ treasury: 0, military: 0, stability: 0 });
  const [fb, setFb] = useState('');
  const [choices, setChoices] = useState([]);
  const [summaryTpl, setTpl] = useState('');
  const [historical, setHist] = useState('');
  const [badges, setBadges] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Load scenario on mount
  useEffect(() => {
    API.get(`/game/scenarios/${scenarioId}`)
      .then(({ data }) => {
        setSessionId(data.sessionId);
        setRes(data.resources);
        setPoints(data.decisionPoints);
        setTpl(data.summary.template);
        setHist(data.summary.historical);
        // start with a badge for beginning
        setBadges([{ label: 'Strategy Novice', icon: '🗡️' }]);
      })
      .catch(err => {
        console.error('Failed to load scenario:', err);
        setError('Could not load scenario. Please try again later.');
      })
      .finally(() => setLoading(false));
  }, [scenarioId]);

  const decide = opt => {
    API.post('/game/decision', { sessionId, selectedOptionId: opt.id })
      .then(({ data }) => {
        setRes(data.resources);
        setFb(data.feedback);
        setChoices(prev => [...prev, { text: opt.text, impacts: opt.impacts }]);

        // AWARD BADGES based on new resources
        setBadges(prev => {
          const next = [...prev];
          const { treasury, military, stability } = data.resources;
          if (treasury >= 120 && !next.find(b => b.label === 'Wealthy')) {
            next.push({ label: 'Wealthy', icon: '💰' });
          }
          if (military >= 120 && !next.find(b => b.label === 'War Hero')) {
            next.push({ label: 'War Hero', icon: '🛡️' });
          }
          if (stability >= 120 && !next.find(b => b.label === 'Peacemaker')) {
            next.push({ label: 'Peacemaker', icon: '☮️' });
          }
          return next;
        });

        const nextIndex = points.findIndex(p => p.id === data.nextPointId);
        setTimeout(() => {
          setFb('');
          setIdx(nextIndex >= 0 ? nextIndex : points.length);
        }, 1500);
      })
      .catch(err => {
        console.error('Decision failed:', err);
        setError('Failed to process decision. Please try again.');
      });
  };

  if (loading) return <LoadingSpinner />;

  if (error) {
    return (
      <div className="dashboard">
        <h2>Error</h2>
        <p>{error}</p>
        <button onClick={() => window.location.reload()}>Reload</button>
      </div>
    );
  }

  const currentPoint = points[idx];
  const finished = !currentPoint;

  // Build summary text
  const decisionSummary = choices.map((c, i) => `${i + 1}. ${c.text}`).join(' ');
  const userOutcome = summaryTpl
    ? summaryTpl.replace('{decisionSummary}', decisionSummary)
    : decisionSummary;

  // Example timeline events
  const timelineEvents = [
    { date: 'Year 1', title: 'Prologue', description: 'Your journey begins…' },
    { date: 'Year 2', title: 'Turning Point', description: 'A critical choice is made.' },
    { date: 'Year 3', title: 'Resolution', description: 'History unfolds.' }
  ];

  return (
    <motion.div
      className="dashboard"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
    >
      <ResourcePanel resources={res} />

      {!finished ? (
        <>
          <motion.h2
            className="decision-question"
            initial={{ y: -20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.4 }}
          >
            {currentPoint.question}
          </motion.h2>
          <DecisionModal options={currentPoint.options} onSelect={decide} />
        </>
      ) : (
        <div className="summary-screen">
          <motion.h2
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ stiffness: 200 }}
          >
            🏁 Scenario Complete
          </motion.h2>

          <div className="summary-choices">
            {choices.map((c, i) => (
              <motion.div
                className="summary-choice"
                key={i}
                initial={{ x: -50, opacity: 0 }}
                animate={{ x: 0, opacity: 1 }}
                transition={{ delay: i * 0.1 }}
              >
                <h4>Choice {i + 1}</h4>
                <p>{c.text}</p>
                <div className="summary-choice-impact">
                  <span className={c.impacts.treasury >= 0 ? 'positive' : 'negative'}>
                    💰{c.impacts.treasury >= 0 ? '+' : ''}{c.impacts.treasury}
                  </span>
                  <span className={c.impacts.military >= 0 ? 'positive' : 'negative'}>
                    🛡️{c.impacts.military >= 0 ? '+' : ''}{c.impacts.military}
                  </span>
                  <span className={c.impacts.stability >= 0 ? 'positive' : 'negative'}>
                    ⚖️{c.impacts.stability >= 0 ? '+' : ''}{c.impacts.stability}
                  </span>
                </div>
              </motion.div>
            ))}
          </div>

          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.5 }}>
            <h3>Your Outcome</h3>
            <p>{userOutcome}</p>

            <h3>Historical Outcome</h3>
            <p>{historical}</p>

            <div className="summary-resources">
              {['treasury', 'military', 'stability'].map(key => (
                <div className="summary-resource-item" key={key}>
                  <h4>{key.charAt(0).toUpperCase() + key.slice(1)}</h4>
                  <p>{res[key]}</p>
                </div>
              ))}
            </div>
          </motion.div>

          <Timeline events={timelineEvents} />

          <div className="summary-buttons">
            <button className="summary-button-primary" onClick={() => window.location.reload()}>
              Retry
            </button>
            <button className="summary-button-secondary" onClick={() => nav('/scenarios')}>
              Back to Scenarios
            </button>
          </div>
        </div>
      )}

      {fb && <div className="feedback-box">{fb}</div>}

      {/* Badges */}
      <div className="badges-container">
        {badges.map((b, i) => (
          <AchievementBadge key={i} label={b.label} icon={b.icon} />
        ))}
      </div>
    </motion.div>
  );
}