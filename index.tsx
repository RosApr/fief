/** @jsx h */

import path from 'path'
import fs from 'fs/promises'
import { h, useState, resetFiber } from 'fre'
import Koa from 'koa'
import { renderToString, useAction } from './render-to-string.js'



const templatePath = path.join(process.cwd(), './index.html')
const template = await fs.readFile(templatePath, 'utf-8')

function App() {
  const [posts, setPosts] = useState([])

  useAction(async () => {
    const { data } = await fetch('https://www.clicli.cc/rank?day=100').then(res => res.json())
    setPosts(data)
  })

  return (
    <div>
      {posts.map(item => (
        <li key={item.id}>{item.title}</li>
      ))}
    </div>
  )
}

const app = new Koa()

app.get('/', async (ctx) => {
  //@ts-ignore
  const content = await renderToString(<App /> as any)
  ctx.body = template.replace('<!-- fre -->', content)
})


const port = 3000
app.listen(port, () => {
  console.log(`app start on port ${port}`)
})
