// eslint-disable-next-line
import { Knex } from 'knex'

declare module 'knex/types/tables' {
  export interface Tables {
    meals: {
      id: string
      name: string
      description: string
      dietFood: boolean
      created_at?: number
      session_id?: string
    }
  }
}
