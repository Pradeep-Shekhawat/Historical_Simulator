const express = require('express');
const asyncHandler = require('../utils/asyncHandler');
const { listScenarios, getScenario } = require('../controllers/scenarioController');
const { processDecision } = require('../controllers/gameController');
const authMiddleware = require('../middleware/authMiddleware');

const router = express.Router();

router.use(authMiddleware);
router.get('/scenarios', asyncHandler(listScenarios));
router.get('/scenarios/:scenarioId', asyncHandler(getScenario));
router.post('/decision', asyncHandler(processDecision));

module.exports = router;