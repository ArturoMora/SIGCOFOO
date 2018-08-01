namespace INEEL.DataAccess.GEN.MigrationsCR
{
    using System;
    using System.Data.Entity.Migrations;
    
    public partial class aliadosContacto : DbMigration
    {
        public override void Up()
        {
            AddColumn("CR.tab_Aliado", "ContactoId", c => c.Int(nullable: false));
            CreateIndex("CR.tab_Aliado", "ContactoId");
            AddForeignKey("CR.tab_Aliado", "ContactoId", "CR.cat_Contactos", "ContactoId", cascadeDelete: false);
        }
        
        public override void Down()
        {
            DropForeignKey("CR.tab_Aliado", "ContactoId", "CR.cat_Contactos");
            DropIndex("CR.tab_Aliado", new[] { "ContactoId" });
            DropColumn("CR.tab_Aliado", "ContactoId");
        }
    }
}
