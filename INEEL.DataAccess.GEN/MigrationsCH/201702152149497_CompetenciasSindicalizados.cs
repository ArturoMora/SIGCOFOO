namespace INEEL.DataAccess.GEN.MigrationsCH
{
    using System;
    using System.Data.Entity.Migrations;
    
    public partial class CompetenciasSindicalizados : DbMigration
    {
        public override void Up()
        {
            CreateTable(
                "CH.cat_CategoriasCompetenciasSind",
                c => new
                    {
                        CategoriaId = c.Int(nullable: false, identity: true),
                        NombreCategoria = c.String(maxLength: 100),
                        Descripcion = c.String(maxLength: 200),
                        Periodo = c.String(maxLength: 4),
                        Estado = c.Int(nullable: false),
                        FamiliaId = c.Int(),
                    })
                .PrimaryKey(t => t.CategoriaId)
                .ForeignKey("CH.cat_FamiliaPuestosSind", t => t.FamiliaId)
                .Index(t => t.FamiliaId);
            
            CreateTable(
                "CH.cat_FamiliaPuestosSind",
                c => new
                    {
                        FamiliaId = c.Int(nullable: false, identity: true),
                        NombreFamilia = c.String(maxLength: 100),
                        Descripcion = c.String(maxLength: 200),
                        periodoId = c.Int(nullable: false),
                        estado = c.Int(nullable: false),
                    })
                .PrimaryKey(t => t.FamiliaId)
                .ForeignKey("CH.cat_PeriodoEvaluacion", t => t.periodoId, cascadeDelete: true)
                .Index(t => t.periodoId);
            
            CreateTable(
                "CH.cat_CompetenciasSind",
                c => new
                    {
                        CompetenciaId = c.Int(nullable: false, identity: true),
                        Competencia = c.String(maxLength: 100),
                        Descripcion = c.String(maxLength: 600),
                        periodoId = c.Int(nullable: false),
                        Estado = c.Int(nullable: false),
                    })
                .PrimaryKey(t => t.CompetenciaId)
                .ForeignKey("CH.cat_PeriodoEvaluacion", t => t.periodoId, cascadeDelete: true)
                .Index(t => t.periodoId);
            
            CreateTable(
                "CH.cat_ComportamientosSind",
                c => new
                    {
                        id = c.Int(nullable: false, identity: true),
                        descripcion = c.String(maxLength: 255),
                        estado = c.Int(nullable: false),
                    })
                .PrimaryKey(t => t.id);
            
            CreateTable(
                "CH.tab_EvaluacionEmpleadosSind",
                c => new
                    {
                        id = c.Int(nullable: false, identity: true),
                        idEvaluacionSin = c.Int(nullable: false),
                        CategoriaNomina = c.String(maxLength: 100),
                        idPeriodo = c.String(maxLength: 5),
                        idCategoriaCompetencia = c.Int(nullable: false),
                        estadoEvaluacionId = c.Int(nullable: false),
                        calificacionEvaluacionId = c.Int(nullable: false),
                        Fortalezas = c.String(),
                        AreasMejora = c.String(),
                        PlanAccion = c.String(),
                    })
                .PrimaryKey(t => t.id)
                .ForeignKey("CH.cat_CalificacionCompetencias", t => t.calificacionEvaluacionId, cascadeDelete: true)
                .ForeignKey("CH.cat_EstadoEvaluacion", t => t.estadoEvaluacionId, cascadeDelete: true)
                .Index(t => t.estadoEvaluacionId)
                .Index(t => t.calificacionEvaluacionId);
            
            CreateTable(
                "CH.tab_ListadoEmpleadosSind",
                c => new
                    {
                        Id = c.Int(nullable: false, identity: true),
                        EmpleadoId = c.String(maxLength: 10),
                        NombreEmpleado = c.String(maxLength: 200),
                        NoEmpleado = c.String(maxLength: 10),
                    })
                .PrimaryKey(t => t.Id);
            
            CreateTable(
                "CH.cat_MatrizCompetenciasSind",
                c => new
                    {
                        id = c.Int(nullable: false, identity: true),
                        idCategoria = c.Int(nullable: false),
                        idRelacionCompetencias = c.Int(nullable: false),
                        estado = c.Int(nullable: false),
                    })
                .PrimaryKey(t => t.id);
            
            CreateTable(
                "CH.cat_RegistroEvaluacionesSind",
                c => new
                    {
                        id = c.Int(nullable: false, identity: true),
                        idEvaluacionSin = c.Int(nullable: false),
                        idMatriz = c.Int(nullable: false),
                        valorEsperado = c.Int(nullable: false),
                        valorReal = c.Int(nullable: false),
                        descripcion = c.String(maxLength: 500),
                    })
                .PrimaryKey(t => t.id);
            
            CreateTable(
                "CH.cat_RelacionCompetenciasNivelSind",
                c => new
                    {
                        id = c.Int(nullable: false, identity: true),
                        idCompetencia = c.Int(nullable: false),
                        idNivel = c.Int(nullable: false),
                        idPeriodo = c.String(maxLength: 5),
                    })
                .PrimaryKey(t => t.id);
            
            CreateTable(
                "CH.cat_RelacionNivelesComportamientoSind",
                c => new
                    {
                        id = c.Int(nullable: false, identity: true),
                        idNivel = c.Int(nullable: false),
                        idComportamiento = c.Int(nullable: false),
                        idRelacionCompetencias = c.Int(nullable: false),
                    })
                .PrimaryKey(t => t.id);
            
        }
        
        public override void Down()
        {
            DropForeignKey("CH.tab_EvaluacionEmpleadosSind", "estadoEvaluacionId", "CH.cat_EstadoEvaluacion");
            DropForeignKey("CH.tab_EvaluacionEmpleadosSind", "calificacionEvaluacionId", "CH.cat_CalificacionCompetencias");
            DropForeignKey("CH.cat_CompetenciasSind", "periodoId", "CH.cat_PeriodoEvaluacion");
            DropForeignKey("CH.cat_CategoriasCompetenciasSind", "FamiliaId", "CH.cat_FamiliaPuestosSind");
            DropForeignKey("CH.cat_FamiliaPuestosSind", "periodoId", "CH.cat_PeriodoEvaluacion");
            DropIndex("CH.tab_EvaluacionEmpleadosSind", new[] { "calificacionEvaluacionId" });
            DropIndex("CH.tab_EvaluacionEmpleadosSind", new[] { "estadoEvaluacionId" });
            DropIndex("CH.cat_CompetenciasSind", new[] { "periodoId" });
            DropIndex("CH.cat_FamiliaPuestosSind", new[] { "periodoId" });
            DropIndex("CH.cat_CategoriasCompetenciasSind", new[] { "FamiliaId" });
            DropTable("CH.cat_RelacionNivelesComportamientoSind");
            DropTable("CH.cat_RelacionCompetenciasNivelSind");
            DropTable("CH.cat_RegistroEvaluacionesSind");
            DropTable("CH.cat_MatrizCompetenciasSind");
            DropTable("CH.tab_ListadoEmpleadosSind");
            DropTable("CH.tab_EvaluacionEmpleadosSind");
            DropTable("CH.cat_ComportamientosSind");
            DropTable("CH.cat_CompetenciasSind");
            DropTable("CH.cat_FamiliaPuestosSind");
            DropTable("CH.cat_CategoriasCompetenciasSind");
        }
    }
}
