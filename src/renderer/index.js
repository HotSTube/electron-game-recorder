
import AppWindow from './components/AppWindow'
import React from 'react'
import ReactDOM from 'react-dom'

const app = document.createElement('div')

app.appendChild(document.createTextNode('Hello!'))

document.body.append(app)

ReactDOM.render(<AppWindow />, app)