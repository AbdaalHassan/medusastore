import { DataSource } from "typeorm";
export const connectionSource = new DataSource({
   migrationsTableName: 'migrations',
   type: 'postgres',
   host: 'localhost',
   port: 5432,
   username: 'postgres',
   password: '123',
   database: 'medusa-PdqT',
   logging: true,
   // synchronize: true,
   // name: 'default',
   entities: ["node_modules/@medusajs/medusa/dist/models/*.js",
      'src/models/*.ts'],
   migrations: ['src/migrations/*{.ts,.js}']
});