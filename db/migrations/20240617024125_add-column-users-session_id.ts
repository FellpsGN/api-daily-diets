import type { Knex } from "knex";


export async function up(knex: Knex): Promise<void> {
    await knex.schema.alterTable("users", (table) => {
        table.uuid("session_id"),
        table.string("email").unique().after("nm_user")
    })
}


export async function down(knex: Knex): Promise<void> {
    await knex.schema.alterTable("users", (table) => {
        table.dropColumn("session_id")
        table.dropColumn("email")
    })
}

