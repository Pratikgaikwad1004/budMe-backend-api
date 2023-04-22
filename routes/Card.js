const express = require('express');
const router = express.Router();
const Card = require('../models/card');

router.post('/like', async (req, res) => {
  const cardId = req.body.id;

  try {
    const card = await Card.findById(cardId);

    if (!card) {
      return res.status(404).send({ error: 'Card not found' });
    }

    card.likes++;

    await card.save();

    res.send({ success: true });
  } catch (error) {
    console.error(error);
    res.status(500).send({ error: 'Server error' });
  }
});

router.post('/share', async (req, res) => {
  const cardId = req.body.id;

  try {
    const card = await Card.findById(cardId);

    if (!card) {
      return res.status(404).send({ error: 'Card not found' });
    }

    card.shares++;

    await card.save();

    res.send({ success: true });
  } catch (error) {
    console.error(error);
    res.status(500).send({ error: 'Server error' });
  }
});

router.post('/save', async (req, res) => {
  const cardId = req.body.id;

  try {
    const card = await Card.findById(cardId);

    if (!card) {
      return res.status(404).send({ error: 'Card not found' });
    }

    card.saved++;

    await card.save();

    res.send({ success: true });
  } catch (error) {
    console.error(error);
    res.status(500).send({ error: 'Server error' });
  }
});

module.exports = router;
