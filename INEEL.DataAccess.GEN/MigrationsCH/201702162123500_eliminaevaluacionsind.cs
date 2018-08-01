namespace INEEL.DataAccess.GEN.MigrationsCH
{
    using System;
    using System.Data.Entity.Migrations;
    
    public partial class eliminaevaluacionsind : DbMigration
    {
        public override void Up()
        {
            DropForeignKey("CH.tab_EvaluacionEmpleadosSind", "idCategoriaCompetencia", "CH.cat_CategoriasCompetenciasSind");
            DropIndex("CH.tab_EvaluacionEmpleadosSind", new[] { "idCategoriaCompetencia" });
            DropTable("CH.tab_EvaluacionEmpleadosSind");
        }
        
        public override void Down()
        {
            CreateTable(
                "CH.tab_EvaluacionEmpleadosSind",
                c => new
                    {
                        id = c.Int(nullable: false, identity: true),
                        idEvaluacion = c.Int(nullable: false),
                        idListaEmpleados = c.Int(nullable: false),
                        CategoriaNomina = c.String(),
                        idPeriodo = c.String(maxLength: 5),
                        idCategoriaCompetencia = c.Int(nullable: false),
                        estadoEvaluacionId = c.Int(nullable: false),
                        calificacionEvaluacionId = c.Int(nullable: false),
                        Fortalezas = c.String(),
                        AreasMejora = c.String(),
                        PlanAccion = c.String(),
                    })
                .PrimaryKey(t => t.id);
            
            CreateIndex("CH.tab_EvaluacionEmpleadosSind", "idCategoriaCompetencia");
            AddForeignKey("CH.tab_EvaluacionEmpleadosSind", "idCategoriaCompetencia", "CH.cat_CategoriasCompetenciasSind", "CategoriaId", cascadeDelete: true);
        }
    }
}
