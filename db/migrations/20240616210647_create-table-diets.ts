import type { Knex } from "knex";


export async function up(knex: Knex): Promise<void> {
    await knex.schema.createTable("diets", (table) => {
        table.uuid("id_diet").notNullable().primary(),

        table.uuid("id_user").notNullable(),
        table.foreign("id_user").references("id_user").inTable("users"),
        
        table.string("title").notNullable(),
        table.string("description"),
        table.string("is_in_diet").notNullable(),
        table.timestamp("created_at").notNullable().defaultTo(knex.fn.now())
    })
}


export async function down(knex: Knex): Promise<void> {
    await knex.schema.dropTable("diets")
}

// title: z.string(),
//             description: z.string(),
//             sn_diet: z.enum(["S", "N"]),
//             id_user: z.string()