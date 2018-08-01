namespace INEEL.DataAccess.GEN.MigrationsCR
{
    using System;
    using System.Data.Entity.Migrations;
    
    public partial class CCompetidor2 : DbMigration
    {
        public override void Up()
        {
            DropForeignKey("CR.tab_ProductoPorProveedor", "ProductoId", "CR.cat_Producto");
            DropIndex("CR.tab_ProductoPorProveedor", new[] { "ProductoId" });
            DropColumn("CR.tab_ProductoPorProveedor", "ProductoId");
        }
        
        public override void Down()
        {
            AddColumn("CR.tab_ProductoPorProveedor", "ProductoId", c => c.Int(nullable: false));
            CreateIndex("CR.tab_ProductoPorProveedor", "ProductoId");
            AddForeignKey("CR.tab_ProductoPorProveedor", "ProductoId", "CR.cat_Producto", "ProductoId", cascadeDelete: true);
        }
    }
}
