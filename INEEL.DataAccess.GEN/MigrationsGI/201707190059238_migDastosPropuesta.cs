namespace INEEL.DataAccess.GEN.MigrationsGI
{
    using System;
    using System.Data.Entity.Migrations;
    
    public partial class migDastosPropuesta : DbMigration
    {
        public override void Up()
        {
            AddColumn("GI.cat_PropuestaConIdea", "NombreTecnico", c => c.String());
            AddColumn("GI.cat_PropuestaConIdea", "ProductoServicio", c => c.String());
            AddColumn("GI.cat_PropuestaConIdea", "ClaveProponentePrincipal", c => c.String());
            AddColumn("GI.cat_PropuestaConIdea", "EmpresaPromotorClave", c => c.String());
            AddColumn("GI.cat_PropuestaConIdea", "UnidadOrganizacionalId", c => c.String());
            AddColumn("GI.cat_PropuestaConIdea", "NombreUnidadOrganizacional", c => c.String());
            AddColumn("GI.cat_PropuestaConIdea", "SegmentoMercadoId", c => c.Int(nullable: false));
            AddColumn("GI.cat_PropuestaConIdea", "FechaRegistro", c => c.DateTime(nullable: false));
            AddColumn("GI.tab_PropuestaEnEstado", "PropuestaId", c => c.String());
        }
        
        public override void Down()
        {
            DropColumn("GI.tab_PropuestaEnEstado", "PropuestaId");
            DropColumn("GI.cat_PropuestaConIdea", "FechaRegistro");
            DropColumn("GI.cat_PropuestaConIdea", "SegmentoMercadoId");
            DropColumn("GI.cat_PropuestaConIdea", "NombreUnidadOrganizacional");
            DropColumn("GI.cat_PropuestaConIdea", "UnidadOrganizacionalId");
            DropColumn("GI.cat_PropuestaConIdea", "EmpresaPromotorClave");
            DropColumn("GI.cat_PropuestaConIdea", "ClaveProponentePrincipal");
            DropColumn("GI.cat_PropuestaConIdea", "ProductoServicio");
            DropColumn("GI.cat_PropuestaConIdea", "NombreTecnico");
        }
    }
}
