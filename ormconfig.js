module.exports = {
  type: "mongodb",
  url: process.env.MONGODB_URI,
  synchronize: true,
  logging: false,
  entities: [
    "dist/entity/**/*.js",
  ],
  migrations: [
    "dist/migration/**/*.js",
  ],
  subscribers: [
    "dist/subscriber/**/*.js",
  ],
  cli: {
    entitiesDir: "src/entity",
    migrationsDir: "src/migration",
    subscribersDir: "src/subscriber"
  }
}
