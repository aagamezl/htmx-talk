import { join } from 'path'

import Handlebars from 'handlebars'

import getView from './getView'

// import { getAll } from './render/htmx'

const VIEWS_PATH = join(process.cwd(), 'views')
console.log(VIEWS_PATH)

// const database = await Bun.file(DATABASE_FILE, { type: 'application/json' })
// const TODOS = await database.json()

// const html = await getAll(TODOS)
// console.log(html)

const todoItem = await getView(join(VIEWS_PATH, 'includes/todo-item.hbs'))
Handlebars.registerPartial('includes/todo-item', todoItem)

const itemCount = await getView(join(VIEWS_PATH, 'includes/item-count.hbs'))
Handlebars.registerPartial('includes/item-count', itemCount)

const index = await getView(join(VIEWS_PATH, 'index.hbs'))

const template = Handlebars.compile(index)

console.log(template({ todos: [] }))
