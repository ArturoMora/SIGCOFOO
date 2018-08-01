namespace INEEL.DataAccess.GEN.MigrationsCR
{
    using System;
    using System.Data.Entity.Migrations;
    
    public partial class QuitaContactoFondos : DbMigration
    {
        public override void Up()
        {
            DropForeignKey("CR.tab_FondoPrograma", "ContactoId", "CR.cat_Contactos");
            DropIndex("CR.tab_FondoPrograma", new[] { "ContactoId" });
        }
        
        public override void Down()
        {
            CreateIndex("CR.tab_FondoPrograma", "ContactoId");
            AddForeignKey("CR.tab_FondoPrograma", "ContactoId", "CR.cat_Contactos", "ContactoId");
        }
    }
}
