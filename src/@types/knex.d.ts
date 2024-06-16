import { Knex } from "knex"

declare module "knex/types/tables" {
    export interface Tables {
        users: {
            id_user: string,
            nm_user: string,
            created_at: string
        }
        diets: {
            id_diet: string,
            title: string,
            description: string,
            created_at: string,
            sn_diet: string
        }
    }
}