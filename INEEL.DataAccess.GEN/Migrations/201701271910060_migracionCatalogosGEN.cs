namespace INEEL.DataAccess.GEN.Migrations
{
    using System;
    using System.Data.Entity.Migrations;
    
    public partial class migracionCatalogosGEN : DbMigration
    {
        public override void Up()
        {
            //DropIndex("CR.cat_TipoOrganizacion", new[] { "Nombre" });
        }
        
        public override void Down()
        {
            //CreateIndex("CR.cat_TipoOrganizacion", "Nombre", unique: true);
        }
    }
}
