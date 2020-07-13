import Router from 'express';
import Stock from '../../models/Stock.js';

const router = Router();

/**
 * @route   GET api/stocks
 * @desc    Get All Stocks
 * @access  Public
 */

router.get('/', async (req, res) => {
  try {
    const stocks = await Stock.find();
    if (!stocks) throw Error('No Stocks');
    res.status(200).json(stocks);
  } catch (e) {
    res.status(400).json({ msg: e.message });
  }
});

/**
 * @route   POST api/stocks
 * @desc    Create a Stock
 * @access  Public
 */

router.post('/', async (req, res) => {
    const { name, symbol, price } = req.body;
    // Simple validation
    if (!name || !symbol || !symbol) {
        return res.status(400).json({ msg: 'Please enter all fields' });
    }

  const newStock = new Stock({
      name,
      symbol,
      price,
  });

  try {
    const stock = await newStock.save();
    if (!stock) throw Error('Something went wrong saving the item');

    res.status(200).json(stock);
  } catch (e) {
    res.status(400).json({ msg: e.message });
  }
});


/**
 * @route   DELETE api/items/:id
 * @desc    Delete A Item
 * @access  Public
 */
router.delete('/:id', async (req, res) => {
  try {
    const stock = await Stock.findById(req.params.id);
    if (!stock) throw Error('No item found');

    const removed = await stock.remove();
    if (!removed)
      throw Error('Something went wrong while trying to delete the item');

    res.status(200).json({ success: true });
  } catch (e) {
    res.status(400).json({ msg: e.message, success: false });
  }
});

export default router;