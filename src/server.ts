import fastify from 'fastify'

const app = fastify()

app.get('/Api', async () => {
  return 'Hello World, Api'
})

app
  .listen({
    port: 3333,
  })
  .then(() => {
    console.log('Server Running!')
  })
