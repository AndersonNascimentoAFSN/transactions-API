import { app } from './app'
import { env } from './env'

app
  .listen({
    port: env.PORT,
  })
  .then(() => {
    console.log(
      `HTTP Server Running om port ${env.PORT} in env ${env.NODE_ENV}!`,
    )
  })
