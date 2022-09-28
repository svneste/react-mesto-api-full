const router = require('express').Router();
const {
  findCards,
  createCard,
  deleteCard,
  addLike,
  dislikeCard,
} = require('../controllers/cards');
const {
  validationCreateCard,
  validationCardId,
} = require('../middlewares/validations');

router.get('/', findCards);
router.post('/', validationCreateCard, createCard);
router.delete('/:cardId', validationCardId, deleteCard);
router.put('/:cardId/likes', validationCardId, addLike);
router.delete('/:cardId/likes', validationCardId, dislikeCard);

module.exports = router;
