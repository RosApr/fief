import { useLoaderData } from "../../lib/ctx.tsx"
import { h } from 'fre'

export async function loader() {
  const res = await fetch("http://localhost:8000/api/meta")
  const data = await res.json()
  return data
}

export default function () {

  const data = useLoaderData()
  console.log(data)
  return (
    <div>
      <h1>Hello {data.hello}</h1>
      <img src="/static/example.jpg" style={{width:'400px'}}/>
    </div>
  )
}
