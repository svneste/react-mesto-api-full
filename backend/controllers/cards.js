const Card = require('../models/card');
const NotFoundError = require('../errors/not-found-err');
const BadRequetError = require('../errors/bad-request-err');
const Forbidden = require('../errors/forbidden-err');

const findCards = (req, res, next) => {
  Card.find({})
    .then((cards) => res.send(cards))
    .catch(next);
};

const createCard = (req, res, next) => {
  const { name, link } = req.body;

  Card.create({ name, link, owner: req.user._id })
    .then((card) => res.send({ data: card }))
    .catch((err) => {
      if (err.name === 'ValidationError') {
        next(new BadRequetError('Переданы некорректные данные при создании карточки'));
      } else {
        next(err);
      }
    });
};

const deleteCard = (req, res, next) => {
  Card.findById({ _id: req.params.cardId })
    .orFail(() => new NotFoundError('Карточка не найдена'))
    .then((card) => {
      if (!card.owner.equals(req.user._id)) {
        next(new Forbidden('Это не ваша карта'));
      } else {
        Card.deleteOne({ card })
          .then(() => res.send({ message: 'Карточка удалена' }))
          .catch(next);
      }
    })
    .catch(next);
};

const addLike = (req, res, next) => {
  Card.findByIdAndUpdate(req.params.cardId, { $addToSet: { likes: req.user._id } }, {
    new: true,
  })
    .then((card) => {
      if (!card) {
        throw new NotFoundError('Такой карточки не существует');
      } else res.send(card);
    })
    .catch((err) => {
      if (err.name === 'CastError') {
        next(new BadRequetError('Передан некорректный _id карточки'));
      } else {
        next(err);
      }
    });
};

const dislikeCard = (req, res, next) => {
  Card.findByIdAndUpdate(
    req.params.cardId,
    { $pull: { likes: req.user._id } },
    { new: true },
  )
    .then((card) => {
      if (!card) {
        throw new NotFoundError('Такой карточки не существует');
      } else res.send(card);
    })
    .catch((err) => {
      if (err.name === 'CastError') {
        next(new BadRequetError('Передан некорректный _id карточки'));
      } else {
        next(err);
      }
    });
};

module.exports = {
  findCards,
  createCard,
  deleteCard,
  addLike,
  dislikeCard,
};
