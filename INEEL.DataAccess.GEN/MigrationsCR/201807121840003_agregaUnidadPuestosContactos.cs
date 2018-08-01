namespace INEEL.DataAccess.GEN.MigrationsCR
{
    using System;
    using System.Data.Entity.Migrations;
    
    public partial class agregaUnidadPuestosContactos : DbMigration
    {
        public override void Up()
        {
            AddColumn("CR.tab_ContactosPuesto", "ClaveUnidad", c => c.String());
            AddColumn("CR.cat_Empresas", "ContactoId", c => c.Int());
        }
        
        public override void Down()
        {
            DropColumn("CR.cat_Empresas", "ContactoId");
            DropColumn("CR.tab_ContactosPuesto", "ClaveUnidad");
        }
    }
}
