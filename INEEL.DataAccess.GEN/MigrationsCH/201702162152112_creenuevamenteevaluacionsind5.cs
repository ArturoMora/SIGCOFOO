namespace INEEL.DataAccess.GEN.MigrationsCH
{
    using System;
    using System.Data.Entity.Migrations;
    
    public partial class creenuevamenteevaluacionsind5 : DbMigration
    {
        public override void Up()
        {
            AlterColumn("CH.tab_EvaluacionEmpleadosSind", "EstadoEvaluacionId", c => c.Int());
            AlterColumn("CH.tab_EvaluacionEmpleadosSind", "CalificacionEvaluacionId", c => c.Int());
        }
        
        public override void Down()
        {
            AlterColumn("CH.tab_EvaluacionEmpleadosSind", "CalificacionEvaluacionId", c => c.Int(nullable: false));
            AlterColumn("CH.tab_EvaluacionEmpleadosSind", "EstadoEvaluacionId", c => c.Int(nullable: false));
        }
    }
}
