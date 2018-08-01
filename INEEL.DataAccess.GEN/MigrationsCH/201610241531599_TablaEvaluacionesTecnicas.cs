namespace INEEL.DataAccess.GEN.MigrationsCH
{
    using System;
    using System.Data.Entity.Migrations;
    
    public partial class TablaEvaluacionesTecnicas : DbMigration
    {
        public override void Up()
        {
            AddColumn("CH.tab_EvaluacionTecnicas", "nombreEmpleado", c => c.String(maxLength: 150));
            CreateIndex("CH.tab_EvaluacionTecnicas", "tipoArea");
            CreateIndex("CH.tab_EvaluacionTecnicas", "nivelCompetencia");
            AddForeignKey("CH.tab_EvaluacionTecnicas", "tipoArea", "CH.cat_TipoArea", "TipoAreaId");
            AddForeignKey("CH.tab_EvaluacionTecnicas", "nivelCompetencia", "CH.cat_NivelCompetenciaTecnica", "NivelCompetenciaId");
        }
        
        public override void Down()
        {
            DropForeignKey("CH.tab_EvaluacionTecnicas", "nivelCompetencia", "CH.cat_NivelCompetenciaTecnica");
            DropForeignKey("CH.tab_EvaluacionTecnicas", "tipoArea", "CH.cat_TipoArea");
            DropIndex("CH.tab_EvaluacionTecnicas", new[] { "nivelCompetencia" });
            DropIndex("CH.tab_EvaluacionTecnicas", new[] { "tipoArea" });
            DropColumn("CH.tab_EvaluacionTecnicas", "nombreEmpleado");
        }
    }
}
