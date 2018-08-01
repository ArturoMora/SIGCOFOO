namespace INEEL.DataAccess.GEN.MigrationsGI
{
    using System;
    using System.Data.Entity.Migrations;
    
    public partial class migCorrecionEvaluadores2 : DbMigration
    {
        public override void Up()
        {
            AddColumn("GI.tab_ProductoGIEvaluadores", "ProductoGIId", c => c.Int(nullable: false));
            CreateIndex("GI.tab_ProductoGIEvaluadores", "ProductoGIId");
            AddForeignKey("GI.tab_ProductoGIEvaluadores", "ProductoGIId", "GI.tab_Producto", "ProductoId", cascadeDelete: true);
        }
        
        public override void Down()
        {
            DropForeignKey("GI.tab_ProductoGIEvaluadores", "ProductoGIId", "GI.tab_Producto");
            DropIndex("GI.tab_ProductoGIEvaluadores", new[] { "ProductoGIId" });
            DropColumn("GI.tab_ProductoGIEvaluadores", "ProductoGIId");
        }
    }
}
