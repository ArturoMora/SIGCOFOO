namespace INEEL.DataAccess.GEN.MigrationsCH
{
    using System;
    using System.Data.Entity.Migrations;
    
    public partial class ResultadosEvaluacionsSind3 : DbMigration
    {
        public override void Up()
        {
            DropForeignKey("CH.tab_EvaluacionEmpleadosSind", "calificacionEvaluacionId", "CH.cat_CalificacionCompetencias");
            DropForeignKey("CH.tab_EvaluacionEmpleadosSind", "estadoEvaluacionId", "CH.cat_EstadoEvaluacion");
            DropIndex("CH.tab_EvaluacionEmpleadosSind", new[] { "estadoEvaluacionId" });
            DropIndex("CH.tab_EvaluacionEmpleadosSind", new[] { "calificacionEvaluacionId" });
            CreateTable(
                "CH.cat_CalificacionnSind",
                c => new
                    {
                        id = c.Int(nullable: false, identity: true),
                        descripcion = c.String(),
                        estado = c.Int(nullable: false),
                    })
                .PrimaryKey(t => t.id);
            
            CreateTable(
                "CH.cat_EstadoEvaluacionSind",
                c => new
                    {
                        id = c.Int(nullable: false, identity: true),
                        descripcion = c.String(),
                        estado = c.Int(nullable: false),
                    })
                .PrimaryKey(t => t.id);
            
            AlterColumn("CH.tab_EvaluacionEmpleadosSind", "CategoriaNomina", c => c.String());
        }
        
        public override void Down()
        {
            AlterColumn("CH.tab_EvaluacionEmpleadosSind", "CategoriaNomina", c => c.String(maxLength: 100));
            DropTable("CH.cat_EstadoEvaluacionSind");
            DropTable("CH.cat_CalificacionnSind");
            CreateIndex("CH.tab_EvaluacionEmpleadosSind", "calificacionEvaluacionId");
            CreateIndex("CH.tab_EvaluacionEmpleadosSind", "estadoEvaluacionId");
            AddForeignKey("CH.tab_EvaluacionEmpleadosSind", "estadoEvaluacionId", "CH.cat_EstadoEvaluacion", "EstadoEvaluacionId", cascadeDelete: true);
            AddForeignKey("CH.tab_EvaluacionEmpleadosSind", "calificacionEvaluacionId", "CH.cat_CalificacionCompetencias", "CalificacionId", cascadeDelete: true);
        }
    }
}
