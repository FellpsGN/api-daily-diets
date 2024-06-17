import fastify from "fastify"
import cookie from "@fastify/cookie"
import { users } from "./routes/users"
import { dailyDiet } from "./routes/diets"

export const app = fastify()

app.register(cookie)
app.register(users, {prefix: "daily"})
app.register(dailyDiet, {prefix: "diet"})