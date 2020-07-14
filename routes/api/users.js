import Router from 'express';
// User Model
import mongoose from 'mongoose';
import auth from '../../middleware/auth.js';
import User from '../../models/User.js';
import { Stock } from '../../models/Stock.js';


const router = Router();

/**
 * @route   GET api/users
 * @desc    Get all users
 * @access  Private
 */

router.get('/', async (req, res) => {
  try {
    const users = await User.find().select('-password');
    if (!users) throw Error('No users exist');
    res.json(users);
  } catch (e) {
    res.status(400).json({ msg: e.message });
  }
});

router.get('/me', auth, async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select('-password');
    if (!user) throw Error('User Does not exist');
    res.json(user);
  } catch (e) {
    res.status(400).json({ msg: e.message });
  }
});


router.get('/my-stocks', auth, async (req, res) => {
  try {
    var user = await User.findById(req.user.id);
    var ids = [];
    for (var i = 0; i < user.portfolio.length; i++) {
      ids.push(mongoose.Types.ObjectId(user.portfolio[i]))
    }
    var stocks = await Stock.find({'_id': { $in: ids}});
    if (!stocks) throw Error('No users exist');
    res.json(stocks);
  } catch (e) {
    res.status(400).json({ msg: e.message });
  }
});


router.get('/add-stock', auth, async (req, res) => {
  try {
    console.log("add-stock")
    console.log(req.query.id)
    var user = await User.findById(req.user.id);
    const stock = await Stock.findById(req.query.id);
    if (user.portfolio.includes(req.query.id))
      res.sendStatus(200);
    else {
      user.portfolio.push(req.query.id);
      user.save(function (err) {
        if (err) 
          res.status(400).json({ msg: err.message })
        else
          res.sendStatus(200);
      });
    }
  } catch (e) {
    res.status(400).json({ msg: e.message });
  }
});

router.get('/remove-stock', auth, async (req, res) => {
  try {
    console.log("remove-stock")
    console.log(req.query.id)
    var user = await User.findById(req.user.id);
    const index = user.portfolio.indexOf(req.query.id);
    if (index > -1) {
      user.portfolio.splice(index, 1);
      user.save(function (err) {
        if (err) 
          res.status(400).json({ msg: err.message })
        else
          res.sendStatus(200);
      });
    } else {
      res.sendStatus(200);
    }
  } catch (e) {
    res.status(400).json({ msg: e.message });
  }
});


export default router;