const router = require('express').Router();
const Thought = require('../../models/thoughts');
const User = require('../../models/users');
router.get('/', async (req, res) => {
    try {
        const thoughts = await Thought.find().sort({ createdAt: -1 });
        res.status(200).json(thoughts);
    } catch (err) {
        res.status(500).json(err);
    }
});

router.get('/:id', async (req, res) => {
    try {
        const thoughtId = await Thought.findById(req.params.id);
        if(!thoughtId) {
            res.status(404).json({ message: 'Thought was not found' });
            return;
        }
        res.status(200).json(thoughtId);
    } catch (err) {
        res.status(500).json(err);
    }
});

router.post("/", async (req, res) => {
    try {
      const thought = await Thought.create(req.body).then((newThought) => {
        return User.findOneAndUpdate(
          { username: req.body.username },
  
          { $push: { thoughts: { _id: newThought._id } } },
          { new: true }
        );
      });
  
      res.status(200).json({ thought });
    } catch (err) {
      res.status(500).json(err);
    }
  });

router.put('/:id', async (req, res) => {
    try {
        const thoughtUpdate = await Thought.findByIdAndUpdate(
            req.params.id,
            req.body,
            { new: true }
        )
        if (!thoughtUpdate) {
            res.status(404).json({ message: 'Thought was not found' });
            return;
        }
        res.status(200).json(thoughtUpdate);
    } catch (err) {
        res.status(500).json(err);
    }
});

router.delete('/:id', async (req, res) => {
    try {
        const thoughtDel = await Thought.findByIdAndDelete(req.params.id);
        if(!thoughtDel) {
            res.status(404).json({ message: 'Thought was not found' });
            return;
        }
        res.status(200).json({ message: 'Thought was deleted' });
    } catch (err) {
        res.status(500).json(err);
    }
});

router.post("/:thoughtId/reactions", async (req, res) => {
    try {
      const thought = await Thought.findOneAndUpdate(
        { _id: req.params.thoughtId },
  
        { $addToSet: { reactions: req.body } },
        { new: true }
      );
  
      if (!thought) {
        res.status(404).json({ message: 'Thought was not found' });
        return;
      }
  
      res.status(200).json({ thought, message: 'Reaction was created successfuly' });
    } catch (err) {
      res.status(500).json(err);
    }
  });

router.delete('/:thoughtId/reactions/:reactionId', async (req, res) => {
    try {
        const { thoughtId, reactionId } = req.params;

        const updatedThought = await Thought.findByIdAndUpdate(
            thoughtId,
            { $pull: { reactions: { _id: reactionId } } },
            { new: true }
        );
        if (!updatedThought) {
            return res.status(404).json({ message: 'Thought was not found' });
        }
        res.json({ message: 'Reaction has been deleted', updatedThought });
    } catch (err) {
        res.status(500).json(err);
    }
});

module.exports = router;