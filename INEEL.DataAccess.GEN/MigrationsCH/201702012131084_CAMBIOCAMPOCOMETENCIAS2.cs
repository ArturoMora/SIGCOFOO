namespace INEEL.DataAccess.GEN.MigrationsCH
{
    using System;
    using System.Data.Entity.Migrations;
    
    public partial class CAMBIOCAMPOCOMETENCIAS2 : DbMigration
    {
        public override void Up()
        {
            AddColumn("CH.cat_NominaCompetencias", "periodoId", c => c.Int());
            AddColumn("CH.cat_NominaCompetencias", "Estado", c => c.Int(nullable: false));
            CreateIndex("CH.cat_NominaCompetencias", "periodoId");
            AddForeignKey("CH.cat_NominaCompetencias", "periodoId", "CH.cat_PeriodoEvaluacion", "PeriodoEvaluaionId");
        }
        
        public override void Down()
        {
            DropForeignKey("CH.cat_NominaCompetencias", "periodoId", "CH.cat_PeriodoEvaluacion");
            DropIndex("CH.cat_NominaCompetencias", new[] { "periodoId" });
            DropColumn("CH.cat_NominaCompetencias", "Estado");
            DropColumn("CH.cat_NominaCompetencias", "periodoId");
        }
    }
}
