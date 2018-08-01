namespace INEEL.DataAccess.GEN.MigrationsGI
{
    using System;
    using System.Data.Entity.Migrations;
    
    public partial class addprop : DbMigration
    {
        public override void Up()
        {
            CreateTable(
                "GI.tab_Propuesta",
                c => new
                    {
                        Id = c.Int(nullable: false, identity: true),
                        PropuestaId = c.String(),
                        IdeaInnovadoraId = c.Int(),
                        PropuestaInterna = c.Boolean(nullable: false),
                        NombreTecnico = c.String(),
                        ProductoServicio = c.String(),
                        ClaveProponentePrincipal = c.String(),
                        EmpresaPromotorClave = c.Int(),
                        UnidadOrganizacionalId = c.String(maxLength: 10),
                        NombreUnidadOrganizacional = c.String(),
                        SegmentoMercadoId = c.Int(nullable: false),
                        FechaRegistro = c.DateTime(),
                        AdjuntoId = c.Long(),
                        ClavePersona = c.String(),
                        FechaValidacion = c.DateTime(),
                        EstadoFlujoId = c.Int(nullable: false),
                        TipoAcceso = c.Int(nullable: false),
                    })
                .PrimaryKey(t => t.Id)
                .ForeignKey("GEN.Adjunto", t => t.AdjuntoId)
                .ForeignKey("GEN.cat_EstadoFlujo", t => t.EstadoFlujoId, cascadeDelete: true)
                .ForeignKey("GI.tab_IdeaInnovadora", t => t.IdeaInnovadoraId)
                .ForeignKey("GI.cat_TipoAcceso", t => t.TipoAcceso, cascadeDelete: true)
                .Index(t => t.IdeaInnovadoraId)
                .Index(t => t.AdjuntoId)
                .Index(t => t.EstadoFlujoId)
                .Index(t => t.TipoAcceso);
            
        }
        
        public override void Down()
        {
            DropForeignKey("GI.tab_Propuesta", "TipoAcceso", "GI.cat_TipoAcceso");
            DropForeignKey("GI.tab_Propuesta", "IdeaInnovadoraId", "GI.tab_IdeaInnovadora");
            DropForeignKey("GI.tab_Propuesta", "EstadoFlujoId", "GEN.cat_EstadoFlujo");
            DropForeignKey("GI.tab_Propuesta", "AdjuntoId", "GEN.Adjunto");
            DropIndex("GI.tab_Propuesta", new[] { "TipoAcceso" });
            DropIndex("GI.tab_Propuesta", new[] { "EstadoFlujoId" });
            DropIndex("GI.tab_Propuesta", new[] { "AdjuntoId" });
            DropIndex("GI.tab_Propuesta", new[] { "IdeaInnovadoraId" });
            DropTable("GI.tab_Propuesta");
        }
    }
}
