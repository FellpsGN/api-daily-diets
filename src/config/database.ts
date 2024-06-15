import { knex as setupKnex, Knex } from "knex"

const config: Knex.Config = {
    client: "sqlite",
    connection: {
        filename: "./db/app.db"
    }
}

export const knex = setupKnex(config)