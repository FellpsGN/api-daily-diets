import { checkSessionIdExists } from "../middlewares/check-session-id-exists"
import { FastifyInstance } from "fastify"
import { randomUUID } from "node:crypto"
import { knex } from "../config/database"
import { z } from "zod"

export async function dailyDiet(app: FastifyInstance) {
    app.get("/", {preHandler: checkSessionIdExists}, async (request, reply) => {
        const { sessionId } = request.cookies
        const diets = await knex("diets")
            .select("diets.*")
            .innerJoin("users", "users.id_user", "diets.id_user")
            .where("users.session_id", sessionId)
        return { diets }
    })


    app.get("/:id", {preHandler: checkSessionIdExists}, async (request) => {
        const { sessionId } = request.cookies
        const getDietParamSchema = z.object({
            id: z.string().uuid()
        })

        const { id } = getDietParamSchema.parse(request.params)
        const diet = await knex("diets")
            .select("diets.*")
            .innerJoin("users", "users.id_user", "diets.id_user")
            .where({id_diet: id, session_id: sessionId})
            .first()

        return { diet }
    })


    app.get("/summary/total", {preHandler: checkSessionIdExists}, async (request) => {
        const { sessionId } = request.cookies
        const totalDiets = await knex("diets")
            .count("id_diet", { as: "quantidade"})
            .innerJoin("users", "users.id_user", "diets.id_user")
            .where("users.session_id", sessionId)
        return { totalDiets }
    })


    app.get("/summary/group", {preHandler: checkSessionIdExists}, async (request) => {
        const { sessionId } = request.cookies
        const notRealizedDiets = await knex("diets")
            .count("id_diet", { as: "quantidade" })
            .innerJoin("users", "users.id_user", "diets.id_user")
            .where({is_in_diet: "N", session_id: sessionId})
        
        const realizedDiets = await knex("diets")
            .count("id_diet", { as: "quantidade" })
            .innerJoin("users", "users.id_user", "diets.id_user")
            .where({is_in_diet: "S", session_id: sessionId})

        return {notRealizedDiets, realizedDiets}
    })


    app.post("/", async (request, reply) => {
        const createDailyDietSchema = z.object({
            id_user: z.string(),
            title: z.string(),
            description: z.string(),
            is_in_diet: z.enum(["S", "N"])
        })

        const { 
            id_user, 
            title, 
            description, 
            is_in_diet 
        } = createDailyDietSchema.parse(request.body)

        await knex("diets").insert({
            id_diet: randomUUID(),
            id_user,
            title,
            description,
            is_in_diet
        })

        return reply.status(201).send()
    })


    app.patch("/update", {preHandler: checkSessionIdExists}, async (request, reply) => {

        const updateDietSchema = z.object({
            id_diet: z.string(),
            id_user: z.string(),
            title: z.string(),
            description: z.string(),
            is_in_diet: z.enum(["S", "N"])
        })

        const { id_diet, id_user, title, description, is_in_diet } = updateDietSchema.parse(request.body)

        try {

            await knex("diets")
                .where({id_diet, id_user})
                .update({
                    title: title,
                    description: description,
                    is_in_diet: is_in_diet
                })

            return reply.status(201).send()

        } catch (error) {
            console.error('Error to execute update:', error);
            return reply.status(500).send({ message: 'Error to update diet' });
        }
    })


    app.delete("/:id_diet/:id_user", {preHandler: checkSessionIdExists}, async (request, reply) => {
        const deleteDietSchema = z.object({
            id_diet: z.string().uuid(),
            id_user: z.string().uuid()
        })

        const { id_diet, id_user } = deleteDietSchema.parse(request.params)
        
        await knex("diets").where({id_diet, id_user}).del()
        return reply.status(201).send()
    })
}