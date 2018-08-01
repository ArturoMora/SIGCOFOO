namespace INEEL.DataAccess.GEN.Migrations
{
    using System;
    using System.Data.Entity.Migrations;
    
    public partial class adrianbitacora : DbMigration
    {
        public override void Up()
        {
            CreateTable(
                "GEN.Catalogo",
                c => new
                    {
                        CatalogoId = c.Int(nullable: false, identity: true),
                        ClaveIdCatalogo = c.String(nullable: false, maxLength: 80),
                        nombre = c.String(nullable: false),
                        descripcion = c.String(),
                        estatus = c.String(nullable: false),
                    })
                .PrimaryKey(t => t.CatalogoId)
                .Index(t => t.ClaveIdCatalogo, unique: true);
            
            CreateTable(
                "GEN.Opcion",
                c => new
                    {
                        id = c.Int(nullable: false, identity: true),
                        catalogoId = c.Int(nullable: false),
                        etiqueta = c.String(nullable: false),
                        valor = c.String(nullable: false),
                        orden = c.Int(),
                    })
                .PrimaryKey(t => t.id)
                .ForeignKey("GEN.Catalogo", t => t.catalogoId, cascadeDelete: true)
                .Index(t => t.catalogoId);
            
            CreateTable(
                "GEN.Configuracion",
                c => new
                    {
                        id = c.Int(nullable: false, identity: true),
                        variable = c.String(nullable: false, maxLength: 80),
                        nombre = c.String(),
                        valor = c.String(nullable: false),
                        estatus = c.String(nullable: false),
                    })
                .PrimaryKey(t => t.id)
                .Index(t => t.variable, unique: true);
            
        }
        
        public override void Down()
        {
            DropForeignKey("GEN.Opcion", "catalogoId", "GEN.Catalogo");
            DropIndex("GEN.Configuracion", new[] { "variable" });
            DropIndex("GEN.Opcion", new[] { "catalogoId" });
            DropIndex("GEN.Catalogo", new[] { "ClaveIdCatalogo" });
            DropTable("GEN.Configuracion");
            DropTable("GEN.Opcion");
            DropTable("GEN.Catalogo");
        }
    }
}
