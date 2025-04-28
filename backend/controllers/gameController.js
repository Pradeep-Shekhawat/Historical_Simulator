const db = require('../config/db');
const asyncHandler = require('../utils/asyncHandler');

exports.processDecision = asyncHandler(async (req, res) => {
  const { sessionId, selectedOptionId } = req.body;
  const [[opt]] = await db.query(
    'SELECT impact_treasury AS treasury, impact_military AS military, impact_stability AS stability, feedback, next_point_id FROM Options WHERE id=?',
    [selectedOptionId]
  );
  const [[sess]] = await db.query('SELECT * FROM GameSessions WHERE id=?', [sessionId]);

  const newT = sess.treasury + opt.treasury;
  const newM = sess.military + opt.military;
  const newS = sess.stability + opt.stability;

  await db.query(
    `INSERT INTO DecisionHistory
       (session_id, decision_point_id, option_id, treasury_after, military_after, stability_after)
     VALUES (?, ?, ?, ?, ?, ?)`,
    [sessionId, sess.current_point_id, selectedOptionId, newT, newM, newS]
  );

  await db.query(
    `UPDATE GameSessions SET current_point_id=?, treasury=?, military=?, stability=? WHERE id=?`,
    [opt.next_point_id || sess.current_point_id, newT, newM, newS, sessionId]
  );

  res.json({
    feedback: opt.feedback,
    resources: { treasury: newT, military: newM, stability: newS },
    nextPointId: opt.next_point_id
  });
});