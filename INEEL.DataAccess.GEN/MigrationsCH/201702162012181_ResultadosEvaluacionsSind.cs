namespace INEEL.DataAccess.GEN.MigrationsCH
{
    using System;
    using System.Data.Entity.Migrations;
    
    public partial class ResultadosEvaluacionsSind : DbMigration
    {
        public override void Up()
        {
            DropForeignKey("CH.tab_EvaluacionEmpleadosSind", "idEvaluacionSin", "CH.tab_ListadoEmpleadosSind");
            DropForeignKey("CH.cat_RegistroEvaluacionesSind", "idEvaluacionSin", "CH.tab_EvaluacionEmpleadosSind");
            DropIndex("CH.tab_EvaluacionEmpleadosSind", new[] { "idEvaluacionSin" });
            DropIndex("CH.cat_RegistroEvaluacionesSind", new[] { "idEvaluacionSin" });
            AddColumn("CH.cat_RegistroEvaluacionesSind", "justificacion", c => c.String());
            DropColumn("CH.cat_RegistroEvaluacionesSind", "descripcion");
        }
        
        public override void Down()
        {
            AddColumn("CH.cat_RegistroEvaluacionesSind", "descripcion", c => c.String(maxLength: 500));
            DropColumn("CH.cat_RegistroEvaluacionesSind", "justificacion");
            CreateIndex("CH.cat_RegistroEvaluacionesSind", "idEvaluacionSin");
            CreateIndex("CH.tab_EvaluacionEmpleadosSind", "idEvaluacionSin");
            AddForeignKey("CH.cat_RegistroEvaluacionesSind", "idEvaluacionSin", "CH.tab_EvaluacionEmpleadosSind", "id", cascadeDelete: true);
            AddForeignKey("CH.tab_EvaluacionEmpleadosSind", "idEvaluacionSin", "CH.tab_ListadoEmpleadosSind", "Id", cascadeDelete: true);
        }
    }
}
