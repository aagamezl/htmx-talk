import React from 'react'
import ReactDOM from 'react-dom/client'
import Todos from './components/Todos.jsx'

import dataService from './services/dataService'

import 'todomvc-app-css/index.css'
import './index.css'

const TASKS = await dataService.getAll()

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <Todos tasks={TASKS} />
  </React.StrictMode>,
)
