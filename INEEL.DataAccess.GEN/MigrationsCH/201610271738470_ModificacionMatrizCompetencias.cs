namespace INEEL.DataAccess.GEN.MigrationsCH
{
    using System;
    using System.Data.Entity.Migrations;
    
    public partial class ModificacionMatrizCompetencias : DbMigration
    {
        public override void Up()
        {
            DropForeignKey("CH.tab_DetalleEvaluacionConductuales", "MatrizId", "CH.tab_MtrizCompetencias");
            DropIndex("CH.tab_DetalleEvaluacionConductuales", new[] { "MatrizId" });
            AddColumn("CH.tab_MtrizCompetencias", "claveMatriz", c => c.Int(nullable: false));
        }
        
        public override void Down()
        {
            DropColumn("CH.tab_MtrizCompetencias", "claveMatriz");
            CreateIndex("CH.tab_DetalleEvaluacionConductuales", "MatrizId");
            AddForeignKey("CH.tab_DetalleEvaluacionConductuales", "MatrizId", "CH.tab_MtrizCompetencias", "matrizId", cascadeDelete: true);
        }
    }
}
