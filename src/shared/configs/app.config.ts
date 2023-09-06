export default () => ({
  port: parseInt(process.env.PORT, 10) || 3000,
  env: process.env.NODE_ENV,
  netAddress: '0.0.0.0',
  apiDocRoute: 'docs',
  i18n: {
    srcDir: 'i18n',
    fallbackLanguage: 'en',
  },
  user: {
    resetPasswordExpire: 5, // in minutes
  },
  db: {
    uri: process.env.MONGO_URI,
  },
  jwt: {
    secretKey: process.env.JWT_SECRET || 'secretKey',
    expireTime: '15m',
    refreshTokenSecretKey:
      process.env.JWT_REFRESH_TOKEN_SECRET || 'refreshTokenSecretKey',
    refreshTokenExpireTime: '1w',
  },
  throttle: {
    ttl: 60, // 15 minutes
    limit: 10, // limit each IP to 100 requests per windowMs
  },
  sentry: {
    dsn: process.env.SENTRY_DSN || '',
  },
});
