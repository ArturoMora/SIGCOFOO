namespace INEEL.DataAccess.GEN.MigrationsCH
{
    using System;
    using System.Data.Entity.Migrations;
    
    public partial class DetalleEvaluacionTecnicas : DbMigration
    {
        public override void Up()
        {
            CreateTable(
                "CH.tab_DetalleEvaluacionTecnicas",
                c => new
                    {
                        detalleId = c.Int(nullable: false, identity: true),
                        claveEmpleado = c.String(maxLength: 5),
                        periodoId = c.String(maxLength: 5),
                        idCompetenciaTecnica = c.Int(nullable: false),
                        calificacionEvaluacionId = c.Int(nullable: false),
                        observaciones = c.String(maxLength: 500),
                    })
                .PrimaryKey(t => t.detalleId)
                .ForeignKey("CH.cat_CalificacionCompetencias", t => t.calificacionEvaluacionId, cascadeDelete: true)
                .ForeignKey("CH.cat_CompetenciasTecnicas", t => t.idCompetenciaTecnica, cascadeDelete: true)
                .Index(t => t.idCompetenciaTecnica)
                .Index(t => t.calificacionEvaluacionId);
            
            CreateTable(
                "CH.tab_EvaluacionTecnicas",
                c => new
                    {
                        idEvaluacion = c.Int(nullable: false, identity: true),
                        claveEmpleado = c.String(maxLength: 5),
                        claveArea = c.String(maxLength: 5),
                        claveCategoria = c.String(maxLength: 5),
                        idPeriodo = c.String(maxLength: 5),
                        estadoEvaluacionId = c.Int(nullable: false),
                        calificacionEvaluacionId = c.Int(nullable: false),
                        brecha = c.String(maxLength: 500),
                        visible = c.Int(nullable: false),
                        tipoArea = c.Int(),
                        nivelCompetencia = c.Int(),
                    })
                .PrimaryKey(t => t.idEvaluacion)
                .ForeignKey("CH.cat_CalificacionCompetencias", t => t.calificacionEvaluacionId, cascadeDelete: true)
                .ForeignKey("CH.cat_EstadoEvaluacion", t => t.estadoEvaluacionId, cascadeDelete: true)
                .Index(t => t.estadoEvaluacionId)
                .Index(t => t.calificacionEvaluacionId);
            
        }
        
        public override void Down()
        {
            DropForeignKey("CH.tab_EvaluacionTecnicas", "estadoEvaluacionId", "CH.cat_EstadoEvaluacion");
            DropForeignKey("CH.tab_EvaluacionTecnicas", "calificacionEvaluacionId", "CH.cat_CalificacionCompetencias");
            DropForeignKey("CH.tab_DetalleEvaluacionTecnicas", "idCompetenciaTecnica", "CH.cat_CompetenciasTecnicas");
            DropForeignKey("CH.tab_DetalleEvaluacionTecnicas", "calificacionEvaluacionId", "CH.cat_CalificacionCompetencias");
            DropIndex("CH.tab_EvaluacionTecnicas", new[] { "calificacionEvaluacionId" });
            DropIndex("CH.tab_EvaluacionTecnicas", new[] { "estadoEvaluacionId" });
            DropIndex("CH.tab_DetalleEvaluacionTecnicas", new[] { "calificacionEvaluacionId" });
            DropIndex("CH.tab_DetalleEvaluacionTecnicas", new[] { "idCompetenciaTecnica" });
            DropTable("CH.tab_EvaluacionTecnicas");
            DropTable("CH.tab_DetalleEvaluacionTecnicas");
        }
    }
}
