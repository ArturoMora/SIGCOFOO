namespace INEEL.DataAccess.GEN.MigrationsCH
{
    using System;
    using System.Data.Entity.Migrations;
    
    public partial class ManualCompetencias : DbMigration
    {
        public override void Up()
        {
            CreateTable(
                "CH.tab_ManualCompetenciaConductual",
                c => new
                    {
                        ManualCompetenciaConductualId = c.String(nullable: false, maxLength: 128),
                        PeriodoEvaluaionId = c.Int(),
                        AccesoPublico = c.Int(nullable: false),
                        Version = c.Single(nullable: false),
                        Comentario = c.String(),
                        AdjuntoId = c.Long(),
                    })
                .PrimaryKey(t => t.ManualCompetenciaConductualId)
                .ForeignKey("GEN.Adjunto", t => t.AdjuntoId)
                .ForeignKey("CH.cat_PeriodoEvaluacion", t => t.PeriodoEvaluaionId)
                .Index(t => t.PeriodoEvaluaionId)
                .Index(t => t.AdjuntoId);
            
            CreateTable(
                "CH.tab_ManualCompetenciaTecnica",
                c => new
                    {
                        ManualCompetenciaTecnicaId = c.String(nullable: false, maxLength: 128),
                        PeriodoEvaluaionId = c.Int(),
                        AccesoPublico = c.Int(nullable: false),
                        Version = c.Single(nullable: false),
                        Comentario = c.String(),
                        AdjuntoId = c.Long(),
                    })
                .PrimaryKey(t => t.ManualCompetenciaTecnicaId)
                .ForeignKey("GEN.Adjunto", t => t.AdjuntoId)
                .ForeignKey("CH.cat_PeriodoEvaluacion", t => t.PeriodoEvaluaionId)
                .Index(t => t.PeriodoEvaluaionId)
                .Index(t => t.AdjuntoId);
            
        }
        
        public override void Down()
        {
            DropForeignKey("CH.tab_ManualCompetenciaTecnica", "PeriodoEvaluaionId", "CH.cat_PeriodoEvaluacion");
            DropForeignKey("CH.tab_ManualCompetenciaTecnica", "AdjuntoId", "GEN.Adjunto");
            DropForeignKey("CH.tab_ManualCompetenciaConductual", "PeriodoEvaluaionId", "CH.cat_PeriodoEvaluacion");
            DropForeignKey("CH.tab_ManualCompetenciaConductual", "AdjuntoId", "GEN.Adjunto");
            DropIndex("CH.tab_ManualCompetenciaTecnica", new[] { "AdjuntoId" });
            DropIndex("CH.tab_ManualCompetenciaTecnica", new[] { "PeriodoEvaluaionId" });
            DropIndex("CH.tab_ManualCompetenciaConductual", new[] { "AdjuntoId" });
            DropIndex("CH.tab_ManualCompetenciaConductual", new[] { "PeriodoEvaluaionId" });
            DropTable("CH.tab_ManualCompetenciaTecnica");
            DropTable("CH.tab_ManualCompetenciaConductual");
        }
    }
}
