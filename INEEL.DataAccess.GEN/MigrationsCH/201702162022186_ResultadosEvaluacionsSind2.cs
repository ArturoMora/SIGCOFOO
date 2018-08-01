namespace INEEL.DataAccess.GEN.MigrationsCH
{
    using System;
    using System.Data.Entity.Migrations;
    
    public partial class ResultadosEvaluacionsSind2 : DbMigration
    {
        public override void Up()
        {
            AddColumn("CH.tab_EvaluacionEmpleadosSind", "idEvaluacion", c => c.Int(nullable: false));
            AddColumn("CH.tab_EvaluacionEmpleadosSind", "idListaEmpleados", c => c.Int(nullable: false));
            DropColumn("CH.tab_EvaluacionEmpleadosSind", "idEvaluacionSin");
        }
        
        public override void Down()
        {
            AddColumn("CH.tab_EvaluacionEmpleadosSind", "idEvaluacionSin", c => c.Int(nullable: false));
            DropColumn("CH.tab_EvaluacionEmpleadosSind", "idListaEmpleados");
            DropColumn("CH.tab_EvaluacionEmpleadosSind", "idEvaluacion");
        }
    }
}
