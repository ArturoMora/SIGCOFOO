namespace INEEL.DataAccess.GEN.MigrationsGI
{
    using System;
    using System.Data.Entity.Migrations;
    
    public partial class migprodEvaluadores : DbMigration
    {
        public override void Up()
        {
            CreateTable(
                "GI.tab_ProductoGIEvaluadores",
                c => new
                    {
                        Id = c.Int(nullable: false, identity: true),
                        ProductoGIId = c.Int(nullable: false),
                        MiembrosGIId = c.Int(nullable: false),
                        Comentarios = c.String(),
                        ClavePersona = c.String(),
                        ProductoGI_ProductoId = c.Int(),
                    })
                .PrimaryKey(t => t.Id)
                .ForeignKey("GI.cat_MiembrosGI", t => t.MiembrosGIId, cascadeDelete: true)
                .ForeignKey("GI.tab_Producto", t => t.ProductoGI_ProductoId)
                .Index(t => t.MiembrosGIId)
                .Index(t => t.ProductoGI_ProductoId);
            
        }
        
        public override void Down()
        {
            DropForeignKey("GI.tab_ProductoGIEvaluadores", "ProductoGI_ProductoId", "GI.tab_Producto");
            DropForeignKey("GI.tab_ProductoGIEvaluadores", "MiembrosGIId", "GI.cat_MiembrosGI");
            DropIndex("GI.tab_ProductoGIEvaluadores", new[] { "ProductoGI_ProductoId" });
            DropIndex("GI.tab_ProductoGIEvaluadores", new[] { "MiembrosGIId" });
            DropTable("GI.tab_ProductoGIEvaluadores");
        }
    }
}
