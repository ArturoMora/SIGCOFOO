namespace INEEL.DataAccess.GEN.MigrationsCH
{
    using System;
    using System.Data.Entity.Migrations;
    
    public partial class EvaluacionConductuales : DbMigration
    {
        public override void Up()
        {
            CreateTable(
                "CH.tab_DetalleEvaluacionConductuales",
                c => new
                    {
                        DetalleId = c.Int(nullable: false, identity: true),
                        claveEvaluacion = c.Int(nullable: false),
                        MatrizId = c.Int(nullable: false),
                        justificacion = c.String(),
                        valorReal = c.Int(nullable: false),
                    })
                .PrimaryKey(t => t.DetalleId)
                .ForeignKey("CH.tab_MtrizCompetencias", t => t.MatrizId, cascadeDelete: true)
                .Index(t => t.MatrizId);
            
            CreateTable(
                "CH.tab_EvaluacionConductuales",
                c => new
                    {
                        EvaluacionId = c.Int(nullable: false, identity: true),
                        ClaveEmpleado = c.String(maxLength: 5),
                        NombreEmpleado = c.String(maxLength: 200),
                        claveArea = c.String(maxLength: 5),
                        Periodo = c.String(maxLength: 4),
                        Categoria = c.String(maxLength: 100),
                        CategoriaCompetenciasId = c.Int(nullable: false),
                        CalificacionId = c.Int(nullable: false),
                        EstadoEvaluacionId = c.Int(nullable: false),
                        Fortalezas = c.String(),
                        Debilidades = c.String(),
                        AreasMejora = c.String(),
                        visible = c.Int(nullable: false),
                        claveEvaluacion = c.Int(nullable: false),
                    })
                .PrimaryKey(t => t.EvaluacionId)
                .ForeignKey("CH.cat_CalificacionCompetencias", t => t.CalificacionId, cascadeDelete: true)
                .ForeignKey("CH.cat_CategoriasPorFamilia", t => t.CategoriaCompetenciasId, cascadeDelete: true)
                .Index(t => t.CategoriaCompetenciasId)
                .Index(t => t.CalificacionId);
            
        }
        
        public override void Down()
        {
            DropForeignKey("CH.tab_EvaluacionConductuales", "CategoriaCompetenciasId", "CH.cat_CategoriasPorFamilia");
            DropForeignKey("CH.tab_EvaluacionConductuales", "CalificacionId", "CH.cat_CalificacionCompetencias");
            DropForeignKey("CH.tab_DetalleEvaluacionConductuales", "MatrizId", "CH.tab_MtrizCompetencias");
            DropIndex("CH.tab_EvaluacionConductuales", new[] { "CalificacionId" });
            DropIndex("CH.tab_EvaluacionConductuales", new[] { "CategoriaCompetenciasId" });
            DropIndex("CH.tab_DetalleEvaluacionConductuales", new[] { "MatrizId" });
            DropTable("CH.tab_EvaluacionConductuales");
            DropTable("CH.tab_DetalleEvaluacionConductuales");
        }
    }
}
