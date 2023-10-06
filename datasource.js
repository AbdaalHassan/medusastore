const { DataSource } = require("typeorm");
import { Product } from "./src/models/product";
const AppDataSource = new DataSource({
  type: "postgres",
  port: 5432,
  username: "postgres",
  password: "123",
  database: "medusa-PdqT",
  migrations: ["src/migrations/*{.ts,.js}"],
  entities: [
    "node_modules/@medusajs/medusa/dist/models/*.js",
    Product
    // "dist/models/*.js",
    // "src/models/*.ts",
  ],
 
});

module.exports = {
  datasource: AppDataSource,
};
