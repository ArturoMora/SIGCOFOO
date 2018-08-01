namespace INEEL.DataAccess.GEN.MigrationsGI
{
    using System;
    using System.Data.Entity.Migrations;
    
    public partial class deleteprop : DbMigration
    {
        public override void Up()
        {
            DropForeignKey("GI.tab_Propuesta", "AdjuntoId", "GEN.Adjunto");
            DropForeignKey("GI.tab_Propuesta", "EstadoFlujoId", "GEN.cat_EstadoFlujo");
            DropForeignKey("GI.tab_Propuesta", "IdeaInnovadoraId", "GI.tab_IdeaInnovadora");
            DropForeignKey("GI.tab_Propuesta", "TipoAcceso", "GI.cat_TipoAcceso");
            DropIndex("GI.tab_Propuesta", new[] { "IdeaInnovadoraId" });
            DropIndex("GI.tab_Propuesta", new[] { "AdjuntoId" });
            DropIndex("GI.tab_Propuesta", new[] { "EstadoFlujoId" });
            DropIndex("GI.tab_Propuesta", new[] { "TipoAcceso" });
            DropTable("GI.tab_Propuesta");
        }
        
        public override void Down()
        {
            CreateTable(
                "GI.tab_Propuesta",
                c => new
                    {
                        PropuestaId = c.String(nullable: false, maxLength: 128),
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
                .PrimaryKey(t => t.PropuestaId);
            
            CreateIndex("GI.tab_Propuesta", "TipoAcceso");
            CreateIndex("GI.tab_Propuesta", "EstadoFlujoId");
            CreateIndex("GI.tab_Propuesta", "AdjuntoId");
            CreateIndex("GI.tab_Propuesta", "IdeaInnovadoraId");
            AddForeignKey("GI.tab_Propuesta", "TipoAcceso", "GI.cat_TipoAcceso", "Id", cascadeDelete: true);
            AddForeignKey("GI.tab_Propuesta", "IdeaInnovadoraId", "GI.tab_IdeaInnovadora", "IdeaInnovadoraId");
            AddForeignKey("GI.tab_Propuesta", "EstadoFlujoId", "GEN.cat_EstadoFlujo", "EstadoFlujoId", cascadeDelete: true);
            AddForeignKey("GI.tab_Propuesta", "AdjuntoId", "GEN.Adjunto", "AdjuntoId");
        }
    }
}
