namespace INEEL.DataAccess.GEN.MigrationsCH
{
    using System;
    using System.Data.Entity.Migrations;
    
    public partial class relacioncompetenciasnivelessind2 : DbMigration
    {
        public override void Up()
        {
            DropForeignKey("CH.cat_RelacionCompetenciasNivelSind", "idPeriodo", "CH.cat_PeriodoEvaluacion");
            DropIndex("CH.cat_RelacionCompetenciasNivelSind", new[] { "idPeriodo" });
            AlterColumn("CH.cat_RelacionCompetenciasNivelSind", "idPeriodo", c => c.Int());
            AlterColumn("CH.cat_RelacionCompetenciasNivelSind", "estado", c => c.Int());
            CreateIndex("CH.cat_RelacionCompetenciasNivelSind", "idPeriodo");
            AddForeignKey("CH.cat_RelacionCompetenciasNivelSind", "idPeriodo", "CH.cat_PeriodoEvaluacion", "PeriodoEvaluaionId");
        }
        
        public override void Down()
        {
            DropForeignKey("CH.cat_RelacionCompetenciasNivelSind", "idPeriodo", "CH.cat_PeriodoEvaluacion");
            DropIndex("CH.cat_RelacionCompetenciasNivelSind", new[] { "idPeriodo" });
            AlterColumn("CH.cat_RelacionCompetenciasNivelSind", "estado", c => c.Int(nullable: false));
            AlterColumn("CH.cat_RelacionCompetenciasNivelSind", "idPeriodo", c => c.Int(nullable: false));
            CreateIndex("CH.cat_RelacionCompetenciasNivelSind", "idPeriodo");
            AddForeignKey("CH.cat_RelacionCompetenciasNivelSind", "idPeriodo", "CH.cat_PeriodoEvaluacion", "PeriodoEvaluaionId", cascadeDelete: true);
        }
    }
}
