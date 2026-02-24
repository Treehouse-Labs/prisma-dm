export type MigrationModel = {
  applied_steps_count: number;
  migration_name: string;
  finished_at: Date | null;
  rolled_back_at: Date | null;
};
