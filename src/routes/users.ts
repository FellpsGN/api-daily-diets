import { app } from "../app"
import { FastifyInstance } from "fastify"
import { knex } from "../config/database"


export async function users(app: FastifyInstance) {
    app.get("/", async () => {
        const test = await knex("sqlite_schema").select("*")

        return {"tables": test}
    })
}