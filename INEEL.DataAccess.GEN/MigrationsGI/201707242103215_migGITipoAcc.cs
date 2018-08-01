namespace INEEL.DataAccess.GEN.MigrationsGI
{
    using System;
    using System.Data.Entity.Migrations;
    
    public partial class migGITipoAcc : DbMigration
    {
        public override void Up()
        {
            DropForeignKey("GI.tab_IdeaInnovadora", "TipoAccesoGI_Id", "GI.cat_TipoAcceso");
            DropIndex("GI.tab_IdeaInnovadora", new[] { "TipoAccesoGI_Id" });
            DropColumn("GI.tab_IdeaInnovadora", "TipoAcceso");
            RenameColumn(table: "GI.tab_IdeaInnovadora", name: "TipoAccesoGI_Id", newName: "TipoAcceso");
            CreateTable(
                "dbo.Propuesta",
                c => new
                    {
                        PropuestaId = c.String(nullable: false, maxLength: 128),
                        IdeaInnovadoraId = c.Int(),
                        PropuestaInterna = c.Boolean(nullable: false),
                        NombreTecnico = c.String(),
                        ProductoServicio = c.String(),
                        ClaveProponentePrincipal = c.String(),
                        EmpresaPromotorClave = c.String(),
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
                .PrimaryKey(t => t.PropuestaId)
                .ForeignKey("GEN.Adjunto", t => t.AdjuntoId)
                .ForeignKey("GEN.cat_EstadoFlujo", t => t.EstadoFlujoId, cascadeDelete: true)
                .ForeignKey("GI.tab_IdeaInnovadora", t => t.IdeaInnovadoraId)
                .ForeignKey("GI.cat_TipoAcceso", t => t.TipoAcceso, cascadeDelete: true)
                .Index(t => t.IdeaInnovadoraId)
                .Index(t => t.AdjuntoId)
                .Index(t => t.EstadoFlujoId)
                .Index(t => t.TipoAcceso);
            
            AlterColumn("GI.tab_IdeaInnovadora", "FechaRegistro", c => c.DateTime());
            AlterColumn("GI.tab_IdeaInnovadora", "TipoAcceso", c => c.Int(nullable: false));
            CreateIndex("GI.tab_IdeaInnovadora", "TipoAcceso");
            AddForeignKey("GI.tab_IdeaInnovadora", "TipoAcceso", "GI.cat_TipoAcceso", "Id", cascadeDelete: true);
        }
        
        public override void Down()
        {
            DropForeignKey("GI.tab_IdeaInnovadora", "TipoAcceso", "GI.cat_TipoAcceso");
            DropForeignKey("dbo.Propuesta", "TipoAcceso", "GI.cat_TipoAcceso");
            DropForeignKey("dbo.Propuesta", "IdeaInnovadoraId", "GI.tab_IdeaInnovadora");
            DropForeignKey("dbo.Propuesta", "EstadoFlujoId", "GEN.cat_EstadoFlujo");
            DropForeignKey("dbo.Propuesta", "AdjuntoId", "GEN.Adjunto");
            DropIndex("dbo.Propuesta", new[] { "TipoAcceso" });
            DropIndex("dbo.Propuesta", new[] { "EstadoFlujoId" });
            DropIndex("dbo.Propuesta", new[] { "AdjuntoId" });
            DropIndex("dbo.Propuesta", new[] { "IdeaInnovadoraId" });
            DropIndex("GI.tab_IdeaInnovadora", new[] { "TipoAcceso" });
            AlterColumn("GI.tab_IdeaInnovadora", "TipoAcceso", c => c.Int());
            AlterColumn("GI.tab_IdeaInnovadora", "FechaRegistro", c => c.String());
            DropTable("dbo.Propuesta");
            RenameColumn(table: "GI.tab_IdeaInnovadora", name: "TipoAcceso", newName: "TipoAccesoGI_Id");
            AddColumn("GI.tab_IdeaInnovadora", "TipoAcceso", c => c.Int(nullable: false));
            CreateIndex("GI.tab_IdeaInnovadora", "TipoAccesoGI_Id");
            AddForeignKey("GI.tab_IdeaInnovadora", "TipoAccesoGI_Id", "GI.cat_TipoAcceso", "Id");
        }
    }
}
