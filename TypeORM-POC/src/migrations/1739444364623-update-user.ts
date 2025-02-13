import { MigrationInterface, QueryRunner, TableColumn } from "typeorm";

export class UpdateUser1739444364623 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    // Rename column 'firstName' to 'name'
    await queryRunner.renameColumn("user", "firstName", "name");

    // Remove 'lastName' column
    await queryRunner.dropColumn("user", "lastName");
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    // Add 'lastName' column back
    await queryRunner.addColumn(
      "user",
      new TableColumn({
        name: "lastName",
        type: "varchar",
        isNullable: true,
      })
    );

    // Rename 'name' column back to 'firstName'
    await queryRunner.renameColumn("user", "name", "firstName");
  }
}
