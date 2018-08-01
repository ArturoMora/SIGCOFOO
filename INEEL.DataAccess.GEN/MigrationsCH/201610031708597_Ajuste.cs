namespace INEEL.DataAccess.GEN.MigrationsCH
{
    using System;
    using System.Data.Entity.Migrations;
    
    public partial class Ajuste : DbMigration
    {
        public override void Up()
        {
            DropForeignKey("CH.tab_ManualCompetenciaConductual", "AdjuntoId", "GEN.Adjunto");
            DropForeignKey("CH.tab_ManualCompetenciaConductual", "PeriodoEvaluaionId", "CH.cat_PeriodoEvaluacion");
            DropForeignKey("CH.tab_ManualCompetenciaTecnica", "AdjuntoId", "GEN.Adjunto");
            DropForeignKey("CH.tab_ManualCompetenciaTecnica", "PeriodoEvaluaionId", "CH.cat_PeriodoEvaluacion");
            DropIndex("CH.tab_ManualCompetenciaConductual", new[] { "PeriodoEvaluaionId" });
            DropIndex("CH.tab_ManualCompetenciaConductual", new[] { "AdjuntoId" });
            DropIndex("CH.tab_ManualCompetenciaTecnica", new[] { "PeriodoEvaluaionId" });
            DropIndex("CH.tab_ManualCompetenciaTecnica", new[] { "AdjuntoId" });
            DropTable("CH.tab_ManualCompetenciaConductual");
            DropTable("CH.tab_ManualCompetenciaTecnica");
        }
        
        public override void Down()
        {
            CreateTable(
                "CH.tab_ManualCompetenciaTecnica",
                c => new
                    {
                        ManualCompetenciaTecnicaId = c.Int(nullable: false, identity: true),
                        PeriodoEvaluaionId = c.Int(),
                        AccesoPublico = c.Int(nullable: false),
                        Version = c.Single(nullable: false),
                        Comentario = c.String(),
                        AdjuntoId = c.Long(),
                    })
                .PrimaryKey(t => t.ManualCompetenciaTecnicaId);
            
            CreateTable(
                "CH.tab_ManualCompetenciaConductual",
                c => new
                    {
                        ManualCompetenciaConductualId = c.Int(nullable: false, identity: true),
                        PeriodoEvaluaionId = c.Int(),
                        AccesoPublico = c.Int(nullable: false),
                        Version = c.Single(nullable: false),
                        Comentario = c.String(),
                        AdjuntoId = c.Long(),
                    })
                .PrimaryKey(t => t.ManualCompetenciaConductualId);
            
            CreateIndex("CH.tab_ManualCompetenciaTecnica", "AdjuntoId");
            CreateIndex("CH.tab_ManualCompetenciaTecnica", "PeriodoEvaluaionId");
            CreateIndex("CH.tab_ManualCompetenciaConductual", "AdjuntoId");
            CreateIndex("CH.tab_ManualCompetenciaConductual", "PeriodoEvaluaionId");
            AddForeignKey("CH.tab_ManualCompetenciaTecnica", "PeriodoEvaluaionId", "CH.cat_PeriodoEvaluacion", "PeriodoEvaluaionId");
            AddForeignKey("CH.tab_ManualCompetenciaTecnica", "AdjuntoId", "GEN.Adjunto", "AdjuntoId");
            AddForeignKey("CH.tab_ManualCompetenciaConductual", "PeriodoEvaluaionId", "CH.cat_PeriodoEvaluacion", "PeriodoEvaluaionId");
            AddForeignKey("CH.tab_ManualCompetenciaConductual", "AdjuntoId", "GEN.Adjunto", "AdjuntoId");
        }
    }
}
