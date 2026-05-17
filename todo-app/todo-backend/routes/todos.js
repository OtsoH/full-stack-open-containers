const express = require('express');
const { Todo } = require('../mongo')
const redis = require('../redis')
const router = express.Router();

/* GET todos listing. */
router.get('/', async (_, res) => {
  const todos = await Todo.find({})
  res.send(todos);
});

/* GET statistics. */
router.get('/statistics', async (_, res) => {
  const added_todos = await redis.get('added_todos')
  res.send({ added_todos: Number(added_todos) || 0 });
});

/* POST todo to listing. */
router.post('/', async (req, res) => {
  const todo = await Todo.create({
    text: req.body.text,
    done: false
  })

  const current = await redis.get('added_todos')
  await redis.set('added_todos', Number(current || 0) + 1)

  res.send(todo);
});

const singleRouter = express.Router();

const findByIdMiddleware = async (req, res, next) => {
  const { id } = req.params
  req.todo = await Todo.findById(id)
  if (!req.todo) return res.sendStatus(404)

  next()
}

/* DELETE todo. */
singleRouter.delete('/', async (req, res) => {
  await req.todo.deleteOne()
  res.sendStatus(200);
});

/* GET todo. */
singleRouter.get('/', async (req, res) => {
  res.send(req.todo);
});

/* PUT todo. */
singleRouter.put('/', async (req, res) => {
  const { text, done } = req.body;
  const updated = await Todo.findByIdAndUpdate(
    req.todo._id,
    { text, done },
    { new: true, runValidators: true }
  );
  res.send(updated);
});

router.use('/:id', findByIdMiddleware, singleRouter)


module.exports = router;
