namespace INEEL.DataAccess.GEN.Migrations
{
    using System;
    using System.Data.Entity.Migrations;
    
    public partial class MigracionJWIR18JUL : DbMigration
    {
        public override void Up()
        {
            CreateTable(
                "GEN.cat_PlazaTrabajo",
                c => new
                    {
                        PlazaId = c.Int(nullable: false, identity: true),
                        Descripcion = c.String(maxLength: 100),
                        Estado = c.Int(nullable: false),
                        FechaEfectiva = c.DateTime(nullable: false),
                    })
                .PrimaryKey(t => t.PlazaId);
            
            AddColumn("GEN.cat_Personas", "IdPlaza", c => c.Int(nullable: false));
            CreateIndex("GEN.cat_Personas", "IdPlaza");
            AddForeignKey("GEN.cat_Personas", "IdPlaza", "GEN.cat_PlazaTrabajo", "PlazaId", cascadeDelete: true);
            DropColumn("GEN.cat_Personas", "Plaza");
        }
        
        public override void Down()
        {
            AddColumn("GEN.cat_Personas", "Plaza", c => c.String(maxLength: 10));
            DropForeignKey("GEN.cat_Personas", "IdPlaza", "GEN.cat_PlazaTrabajo");
            DropIndex("GEN.cat_Personas", new[] { "IdPlaza" });
            DropColumn("GEN.cat_Personas", "IdPlaza");
            DropTable("GEN.cat_PlazaTrabajo");
        }
    }
}
