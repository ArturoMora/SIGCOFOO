namespace INEEL.DataAccess.GEN.MigrationsCP
{
    using System;
    using System.Data.Entity.Migrations;
    
    public partial class CorreccionFKs : DbMigration
    {
        public override void Up()
        {
            DropForeignKey("CP.tab_Lineamientos", "AutorId", "CP.tab_Autores");
            DropForeignKey("CP.tab_EstadoArte", "AutorId", "CP.tab_Autores");
            DropForeignKey("CP.tab_EstudiosEspecializados", "AutorId", "CP.tab_Autores");
            DropForeignKey("CP.tab_InformeAnual", "AutorId", "CP.tab_Autores");
            DropForeignKey("CP.tab_MapasRuta", "AutorId", "CP.tab_Autores");
            DropForeignKey("CP.tab_PlanAnual", "AutorId", "CP.tab_Autores");
            DropForeignKey("CP.tab_TemasInnovacion", "AutorId", "CP.tab_Autores");
            DropForeignKey("CP.tab_InformeAnual", "AdjuntoId", "GEN.Adjunto");
            DropIndex("CP.tab_Lineamientos", new[] { "AutorId" });
            DropIndex("CP.tab_EstadoArte", new[] { "AutorId" });
            DropIndex("CP.tab_EstudiosEspecializados", new[] { "AutorId" });
            DropIndex("CP.tab_InformeAnual", new[] { "AdjuntoId" });
            DropIndex("CP.tab_InformeAnual", new[] { "AutorId" });
            DropIndex("CP.tab_MapasRuta", new[] { "AutorId" });
            DropIndex("CP.tab_PlanAnual", new[] { "AutorId" });
            DropIndex("CP.tab_TemasInnovacion", new[] { "AutorId" });
            AlterColumn("CP.tab_InformeAnual", "AdjuntoId", c => c.Long());
            CreateIndex("CP.tab_InformeAnual", "AdjuntoId");
            AddForeignKey("CP.tab_InformeAnual", "AdjuntoId", "GEN.Adjunto", "AdjuntoId");
            DropColumn("CP.tab_Lineamientos", "AutorId");
            DropColumn("CP.tab_EstadoArte", "AutorId");
            DropColumn("CP.tab_EstudiosEspecializados", "AutorId");
            DropColumn("CP.tab_InformeAnual", "AutorId");
            DropColumn("CP.tab_MapasRuta", "AutorId");
            DropColumn("CP.tab_PlanAnual", "AutorId");
            DropColumn("CP.tab_TemasInnovacion", "AutorId");
        }
        
        public override void Down()
        {
            AddColumn("CP.tab_TemasInnovacion", "AutorId", c => c.Int(nullable: false));
            AddColumn("CP.tab_PlanAnual", "AutorId", c => c.Int(nullable: false));
            AddColumn("CP.tab_MapasRuta", "AutorId", c => c.Int(nullable: false));
            AddColumn("CP.tab_InformeAnual", "AutorId", c => c.Int(nullable: false));
            AddColumn("CP.tab_EstudiosEspecializados", "AutorId", c => c.Int(nullable: false));
            AddColumn("CP.tab_EstadoArte", "AutorId", c => c.Int(nullable: false));
            AddColumn("CP.tab_Lineamientos", "AutorId", c => c.Int(nullable: false));
            DropForeignKey("CP.tab_InformeAnual", "AdjuntoId", "GEN.Adjunto");
            DropIndex("CP.tab_InformeAnual", new[] { "AdjuntoId" });
            AlterColumn("CP.tab_InformeAnual", "AdjuntoId", c => c.Long(nullable: false));
            CreateIndex("CP.tab_TemasInnovacion", "AutorId");
            CreateIndex("CP.tab_PlanAnual", "AutorId");
            CreateIndex("CP.tab_MapasRuta", "AutorId");
            CreateIndex("CP.tab_InformeAnual", "AutorId");
            CreateIndex("CP.tab_InformeAnual", "AdjuntoId");
            CreateIndex("CP.tab_EstudiosEspecializados", "AutorId");
            CreateIndex("CP.tab_EstadoArte", "AutorId");
            CreateIndex("CP.tab_Lineamientos", "AutorId");
            AddForeignKey("CP.tab_InformeAnual", "AdjuntoId", "GEN.Adjunto", "AdjuntoId", cascadeDelete: true);
            AddForeignKey("CP.tab_TemasInnovacion", "AutorId", "CP.tab_Autores", "AutorId", cascadeDelete: true);
            AddForeignKey("CP.tab_PlanAnual", "AutorId", "CP.tab_Autores", "AutorId", cascadeDelete: true);
            AddForeignKey("CP.tab_MapasRuta", "AutorId", "CP.tab_Autores", "AutorId", cascadeDelete: true);
            AddForeignKey("CP.tab_InformeAnual", "AutorId", "CP.tab_Autores", "AutorId", cascadeDelete: true);
            AddForeignKey("CP.tab_EstudiosEspecializados", "AutorId", "CP.tab_Autores", "AutorId", cascadeDelete: true);
            AddForeignKey("CP.tab_EstadoArte", "AutorId", "CP.tab_Autores", "AutorId", cascadeDelete: true);
            AddForeignKey("CP.tab_Lineamientos", "AutorId", "CP.tab_Autores", "AutorId", cascadeDelete: true);
        }
    }
}
