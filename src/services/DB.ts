import { MigrationModel } from "../types/MigrationModel";

import knex from "knex";
import { Knex } from "knex";
import { SupportedDatasourceProvider } from "../utils/isSupportedDatasourceProvider";

export interface DataSourceConfig {
  provider: SupportedDatasourceProvider;
  url: string;
}

function createKnexConfig(dataSource: DataSourceConfig): Knex.Config {
  return {
    client: "pg",
    connection: dataSource.url,
  };
}

export class DB {
  private knex?: Knex;

  async connect(datasource: DataSourceConfig) {
    const knexConfig = createKnexConfig(datasource);
    this.knex = knex(knexConfig);
  }

  async disconnect() {
    await this.knex.destroy();
  }

  async isPrismaMigrationsTableExists(): Promise<boolean> {
    if (!this.knex) {
      throw new Error("Database connection is not established. Call connect() first.");
    }

    return await this.knex.schema.hasTable("_prisma_migrations");
  }

  async getMigrationByName(name: string): Promise<MigrationModel | null> {
    if (!this.knex) {
      throw new Error("Database connection is not established. Call connect() first.");
    }

    const migration = await this.knex<MigrationModel>("_prisma_migrations")
      .where({ migration_name: name })
      .first();

    return migration ?? null;
  }
}
