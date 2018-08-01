namespace INEEL.DataAccess.GEN.MigrationsGI
{
    using System;
    using System.Data.Entity.Migrations;
    
    public partial class agregaCampoTablaUnidadOrgEmpresas : DbMigration
    {
        public override void Up()
        {
            //AddColumn("CR.UnidadOrganizacionalEmpresas", "CampoAgrupador", c => c.Boolean(nullable: false));
        }
        
        public override void Down()
        {
            //DropColumn("CR.UnidadOrganizacionalEmpresas", "CampoAgrupador");
        }
    }
}
