import { Knex } from "knex"

declare module "knex/types/tables" {
    export interface Tables {
        users: {
            id_user: string,
            nm_user: string,
            email: string,
            created_at: string,
            session_id: string
        }
        diets: {
            id_diet: string,
            id_user: string,
            title: string,
            description: string,
            created_at: string,
            is_in_diet: string
        }
    }
}