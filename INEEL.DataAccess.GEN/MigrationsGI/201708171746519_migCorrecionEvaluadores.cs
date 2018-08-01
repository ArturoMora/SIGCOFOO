namespace INEEL.DataAccess.GEN.MigrationsGI
{
    using System;
    using System.Data.Entity.Migrations;
    
    public partial class migCorrecionEvaluadores : DbMigration
    {
        public override void Up()
        {
            DropForeignKey("GI.tab_ProductoGIEvaluadores", "ProductoGI_ProductoId", "GI.tab_Producto");
            DropIndex("GI.tab_ProductoGIEvaluadores", new[] { "ProductoGI_ProductoId" });
            DropColumn("GI.tab_ProductoGIEvaluadores", "ProductoGIId");
            DropColumn("GI.tab_ProductoGIEvaluadores", "ProductoGI_ProductoId");
        }
        
        public override void Down()
        {
            AddColumn("GI.tab_ProductoGIEvaluadores", "ProductoGI_ProductoId", c => c.Int());
            AddColumn("GI.tab_ProductoGIEvaluadores", "ProductoGIId", c => c.Int(nullable: false));
            CreateIndex("GI.tab_ProductoGIEvaluadores", "ProductoGI_ProductoId");
            AddForeignKey("GI.tab_ProductoGIEvaluadores", "ProductoGI_ProductoId", "GI.tab_Producto", "ProductoId");
        }
    }
}
