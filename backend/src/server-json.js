import { join } from 'path'

import express from 'express'
import { v4 as uuidv4 } from 'uuid'
import cors from 'cors'

const app = express()
const router = express.Router()

app.use(express.json())
app.use(cors())

const PORT = process.env.PORT ?? 3000
const DATABASE_FILE = join(process.cwd(), 'data', 'todos.json')

const database = await Bun.file(DATABASE_FILE, { type: 'application/json' })
const TODOS = await database.json()

const updateDatabase = (file, data) => {
  const writer = file.writer()
  writer.write(JSON.stringify(data, null, 2))
  writer.end()
}

// Create (POST) a new todo
router.post('/todos', (req, res) => {
  const { text, completed = false } = req.body

  const newTodo = {
    id: uuidv4(),
    text,
    completed
  }

  TODOS.push(newTodo)

  updateDatabase(database, TODOS)

  res.status(201).json(newTodo)
})

// Read (GET) all todos
router.get('/todos', (req, res) => {
  res.json(TODOS)
})

// Read (GET) a specific todo by ID
router.get('/todos/:id', (req, res) => {
  const id = req.params.id
  const todo = TODOS.find((t) => t.id === id)
  if (todo) {
    res.json(todo)
  } else {
    res.status(404).json({ error: 'Todo not found' })
  }
})

// Update (PUT) an existing todo by ID
router.put('/todos/:id', (req, res) => {
  const id = req.params.id
  const updatedTodo = req.body
  const index = TODOS.findIndex((t) => t.id === id)

  if (index !== -1) {
    TODOS[index] = { ...TODOS[index], ...updatedTodo }

    updateDatabase(database, TODOS)

    res.json(TODOS[index])
  } else {
    res.status(404).json({ error: 'Todo not found' })
  }
})

// Delete (DELETE) a specific todo by ID
router.delete('/todos/:id', (req, res) => {
  const id = req.params.id
  const index = TODOS.findIndex((t) => t.id === id)

  if (index !== -1) {
    const deletedTodo = TODOS.splice(index, 1)

    updateDatabase(database, TODOS)

    res.json(deletedTodo[0])
  } else {
    res.status(404).json({ error: 'Todo not found' })
  }
})

// Add the router to the app as application-level middleware
app.use(router)

app.listen(PORT, '::', () => {
  console.log(`Server is listening on port ${PORT}`)
})
