namespace INEEL.DataAccess.GEN.MigrationsCH
{
    using System;
    using System.Data.Entity.Migrations;
    
    public partial class relacioncompetenciasnivelessind : DbMigration
    {
        public override void Up()
        {
            AddColumn("CH.cat_RelacionCompetenciasNivelSind", "estado", c => c.Int(nullable: false));
            AlterColumn("CH.cat_RelacionCompetenciasNivelSind", "idPeriodo", c => c.Int(nullable: false));
            CreateIndex("CH.cat_RelacionCompetenciasNivelSind", "idPeriodo");
            AddForeignKey("CH.cat_RelacionCompetenciasNivelSind", "idPeriodo", "CH.cat_PeriodoEvaluacion", "PeriodoEvaluaionId", cascadeDelete: false);
        }
        
        public override void Down()
        {
            DropForeignKey("CH.cat_RelacionCompetenciasNivelSind", "idPeriodo", "CH.cat_PeriodoEvaluacion");
            DropIndex("CH.cat_RelacionCompetenciasNivelSind", new[] { "idPeriodo" });
            AlterColumn("CH.cat_RelacionCompetenciasNivelSind", "idPeriodo", c => c.String(maxLength: 5));
            DropColumn("CH.cat_RelacionCompetenciasNivelSind", "estado");
        }
    }
}
