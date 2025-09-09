import { render, useState, useEffect, h, options } from 'fre'
import App from './app/routes/index'
import { hydrate } from './hydrate'

options.hydrate = hydrate

render(<App/>,document.getElementById("app"))