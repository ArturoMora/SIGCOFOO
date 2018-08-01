namespace INEEL.DataAccess.GEN.MigrationsCH
{
    using System;
    using System.Data.Entity.Migrations;
    
    public partial class CambiosEnPeriodoEvaluacion : DbMigration
    {
        public override void Up()
        {
            AddColumn("CH.cat_PeriodoEvaluacion", "PersonalMigrado", c => c.Int());
            AddColumn("CH.cat_PeriodoEvaluacion", "EvaluacionFinalizada", c => c.Int());
        }
        
        public override void Down()
        {
            DropColumn("CH.cat_PeriodoEvaluacion", "EvaluacionFinalizada");
            DropColumn("CH.cat_PeriodoEvaluacion", "PersonalMigrado");
        }
    }
}
