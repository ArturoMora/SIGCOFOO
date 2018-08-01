namespace INEEL.DataAccess.GEN.MigrationsCR
{
    using System;
    using System.Data.Entity.Migrations;
    
    public partial class agregaTablaContactosPorAliados : DbMigration
    {
        public override void Up()
        {
            CreateTable(
                "CR.tab_ContactorPorAliados",
                c => new
                    {
                        id = c.Int(nullable: false, identity: true),
                        aliadoId = c.Int(nullable: false),
                        ContactoId = c.Int(),
                        fechaRegistro = c.DateTime(nullable: true),
                    })
                .PrimaryKey(t => t.id)
                .ForeignKey("CR.cat_Contactos", t => t.ContactoId)
                .Index(t => t.ContactoId);
            
        }
        
        public override void Down()
        {
            DropForeignKey("CR.tab_ContactorPorAliados", "ContactoId", "CR.cat_Contactos");
            DropIndex("CR.tab_ContactorPorAliados", new[] { "ContactoId" });
            DropTable("CR.tab_ContactorPorAliados");
        }
    }
}
