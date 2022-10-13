const router = require('express').Router();
const {
  findUser,
  getUser,
  refreshProfile,
  refreshAvatar,
  getUserInfo,
} = require('../controllers/users');
const {
  validationUpdateUser,
  validationUpdateAvatar,
  validationUserId,
} = require('../middlewares/validations');

router.get('/', findUser);
router.get('/me', getUserInfo);
router.get('/:userId', validationUserId, getUser);
router.patch('/me', validationUpdateUser, refreshProfile);
router.patch('/me/avatar', validationUpdateAvatar, refreshAvatar);

module.exports = router;
