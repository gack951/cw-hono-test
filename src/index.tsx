import { Hono } from 'hono'
import { serveStatic } from "hono/cloudflare-workers";
import { html } from "hono/html"
import { jsx } from "hono/jsx";
import env from "../.env.json"

const app = new Hono()

app.use("*", async (c, next) => {
    const start = performance.now()
    await next()
    const end = performance.now()
    c.res.headers.set("server-timing", `total;dur=${(end - start).toFixed(2)}`)
})

const Layout = (props: { children?: any }) => html`<!DOCTYPE html>
  <html>
    <body>
      ${props.children}
    </body>
  </html>`

const Content = (props: { name: string }) => (
    <Layout>
        <h1>Hello {props.name}!</h1>
    </Layout>
)

app.get('/hello/:name', (c) => {
    const { name } = c.req.param()
    return c.html(<Content name={name} />)
})

app.get('/', (c) => c.text('Hello Hono!'))

app.use("/*", serveStatic({ root: "./" }))

export default app
