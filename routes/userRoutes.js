let express = require('express');
let userController = require('../controllers/userController');

let router = express.Router();
router.use(express.json());

router.post('/signup', userController.signupUser);

router.post('/login', userController.loginUser);


module.exports = router;