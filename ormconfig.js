const isDevelopment = process.env.NODE_ENV !== "production";

const entities = isDevelopment ? "src/entity/**/*.ts" : "dist/entity/**/*.js";
const migration = isDevelopment ? "src/migration/**/*.ts" : "dist/migration/**/*.js";
const subscriber = isDevelopment ? "src/subscriber/**/*.ts" : "dist/subscriber/**/*.js";

module.exports = {
  type: "mongodb",
  url: process.env.MONGODB_URI,
  synchronize: true,
  logging: false,
  entities: [
    entities,
  ],
  migrations: [
    migration,
  ],
  subscribers: [
    subscriber,
  ],
  cli: {
    entitiesDir: "src/entity",
    migrationsDir: "src/migration",
    subscribersDir: "src/subscriber"
  }
}
