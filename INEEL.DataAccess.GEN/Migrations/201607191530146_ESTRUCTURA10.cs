namespace INEEL.DataAccess.GEN.Migrations
{
    using System;
    using System.Data.Entity.Migrations;
    
    public partial class ESTRUCTURA10 : DbMigration
    {
        public override void Up()
        {
            DropForeignKey("GEN.cat_Funciones", "IdModulo", "GEN.cat_Modulo");
            DropIndex("GEN.cat_Funciones", new[] { "IdModulo" });
            AlterColumn("GEN.cat_Funciones", "IdModulo", c => c.String(nullable: false, maxLength: 3));
            CreateIndex("GEN.cat_Funciones", "IdModulo");
            AddForeignKey("GEN.cat_Funciones", "IdModulo", "GEN.cat_Modulo", "ModuloId", cascadeDelete: true);
        }
        
        public override void Down()
        {
            DropForeignKey("GEN.cat_Funciones", "IdModulo", "GEN.cat_Modulo");
            DropIndex("GEN.cat_Funciones", new[] { "IdModulo" });
            AlterColumn("GEN.cat_Funciones", "IdModulo", c => c.String(maxLength: 3));
            CreateIndex("GEN.cat_Funciones", "IdModulo");
            AddForeignKey("GEN.cat_Funciones", "IdModulo", "GEN.cat_Modulo", "ModuloId");
        }
    }
}
