const express     = require('express');
const router      = express.Router();
const verifyToken = require('../middleware/auth');
const ctrl        = require('../controllers/taskController');

router.post   ('/tasks',     verifyToken, ctrl.createTask);
router.get    ('/tasks',     verifyToken, ctrl.getTasks);
router.get    ('/tasks/:id', verifyToken, ctrl.getTask);
router.put    ('/tasks/:id', verifyToken, ctrl.updateTask);
router.delete ('/tasks/:id', verifyToken, ctrl.deleteTask);

module.exports = router;
