require('dotenv').config();
const fs = require('fs');
const path = require('path');
const db = require('../config/db');

(async () => {
  const conn = await db.getConnection();
  try {
    await conn.beginTransaction();
    await conn.query('SET FOREIGN_KEY_CHECKS=0');
    await conn.query('TRUNCATE DecisionHistory');
    await conn.query('TRUNCATE GameSessions');
    await conn.query('TRUNCATE Options');
    await conn.query('TRUNCATE DecisionPoints');
    await conn.query('TRUNCATE Scenarios');
    await conn.query('SET FOREIGN_KEY_CHECKS=1');

    const dataDir = path.join(__dirname, '..', 'data');
    const files = fs.readdirSync(dataDir).filter(f => f.endsWith('.json')).sort();
    for (const file of files) {
      const data = JSON.parse(fs.readFileSync(path.join(dataDir, file), 'utf8'));
      const [{ insertId: scenarioId }] = await conn.query(
        `INSERT INTO Scenarios (title,introduction,summary_template,historical_outcome)
         VALUES (?,?,?,?)`,
        [data.title, data.introduction, data.summary.userTemplate, data.summary.historicalOutcome]
      );

      const dpMap = {};
      for (const dp of data.decisionPoints) {
        const [{ insertId: dpId }] = await conn.query(
          'INSERT INTO DecisionPoints (scenario_id,question,position) VALUES (?,?,?)',
          [scenarioId, dp.question, dp.position]
        );
        dpMap[dp.position] = dpId;
      }

      for (const dp of data.decisionPoints) {
        for (const opt of dp.options) {
          const nextId = opt.nextPosition != null ? dpMap[opt.nextPosition] : null;
          await conn.query(
            `INSERT INTO Options
               (decision_point_id,text,impact_treasury,impact_military,impact_stability,feedback,next_point_id)
             VALUES (?,?,?,?,?,?,?)`,
            [
              dpMap[dp.position],
              opt.text,
              opt.impacts.treasury,
              opt.impacts.military,
              opt.impacts.stability,
              opt.feedback,
              nextId
            ]
          );
        }
      }
    }
    await conn.commit();
    console.log('✅ All scenarios seeded.');
  } catch (err) {
    await conn.rollback();
    console.error(err);
  } finally {
    conn.release();
    process.exit(0);
  }
})();