namespace INEEL.DataAccess.GEN.MigrationsCH
{
    using System;
    using System.Data.Entity.Migrations;
    
    public partial class foreingkeytodetalleconductuales : DbMigration
    {
        public override void Up()
        {
            CreateIndex("CH.tab_DetalleEvaluacionConductuales", "MatrizId");
            AddForeignKey("CH.tab_DetalleEvaluacionConductuales", "MatrizId", "CH.tab_MtrizCompetencias", "matrizId", cascadeDelete: true);
        }
        
        public override void Down()
        {
            DropForeignKey("CH.tab_DetalleEvaluacionConductuales", "MatrizId", "CH.tab_MtrizCompetencias");
            DropIndex("CH.tab_DetalleEvaluacionConductuales", new[] { "MatrizId" });
        }
    }
}
