namespace INEEL.DataAccess.GEN.MigrationsGI
{
    using System;
    using System.Data.Entity.Migrations;
    
    public partial class migAjusteGI : DbMigration
    {
        public override void Up()
        {
            DropForeignKey("GI.cat_PropuestaConIdea", "EstadoFlujoId", "GEN.cat_EstadoFlujo");
            DropIndex("GI.cat_PropuestaConIdea", new[] { "EstadoFlujoId" });
            DropTable("GI.cat_PropuestaConIdea");
        }
        
        public override void Down()
        {
            CreateTable(
                "GI.cat_PropuestaConIdea",
                c => new
                    {
                        IdeaId = c.Int(nullable: false),
                        PropuestaId = c.String(nullable: false),
                        NombreTecnico = c.String(),
                        ProductoServicio = c.String(),
                        ClaveProponentePrincipal = c.String(),
                        EmpresaPromotorClave = c.String(),
                        UnidadOrganizacionalId = c.String(maxLength: 10),
                        NombreUnidadOrganizacional = c.String(),
                        SegmentoMercadoId = c.Int(nullable: false),
                        FechaRegistro = c.DateTime(nullable: false),
                        EstadoFlujoId = c.Int(nullable: false),
                    })
                .PrimaryKey(t => t.IdeaId);
            
            CreateIndex("GI.cat_PropuestaConIdea", "EstadoFlujoId");
            AddForeignKey("GI.cat_PropuestaConIdea", "EstadoFlujoId", "GEN.cat_EstadoFlujo", "EstadoFlujoId", cascadeDelete: true);
        }
    }
}
