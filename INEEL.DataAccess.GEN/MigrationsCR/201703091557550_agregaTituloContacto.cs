namespace INEEL.DataAccess.GEN.MigrationsCR
{
    using System;
    using System.Data.Entity.Migrations;
    
    public partial class agregaTituloContacto : DbMigration
    {
        public override void Up()
        {
            AddColumn("CR.cat_Contactos", "TituloId", c => c.Int());
            CreateIndex("CR.cat_Contactos", "TituloId");
            AddForeignKey("CR.cat_Contactos", "TituloId", "CR.cat_TituloPersona", "TituloId");
        }
        
        public override void Down()
        {
            DropForeignKey("CR.cat_Contactos", "TituloId", "CR.cat_TituloPersona");
            DropIndex("CR.cat_Contactos", new[] { "TituloId" });
            DropColumn("CR.cat_Contactos", "TituloId");
        }
    }
}
