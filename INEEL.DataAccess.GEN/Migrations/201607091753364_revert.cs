namespace INEEL.DataAccess.GEN.Migrations
{
    using System;
    using System.Data.Entity.Migrations;
    
    public partial class revert : DbMigration
    {
        public override void Up()
        {
            DropForeignKey("GEN.Productos", "CategoriaId", "GEN.Categorias");
            DropIndex("GEN.Productos", new[] { "CategoriaId" });
            DropTable("GEN.Categorias");
            DropTable("GEN.Productos");
        }
        
        public override void Down()
        {
            CreateTable(
                "GEN.Productos",
                c => new
                    {
                        ProductoId = c.Int(nullable: false, identity: true),
                        Nombre = c.String(nullable: false, maxLength: 90),
                        Descripcion = c.String(maxLength: 100),
                        CategoriaId = c.Int(nullable: false),
                    })
                .PrimaryKey(t => t.ProductoId);
            
            CreateTable(
                "GEN.Categorias",
                c => new
                    {
                        CategoriaId = c.Int(nullable: false, identity: true),
                        Nombre = c.String(maxLength: 100),
                        Descripcion = c.String(maxLength: 200),
                    })
                .PrimaryKey(t => t.CategoriaId);
            
            CreateIndex("GEN.Productos", "CategoriaId");
            AddForeignKey("GEN.Productos", "CategoriaId", "GEN.Categorias", "CategoriaId", cascadeDelete: true);
        }
    }
}
