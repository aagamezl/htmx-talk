import { join } from 'path'

import express from 'express'
import { v4 as uuidv4 } from 'uuid'
import cors from 'cors'
import Handlebars from 'handlebars'

import getView from './getView.js'

const app = express()
const router = express.Router()

app.use(express.json())
app.use(express.urlencoded({ extended: true }))
app.use(express.static(join(process.cwd(), 'public')))
app.use(cors())

const PORT = process.env.PORT ?? 3001
const DATABASE_FILE = join(process.cwd(), 'data', 'todos.json')
const VIEWS_PATH = join(process.cwd(), 'views')

const database = await Bun.file(DATABASE_FILE, { type: 'application/json' })
let TODOS = await database.json()

const updateDatabase = (file, data) => {
  const writer = file.writer()
  writer.write(JSON.stringify(data, null, 2))
  writer.end()
}

const getItemsLeft = () => TODOS.filter(t => !t.completed).length

// Assuming you have Handlebars loaded in your project

// Register the 'equal' helper
Handlebars.registerHelper('equal', (a, b, options) => {
  return a === b
})

Handlebars.registerPartial('includes/todo-item', await getView(join(VIEWS_PATH, 'includes/todo-item.hbs')))

Handlebars.registerPartial('includes/item-count', await getView(join(VIEWS_PATH, 'includes/item-count.hbs')))

Handlebars.registerPartial('includes/clear-completed', await getView(join(VIEWS_PATH, 'includes/clear-completed.hbs')))

Handlebars.registerPartial('todo-list', await getView(join(VIEWS_PATH, 'includes/todo-list.hbs')))

Handlebars.registerPartial('includes/toggle-all', await getView(join(VIEWS_PATH, 'includes/toggle-all.hbs')))

// Read (GET) all todos
router.get('/', async (req, res) => {
  const index = await getView(join(VIEWS_PATH, 'index.hbs'))

  const template = Handlebars.compile(index)

  const { filter } = req.query

  let filteredTodos = []
  switch (filter) {
    case 'all':
      filteredTodos = TODOS
      break
    case 'active':
      filteredTodos = TODOS.filter(todo => !todo.completed)
      break
    case 'completed':
      filteredTodos = TODOS.filter(t => t.completed)
      break
    default:
      filteredTodos = TODOS
  }

  // console.log('itemsLeft: %o', getItemsLeft())

  res.send(template({
    todos: filteredTodos,
    itemsLeft: getItemsLeft(),
    allCompleted: getItemsLeft() === 0,
    showClearCompleted: TODOS.length > getItemsLeft()
  }))
})

// Read (GET) a specific todo by ID
router.get('/todos/:id', async (req, res) => {
  const id = req.params.id
  const todo = TODOS.find((todo) => todo.id === id)

  if (todo) {
    const template = Handlebars.compile(await getView(join(VIEWS_PATH, 'includes/edit-item.hbs')))
    const markup = template(todo)

    // console.log(markup);

    res.send(markup)
  } else {
    res.status(404).json({ error: 'Todo not found' })
  }
})

// Create (POST) a new todo
router.post('/todos', async (req, res) => {
  const { text, completed = false } = req.body

  const todo = {
    id: uuidv4(),
    text,
    completed
  }

  TODOS.push(todo)

  updateDatabase(database, TODOS)

  let template = Handlebars.compile(await getView(join(VIEWS_PATH, 'includes/todo-item.hbs')))
  let markup = template(todo)

  template = Handlebars.compile(await getView(join(VIEWS_PATH, 'includes/item-count.hbs')))
  markup += template({ itemsLeft: getItemsLeft() })

  res.send(markup)
})

// Update (PATCH) an existing todo by ID
router.patch('/todos/:id', async (req, res) => {
  const id = req.params.id
  const updatedTodo = req.body

  // console.log(updatedTodo)

  updatedTodo.completed = updatedTodo.completed === 'on'

  const index = TODOS.findIndex((t) => t.id === id)

  if (index !== -1) {
    TODOS[index] = { ...TODOS[index], ...updatedTodo }

    updateDatabase(database, TODOS)

    let template = Handlebars.compile(await getView(join(VIEWS_PATH, 'includes/todo-item.hbs')))
    let markup = template(TODOS[index])

    template = Handlebars.compile(await getView(join(VIEWS_PATH, 'includes/item-count.hbs')))
    markup += template({ itemsLeft: getItemsLeft() })

    template = Handlebars.compile(await getView(join(VIEWS_PATH, 'includes/clear-completed.hbs')))
    markup += template({ showClearCompleted: TODOS.length > getItemsLeft() })

    res.send(markup)
  } else {
    res.status(404).json({ error: 'Todo not found' })
  }
})

// Delete (DELETE) a specific todo by ID
router.delete('/todos/:id', async (req, res) => {
  const id = req.params.id
  const index = TODOS.findIndex((t) => t.id === id)

  if (index !== -1) {
    TODOS.splice(index, 1)

    updateDatabase(database, TODOS)

    const template = Handlebars.compile(await getView(join(VIEWS_PATH, 'includes/item-count.hbs')))
    const markup = template({ itemsLeft: getItemsLeft() })

    res.send(markup)
  } else {
    res.status(404).json({ error: 'Todo not found' })
  }
})

app.post('/todos/clear-completed', async (req, res) => {
  const newTodos = TODOS.filter(todo => !todo.completed)
  TODOS = [...newTodos]

  // updateDatabase(database, TODOS)

  let template = Handlebars.compile(await getView(join(VIEWS_PATH, 'includes/todo-list.hbs')))
  let markup = template({ todos: TODOS })

  const itemsLeft = getItemsLeft()

  template = Handlebars.compile(await getView(join(VIEWS_PATH, 'includes/item-count.hbs')))
  markup += template({ itemsLeft })

  template = Handlebars.compile(await getView(join(VIEWS_PATH, 'includes/clear-completed.hbs')))
  markup += template({ showClearCompleted: TODOS.length > itemsLeft })

  res.send(markup)
})

app.patch('/todos/complete-all', async (req, res) => {
  const completeAll = req.body.completeAll === 'on'

  console.log('completeAll: %o', completeAll);

  TODOS = TODOS.map(todo => {
    // todo.completed = !todo.completed
    todo.completed = todo.completed !== completeAll ? completeAll : todo.completed

    return todo
  })

  updateDatabase(database, TODOS)

  let template = Handlebars.compile(await getView(join(VIEWS_PATH, 'includes/todo-list.hbs')))
  let markup = template({ todos: TODOS })

  const itemsLeft = getItemsLeft()

  console.log('itemsLeft: %o', itemsLeft)

  template = Handlebars.compile(await getView(join(VIEWS_PATH, 'includes/item-count.hbs')))
  markup += template({ itemsLeft })

  template = Handlebars.compile(await getView(join(VIEWS_PATH, 'includes/clear-completed.hbs')))
  markup += template({ showClearCompleted: TODOS.length > itemsLeft })

  template = Handlebars.compile(await getView(join(VIEWS_PATH, 'includes/toggle-all.hbs')))
  markup += template({ allCompleted: getItemsLeft() === 0 })

  console.log({ allCompleted: getItemsLeft() === 0 })

  res.send(markup)
})

// Add the router to the app as application-level middleware
app.use(router)

app.listen(PORT, '::', () => {
  console.log(`Server is listening on port ${PORT}`)
})
