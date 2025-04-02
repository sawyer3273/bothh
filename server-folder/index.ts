import express from 'express'
import session from 'express-session'
import passport from 'passport'
import bodyParser from 'body-parser'
import routes from './routes'
import Fingerprint from 'express-fingerprint'
import  setup  from './cron';
setup();


const DEFAULT_SECRET = 'secret'

function initializeApplication() {
  const app = express()

  app.disable('x-powered-by')

  app.use(Fingerprint({
    parameters:[
      //@ts-ignore
      Fingerprint.useragent, Fingerprint.acceptHeaders, Fingerprint.geoip,
    ]
  }))
  /**
   * Set up middlewares.
   */
  app.use(express.json())
  app.use(bodyParser.json({limit: "50mb"}));
  app.use(bodyParser.urlencoded({limit: "50mb", extended: true, parameterLimit:50000}));
  app.use(
    session({
      name: 'app',
      secret: DEFAULT_SECRET,
      resave: false,
      saveUninitialized: false,
    }),
  )
  app.use(passport.initialize())
  app.use(passport.session())

  /**
   * Set app routes.
   */

  // Mount path **must** be same as path of serverMiddleware
  // https://github.com/nuxt/framework/issues/4591
  routes(app)

  return app
}

const app = initializeApplication()
console.log('server setup')
// 3 arguments handler must be wrapped by fromNodeMiddleware to pass h3 handler
// See https://github.com/nuxt/framework/releases/tag/v3.0.0-rc.12
const nodeApp = fromNodeMiddleware(app)

export default nodeApp
