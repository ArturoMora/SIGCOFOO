namespace INEEL.DataAccess.GEN.MigrationsCH
{
    using System;
    using System.Data.Entity.Migrations;
    
    public partial class NombreDeTuMigracion : DbMigration
    {
        public override void Up()
        {
            CreateTable(
                "CH.cat_CompetenciasTecnicas",
                c => new
                    {
                        CompetenciaId = c.Int(nullable: false, identity: true),
                        Competencia = c.String(),
                        Descripcion = c.String(),
                        periodoId = c.Int(),
                        areaId = c.Int(nullable: false),
                        Estado = c.Int(nullable: false),
                    })
                .PrimaryKey(t => t.CompetenciaId)
                .ForeignKey("CH.cat_TipoArea", t => t.areaId, cascadeDelete: true)
                .ForeignKey("CH.cat_PeriodoEvaluacion", t => t.periodoId)
                .Index(t => t.periodoId)
                .Index(t => t.areaId);
            
            CreateTable(
                "CH.cat_PeriodoEvaluacion",
                c => new
                    {
                        PeriodoEvaluaionId = c.Int(nullable: false, identity: true),
                        Periodo = c.String(maxLength: 100),
                        Estado = c.Int(nullable: false),
                    })
                .PrimaryKey(t => t.PeriodoEvaluaionId);
            
            CreateTable(
                "CH.cat_EstadoEvaluacion",
                c => new
                    {
                        EstadoEvaluacionId = c.Int(nullable: false, identity: true),
                        Descripcion = c.String(maxLength: 100),
                        Estado = c.Int(nullable: false),
                    })
                .PrimaryKey(t => t.EstadoEvaluacionId);
            
            CreateTable(
                "CH.cat_NivelCompetenciaTecnica",
                c => new
                    {
                        NivelCompetenciaId = c.Int(nullable: false, identity: true),
                        Descripcion = c.String(maxLength: 100),
                        categoriaMin = c.Int(nullable: false),
                        categoraMax = c.Int(nullable: false),
                        nivelMin = c.Int(nullable: false),
                        nivelMax = c.Int(nullable: false),
                        periodoId = c.Int(),
                        areaId = c.Int(),
                        Estado = c.Int(nullable: false),
                    })
                .PrimaryKey(t => t.NivelCompetenciaId)
                .ForeignKey("CH.cat_TipoArea", t => t.areaId)
                .ForeignKey("CH.cat_PeriodoEvaluacion", t => t.periodoId)
                .Index(t => t.periodoId)
                .Index(t => t.areaId);
            
        }
        
        public override void Down()
        {
            DropForeignKey("CH.cat_NivelCompetenciaTecnica", "periodoId", "CH.cat_PeriodoEvaluacion");
            DropForeignKey("CH.cat_NivelCompetenciaTecnica", "areaId", "CH.cat_TipoArea");
            DropForeignKey("CH.cat_CompetenciasTecnicas", "periodoId", "CH.cat_PeriodoEvaluacion");
            DropForeignKey("CH.cat_CompetenciasTecnicas", "areaId", "CH.cat_TipoArea");
            DropIndex("CH.cat_NivelCompetenciaTecnica", new[] { "areaId" });
            DropIndex("CH.cat_NivelCompetenciaTecnica", new[] { "periodoId" });
            DropIndex("CH.cat_CompetenciasTecnicas", new[] { "areaId" });
            DropIndex("CH.cat_CompetenciasTecnicas", new[] { "periodoId" });
            DropTable("CH.cat_NivelCompetenciaTecnica");
            DropTable("CH.cat_EstadoEvaluacion");
            DropTable("CH.cat_PeriodoEvaluacion");
            DropTable("CH.cat_CompetenciasTecnicas");
        }
    }
}
