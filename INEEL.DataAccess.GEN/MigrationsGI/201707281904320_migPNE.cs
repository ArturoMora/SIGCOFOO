namespace INEEL.DataAccess.GEN.MigrationsGI
{
    using System;
    using System.Data.Entity.Migrations;
    
    public partial class migPNE : DbMigration
    {
        public override void Up()
        {
            CreateTable(
                "dbo.PlanNegocioEvolArchivos",
                c => new
                    {
                        Id = c.Int(nullable: false, identity: true),
                        Fecha = c.DateTime(nullable: false),
                        AdjuntoId = c.Long(nullable: false),
                        PlanNegocioEvolutivo_PlanNegocioEvolutivoId = c.Int(),
                    })
                .PrimaryKey(t => t.Id)
                .ForeignKey("GEN.Adjunto", t => t.AdjuntoId, cascadeDelete: true)
                .ForeignKey("GI.tab_PlanNegocioEvolutivo", t => t.PlanNegocioEvolutivo_PlanNegocioEvolutivoId)
                .Index(t => t.AdjuntoId)
                .Index(t => t.PlanNegocioEvolutivo_PlanNegocioEvolutivoId);
            
            CreateTable(
                "GI.tab_PlanNegocioEvolAutores",
                c => new
                    {
                        Id = c.Int(nullable: false, identity: true),
                        ClavePersona = c.String(maxLength: 10),
                        Nombre = c.String(),
                        PlanNegocioEvolutivoId = c.Int(nullable: false),
                    })
                .PrimaryKey(t => t.Id)
                .ForeignKey("GI.tab_PlanNegocioEvolutivo", t => t.PlanNegocioEvolutivoId, cascadeDelete: true)
                .Index(t => t.PlanNegocioEvolutivoId);
            
            CreateTable(
                "GI.tab_PlanNegocioEvolutivo",
                c => new
                    {
                        PlanNegocioEvolutivoId = c.Int(nullable: false, identity: true),
                        Titulo = c.String(nullable: false),
                        PropuestaClave = c.Int(),
                        ProyectoId = c.String(maxLength: 10),
                        Tema = c.String(),
                        OfertaDeValor = c.String(),
                        TipoAcceso = c.Int(nullable: false),
                        ClavePersona = c.String(),
                        FechaRegistro = c.DateTime(nullable: false),
                        FechaModificacion = c.DateTime(nullable: false),
                    })
                .PrimaryKey(t => t.PlanNegocioEvolutivoId)
                .ForeignKey("GI.tab_Propuesta", t => t.PropuestaClave)
                .ForeignKey("GEN.Proyectos", t => t.ProyectoId)
                .ForeignKey("GI.cat_TipoAcceso", t => t.TipoAcceso, cascadeDelete: true)
                .Index(t => t.PropuestaClave)
                .Index(t => t.ProyectoId)
                .Index(t => t.TipoAcceso);
            
            CreateTable(
                "GI.tab_PlanNegocioEvolGerencias",
                c => new
                    {
                        Id = c.Int(nullable: false, identity: true),
                        ClaveUnidad = c.String(maxLength: 10),
                        PlanNegocioEvolutivoId = c.Int(nullable: false),
                    })
                .PrimaryKey(t => t.Id)
                .ForeignKey("GI.tab_PlanNegocioEvolutivo", t => t.PlanNegocioEvolutivoId, cascadeDelete: true)
                .Index(t => t.PlanNegocioEvolutivoId);
            
        }
        
        public override void Down()
        {
            DropForeignKey("GI.tab_PlanNegocioEvolutivo", "TipoAcceso", "GI.cat_TipoAcceso");
            DropForeignKey("GI.tab_PlanNegocioEvolutivo", "ProyectoId", "GEN.Proyectos");
            DropForeignKey("GI.tab_PlanNegocioEvolutivo", "PropuestaClave", "GI.tab_Propuesta");
            DropForeignKey("GI.tab_PlanNegocioEvolGerencias", "PlanNegocioEvolutivoId", "GI.tab_PlanNegocioEvolutivo");
            DropForeignKey("GI.tab_PlanNegocioEvolAutores", "PlanNegocioEvolutivoId", "GI.tab_PlanNegocioEvolutivo");
            DropForeignKey("dbo.PlanNegocioEvolArchivos", "PlanNegocioEvolutivo_PlanNegocioEvolutivoId", "GI.tab_PlanNegocioEvolutivo");
            DropForeignKey("dbo.PlanNegocioEvolArchivos", "AdjuntoId", "GEN.Adjunto");
            DropIndex("GI.tab_PlanNegocioEvolGerencias", new[] { "PlanNegocioEvolutivoId" });
            DropIndex("GI.tab_PlanNegocioEvolutivo", new[] { "TipoAcceso" });
            DropIndex("GI.tab_PlanNegocioEvolutivo", new[] { "ProyectoId" });
            DropIndex("GI.tab_PlanNegocioEvolutivo", new[] { "PropuestaClave" });
            DropIndex("GI.tab_PlanNegocioEvolAutores", new[] { "PlanNegocioEvolutivoId" });
            DropIndex("dbo.PlanNegocioEvolArchivos", new[] { "PlanNegocioEvolutivo_PlanNegocioEvolutivoId" });
            DropIndex("dbo.PlanNegocioEvolArchivos", new[] { "AdjuntoId" });
            DropTable("GI.tab_PlanNegocioEvolGerencias");
            DropTable("GI.tab_PlanNegocioEvolutivo");
            DropTable("GI.tab_PlanNegocioEvolAutores");
            DropTable("dbo.PlanNegocioEvolArchivos");
        }
    }
}
