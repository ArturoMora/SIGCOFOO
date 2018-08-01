namespace INEEL.DataAccess.GEN.Migrations
{
    using System;
    using System.Data.Entity.Migrations;
    
    public partial class ESTRUCTURA09 : DbMigration
    {
        public override void Up()
        {
            DropIndex("GEN.cat_Funciones", new[] { "IdPadre" });
            AlterColumn("GEN.cat_Funciones", "IdPadre", c => c.Int());
            CreateIndex("GEN.cat_Funciones", "IdPadre");
        }
        
        public override void Down()
        {
            DropIndex("GEN.cat_Funciones", new[] { "IdPadre" });
            AlterColumn("GEN.cat_Funciones", "IdPadre", c => c.Int(nullable: false));
            CreateIndex("GEN.cat_Funciones", "IdPadre");
        }
    }
}
