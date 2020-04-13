const express = require('express');

const db = require('../data/dbConfig');

const router = express.Router();

router.use('/:id', validateAccountId);

router.get('/', async (req, res) => {
  try {
    const accounts = await db.select().table('accounts');
    if (accounts) {
      res.status(200).json(accounts);
    } else {
      res.status(404).json({ message: 'There are no accounts.' });
    }
  } catch {
    res.status(500).json({ error: 'There was a problem getting the accounts.' });
  }
});

router.get('/:id', async (req, res) => {
  res.status(200).json(req.account);
});

router.post('/', validateAccount, async (req, res) => {
  try {
    await db('accounts').insert(req.body, 'id');
    const account = await db('accounts').where('name', req.body.name);
    res.status(201).json(account);
  } catch {
    res.status(500).json({ error: 'There was a problem adding the account.' });
  }
});

router.put('/:id', validateAccount, async (req, res) => {
  try {
    await db('accounts').where('id', req.params.id).update(req.body);
    const account = await db('accounts').where('id', req.params.id);
    res.status(201).json(account);
  } catch {
    res.status(500).json({ error: 'There was a problem updating the account.' });
  }
});

router.delete('/:id', async (req, res) => {
  try {
    const account = await db('accounts').where('id', req.params.id);
    await db('accounts').where('id', req.params.id).del();
    res.status(200).json(account);
  } catch {
    res.status(500).json({ error: 'There was a problem deleting the account.' });
  }
});

//Middlewares

async function validateAccountId(req, res, next) {
  try {
    const account = await db('accounts').where('id', req.params.id);
    if (account) {
      req.account = account;
      next();
    } else {
      res.status(404).json({ message: 'There is no account with that ID.' });
    }
  } catch {
    res.status(500).json({ error: 'There was a problem getting the account.' });
  }
}

async function validateAccount(req, res, next) {
  const body = req.body;
  if (!Object.keys(body).length) {
    res.status(400).json({ message: 'Missing account data.' });
  } else if (!body.name) {
    res.status(400).json({ message: 'Missing account name.' });
  } else if (!body.budget) {
    res.status(400).json({ message: 'Missing account budget.' });
  } else {
    next();
  }
}

module.exports = router;
