const router = require('express').Router();
const User = require('../../models/users');

router.get('/', async (req, res) => {
    try {
        const users = await User.find();
        res.json(users);
    } catch (err) {
        res.status(500).json(err);
    }
});

router.get('/:id', async (req, res) => {
    try {
        const user = await User.findById(req.params.id);
        if(!user) {
            return res.status(404).json({ message: 'User was not found' });
        }
        res.json(user);
    } catch (err) {
        res.status(500).json(err);
    }
})

router.post('/', async (req, res) => {
    try{
        const user = new User(req.body);
        const savedUser = await user.save();
        res.json(savedUser);
    } catch (err) {
        res.status(500).json(err);
    }
});

router.put('/:id', async (req, res) => {
    try {
        const updatedUser = await User.findByIdAndUpdate(req.params.id, req.body, {
            new: true,
            runValidators: true,
        });
        if (!updatedUser) {
            return res.status(404).json({ message: 'User was not found' });
        }
        res.json(updatedUser);
    } catch (err) {
        res.status(500).json(err);
    }
});

router.delete('/:id', async (req, res) => {
    try {
        const deletedUser = await User.findByIdAndDelete(req.params.id);
        if(!deletedUser) {
            return res.status(404).json({ message: 'User was not found'} );
        }
        res.json({ message: 'User has been deleted' });
    } catch (err) {
        res.status(500).json(err);
    }
});

router.post('/:userId/friends', async (req, res) => {
    try {
      const user = await User.findById(req.params.userId);
      if (!user) {
        return res.status(404).json({ message: 'User not found' });
      }
  
      const friend = await User.findOne({ username: req.body.username });
      if (!friend) {
        return res.status(404).json({ message: 'Friend not found' });
      }
  
      if (user.friends.includes(friend._id)) {
        return res.status(400).json({ message: 'Friend already added' });
      }
  
      user.friends.push(friend._id);
      const savedUser = await user.save();
  
      res.json(savedUser);
    } catch (err) {
      res.status(500).json(err);
    }
  });

router.delete('/:userId/friends/:friendId', async (req, res) => {
    try {
        const { userId, friendId } = req.params;

        const updatedUser = await User.findByIdAndUpdate(
            userId,
            { $pull: { friends: friendId } },
            { new: true }
        );
        if (!updatedUser) {
            return res.status(404).json({ message: 'User was not found' });
        }
        res.json({ message: 'Friend has been deleted', updatedUser });
    } catch (err) {
        res.status(500).json(err);
    }
});


module.exports = router;