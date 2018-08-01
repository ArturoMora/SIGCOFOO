namespace INEEL.DataAccess.GEN.MigrationsGI
{
    using System;
    using System.Data.Entity.Migrations;
    
    public partial class migBitacoraFI : DbMigration
    {
        public override void Up()
        {
            CreateTable(
                "GI.tab_ProductoGIFactorInnovacion",
                c => new
                    {
                        Id = c.Int(nullable: false, identity: true),
                        ProductoId = c.Int(nullable: false),
                        Actor = c.String(),
                        FactorInnovacionId = c.Int(nullable: false),
                        Fecha = c.DateTime(nullable: false),
                    })
                .PrimaryKey(t => t.Id)
                .ForeignKey("GI.cat_FactorInnovacion", t => t.FactorInnovacionId)
                .ForeignKey("GI.tab_Producto", t => t.ProductoId, cascadeDelete: true)
                .Index(t => t.ProductoId)
                .Index(t => t.FactorInnovacionId);
            
        }
        
        public override void Down()
        {
            DropForeignKey("GI.tab_ProductoGIFactorInnovacion", "ProductoId", "GI.tab_Producto");
            DropForeignKey("GI.tab_ProductoGIFactorInnovacion", "FactorInnovacionId", "GI.cat_FactorInnovacion");
            DropIndex("GI.tab_ProductoGIFactorInnovacion", new[] { "FactorInnovacionId" });
            DropIndex("GI.tab_ProductoGIFactorInnovacion", new[] { "ProductoId" });
            DropTable("GI.tab_ProductoGIFactorInnovacion");
        }
    }
}
