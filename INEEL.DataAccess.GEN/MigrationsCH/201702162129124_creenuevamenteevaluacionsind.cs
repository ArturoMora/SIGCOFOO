namespace INEEL.DataAccess.GEN.MigrationsCH
{
    using System;
    using System.Data.Entity.Migrations;
    
    public partial class creenuevamenteevaluacionsind : DbMigration
    {
        public override void Up()
        {
            CreateTable(
                "CH.tab_EvaluacionEmpleadosSind",
                c => new
                    {
                        id = c.Int(nullable: false, identity: true),
                        EvaluacionId = c.Int(),
                        ListaEmpleadosId = c.Int(),
                        CategoriaNomina = c.String(maxLength: 255),
                        Periodo = c.String(maxLength: 5),
                        CategoriaCompetenciaId = c.Int(nullable: false),
                        EstadoEvaluacionId = c.Int(nullable: false),
                        CalificacionEvaluacionId = c.Int(nullable: false),
                        Fortalezas = c.String(),
                        AreasMejora = c.String(),
                        PlanAccion = c.String(),
                    })
                .PrimaryKey(t => t.id)
                .ForeignKey("CH.cat_CategoriasCompetenciasSind", t => t.CategoriaCompetenciaId, cascadeDelete: true)
                .Index(t => t.CategoriaCompetenciaId);
            
        }
        
        public override void Down()
        {
            DropForeignKey("CH.tab_EvaluacionEmpleadosSind", "CategoriaCompetenciaId", "CH.cat_CategoriasCompetenciasSind");
            DropIndex("CH.tab_EvaluacionEmpleadosSind", new[] { "CategoriaCompetenciaId" });
            DropTable("CH.tab_EvaluacionEmpleadosSind");
        }
    }
}
