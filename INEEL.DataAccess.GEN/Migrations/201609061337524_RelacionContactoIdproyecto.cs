namespace INEEL.DataAccess.GEN.Migrations
{
    using System;
    using System.Data.Entity.Migrations;
    
    public partial class RelacionContactoIdproyecto : DbMigration
    {
        public override void Up()
        {
            AddColumn("GEN.Proyectos", "ContactoId", c => c.Int());
            CreateIndex("GEN.Proyectos", "ContactoId");
            AddForeignKey("GEN.Proyectos", "ContactoId", "CR.cat_Contactos", "ContactoId");
        }

        public override void Down()
        {
            DropForeignKey("GEN.Proyectos", "ContactoId", "CR.cat_Contactos");
            DropIndex("GEN.Proyectos", new[] { "ContactoId" });
            DropColumn("GEN.Proyectos", "ContactoId");
        }
    }
}
