import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import API from '../api';
import { motion } from 'framer-motion';
import LoadingSpinner from './LoadingSpinner';

export default function ScenarioList() {
  const [list, setList]       = useState([]);
  const [loading, setLoading] = useState(true);
  const nav                   = useNavigate();

  useEffect(() => {
    API.get('/game/scenarios')
      .then(r => setList(r.data))
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <LoadingSpinner />;
  if (!list.length) return <p>No scenarios available.</p>;

  return (
    <div className="dashboard scenario-list">
      <h2>Select a Scenario</h2>
      <ul>
        {list.map(s => (
          <motion.li
            key={s.id}
            className="scenario-card"
            whileHover={{ scale: 1.03 }}
            whileTap={{ scale: 0.97 }}
            onClick={() => nav(`/game/${s.id}`)}
          >
            <h3>{s.title}</h3>
          </motion.li>
        ))}
      </ul>
    </div>
  );
}