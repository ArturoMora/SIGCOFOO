namespace INEEL.DataAccess.GEN.MigrationsCR
{
    using System;
    using System.Data.Entity.Migrations;
    
    public partial class nuevoCampoTipoOrganizacionId : DbMigration
    {
        public override void Up()
        {
            AddColumn("CR.cat_Empresas", "TipoOrganizacionId", c => c.Int());
            CreateIndex("CR.cat_Empresas", "TipoOrganizacionId");
            AddForeignKey("CR.cat_Empresas", "TipoOrganizacionId", "CR.cat_TipoOrganizacion", "TipoOrganizacionId");
        }
        
        public override void Down()
        {
            DropForeignKey("CR.cat_Empresas", "TipoOrganizacionId", "CR.cat_TipoOrganizacion");
            DropIndex("CR.cat_Empresas", new[] { "TipoOrganizacionId" });
            DropColumn("CR.cat_Empresas", "TipoOrganizacionId");
        }
    }
}
