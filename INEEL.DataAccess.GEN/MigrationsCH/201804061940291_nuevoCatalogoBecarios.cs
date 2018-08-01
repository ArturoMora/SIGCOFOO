namespace INEEL.DataAccess.GEN.MigrationsCH
{
    using System;
    using System.Data.Entity.Migrations;
    
    public partial class nuevoCatalogoBecarios : DbMigration
    {
        public override void Up()
        {
            CreateTable(
                "CH.tab_BecarioExternoINEEL",
                c => new
                    {
                        BecarioId = c.Int(nullable: false, identity: true),
                        FechaValidacion = c.DateTime(),
                        FechaInicio = c.DateTime(nullable: false),
                        FechaTermino = c.DateTime(nullable: false),
                        EstadoFlujoId = c.Int(nullable: false),
                        TipoBecaId = c.Int(nullable: false),
                        ProyectoId = c.String(maxLength: 10),
                        TituloEstancia = c.String(),
                        Descripcion = c.String(),
                        ClaveAsesor = c.String(),
                        NombreAsesor = c.String(),
                        ClaveBecario = c.String(),
                        NombreBecario = c.String(),
                        AdjuntoId = c.Long(),
                        ClaveUnidad = c.String(),
                        InstitucionId = c.Int(nullable: false),
                        PersonalIneel = c.Boolean(nullable: false),
                        ClavePersona = c.String(),
                        Notas = c.String(),
                    })
                .PrimaryKey(t => t.BecarioId)
                .ForeignKey("GEN.Adjunto", t => t.AdjuntoId)
                .ForeignKey("GEN.cat_EstadoFlujo", t => t.EstadoFlujoId, cascadeDelete: false)
                .ForeignKey("CH.cat_Instituciones", t => t.InstitucionId, cascadeDelete: false)
                .ForeignKey("GEN.Proyectos", t => t.ProyectoId)
                .ForeignKey("CH.cat_TipoBecas", t => t.TipoBecaId, cascadeDelete: false)
                .Index(t => t.EstadoFlujoId)
                .Index(t => t.TipoBecaId)
                .Index(t => t.ProyectoId)
                .Index(t => t.AdjuntoId)
                .Index(t => t.InstitucionId);
            
        }
        
        public override void Down()
        {
            DropForeignKey("CH.tab_BecarioExternoINEEL", "TipoBecaId", "CH.cat_TipoBecas");
            DropForeignKey("CH.tab_BecarioExternoINEEL", "ProyectoId", "GEN.Proyectos");
            DropForeignKey("CH.tab_BecarioExternoINEEL", "InstitucionId", "CH.cat_Instituciones");
            DropForeignKey("CH.tab_BecarioExternoINEEL", "EstadoFlujoId", "GEN.cat_EstadoFlujo");
            DropForeignKey("CH.tab_BecarioExternoINEEL", "AdjuntoId", "GEN.Adjunto");
            DropIndex("CH.tab_BecarioExternoINEEL", new[] { "InstitucionId" });
            DropIndex("CH.tab_BecarioExternoINEEL", new[] { "AdjuntoId" });
            DropIndex("CH.tab_BecarioExternoINEEL", new[] { "ProyectoId" });
            DropIndex("CH.tab_BecarioExternoINEEL", new[] { "TipoBecaId" });
            DropIndex("CH.tab_BecarioExternoINEEL", new[] { "EstadoFlujoId" });
            DropTable("CH.tab_BecarioExternoINEEL");
        }
    }
}
