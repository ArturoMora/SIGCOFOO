namespace INEEL.DataAccess.GEN.MigrationsCR
{
    using System;
    using System.Data.Entity.Migrations;
    
    public partial class eliminaFKContactosEnAliados : DbMigration
    {
        public override void Up()
        {
            DropForeignKey("CR.tab_Aliado", "ContactoId", "CR.cat_Contactos");
            DropIndex("CR.tab_Aliado", new[] { "ContactoId" });
            AlterColumn("CR.tab_Aliado", "ContactoId", c => c.Int());
            CreateIndex("CR.tab_Aliado", "ContactoId");
            AddForeignKey("CR.tab_Aliado", "ContactoId", "CR.cat_Contactos", "ContactoId");
        }
        
        public override void Down()
        {
            DropForeignKey("CR.tab_Aliado", "ContactoId", "CR.cat_Contactos");
            DropIndex("CR.tab_Aliado", new[] { "ContactoId" });
            AlterColumn("CR.tab_Aliado", "ContactoId", c => c.Int(nullable: false));
            CreateIndex("CR.tab_Aliado", "ContactoId");
            AddForeignKey("CR.tab_Aliado", "ContactoId", "CR.cat_Contactos", "ContactoId", cascadeDelete: true);
        }
    }
}
