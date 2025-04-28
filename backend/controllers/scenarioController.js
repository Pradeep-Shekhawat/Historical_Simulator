const db = require('../config/db');
const asyncHandler = require('../utils/asyncHandler');

exports.listScenarios = asyncHandler(async (req, res) => {
  const [rows] = await db.query('SELECT id, title FROM Scenarios ORDER BY id');
  res.json(rows);
});

exports.getScenario = asyncHandler(async (req, res) => {
  const userId = req.user.userId;
  const scenarioId = +req.params.scenarioId;

  // Fetch or create session
  const [[sess]] = await db.query(
    'SELECT * FROM GameSessions WHERE user_id=? AND scenario_id=?',
    [userId, scenarioId]
  );

  let session = sess;
  if (!session) {
    const [{ insertId }] = await db.query(
      `INSERT INTO GameSessions
         (user_id, scenario_id, current_point_id)
       VALUES (?, ?, (SELECT id FROM DecisionPoints WHERE scenario_id=? ORDER BY position LIMIT 1))`,
      [userId, scenarioId, scenarioId]
    );
    session = { id: insertId, treasury: 100, military: 100, stability: 100, current_point_id: null };
  }

  // Scenario metadata
  const [[meta]] = await db.query(
    'SELECT title, introduction, summary_template AS summaryTemplate, historical_outcome AS historicalOutcome FROM Scenarios WHERE id=?',
    [scenarioId]
  );

  // Decision points + options
  const [rows] = await db.query(
    `SELECT dp.id, dp.question, op.id AS opt_id, op.text,
            op.impact_treasury AS treasury, op.impact_military AS military,
            op.impact_stability AS stability, op.feedback, op.next_point_id
     FROM DecisionPoints dp
     JOIN Options op ON op.decision_point_id = dp.id
     WHERE dp.scenario_id = ?
     ORDER BY dp.position, op.id`,
    [scenarioId]
  );

  // Nest points
  const decisionPoints = [];
  const map = {};
  for (const r of rows) {
    if (!map[r.id]) {
      map[r.id] = { id: r.id, question: r.question, options: [] };
      decisionPoints.push(map[r.id]);
    }
    map[r.id].options.push({
      id: r.opt_id,
      text: r.text,
      impacts: { treasury: r.treasury, military: r.military, stability: r.stability },
      feedback: r.feedback,
      nextPointId: r.next_point_id
    });
  }

  res.json({
    sessionId: session.id,
    title: meta.title,
    introduction: meta.introduction,
    resources: {
      treasury: session.treasury,
      military: session.military,
      stability: session.stability
    },
    decisionPoints,
    summary: {
      template: meta.summaryTemplate,
      historical: meta.historicalOutcome
    }
  });
});