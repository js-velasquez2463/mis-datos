const dotenv = require('dotenv')
const result = dotenv.config({ path: `./configuration/envs/${process.env.NODE_ENV}.env` })

if (result.error) {
  throw result.error
}
console.log('RUNNING ON -> ', process.env.NODE_ENV)
