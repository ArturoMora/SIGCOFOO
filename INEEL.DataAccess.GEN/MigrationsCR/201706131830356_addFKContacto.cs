namespace INEEL.DataAccess.GEN.MigrationsCR
{
    using System;
    using System.Data.Entity.Migrations;
    
    public partial class addFKContacto : DbMigration
    {
        public override void Up()
        {
            AddColumn("CR.tab_FuenteFinanciamiento", "ContactoId", c => c.Int());
            CreateIndex("CR.tab_FuenteFinanciamiento", "ContactoId");
            AddForeignKey("CR.tab_FuenteFinanciamiento", "ContactoId", "CR.cat_Contactos", "ContactoId");
        }
        
        public override void Down()
        {
            DropForeignKey("CR.tab_FuenteFinanciamiento", "ContactoId", "CR.cat_Contactos");
            DropIndex("CR.tab_FuenteFinanciamiento", new[] { "ContactoId" });
            DropColumn("CR.tab_FuenteFinanciamiento", "ContactoId");
        }
    }
}
