import * as express from 'express'
import * as cors from 'cors'

const app = express()
const port = process.env.NODE_PORT || 3003

app.use(cors())

app.get('/hello', (_req, res) => {
  res.send({ message: 'Holii' })
})

app.listen(port, () => {
  console.log(`Listening on port ${port}`)
})
