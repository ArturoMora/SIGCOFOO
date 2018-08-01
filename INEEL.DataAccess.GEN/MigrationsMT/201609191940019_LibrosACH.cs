namespace INEEL.DataAccess.GEN.MigrationsMT
{
    using System;
    using System.Data.Entity.Migrations;
    
    public partial class LibrosACH : DbMigration
    {
        public override void Up()
        {
            CreateTable(
                "MT.LibroDescriptores",
                c => new
                    {
                        Descriptor = c.String(nullable: false, maxLength: 128),
                    })
                .PrimaryKey(t => t.Descriptor);
            
            CreateTable(
                "MT.Libros",
                c => new
                    {
                        LibrosId = c.String(nullable: false, maxLength: 128),
                        Clasificacion = c.String(),
                        Titulo = c.String(),
                        PieImprenta = c.String(),
                        NoInventario = c.String(),
                        TipoMaterial = c.String(),
                        ISBN = c.String(),
                        Serie = c.String(),
                    })
                .PrimaryKey(t => t.LibrosId);
            
            CreateTable(
                "MT.LibrosAutores",
                c => new
                    {
                        Autor = c.String(nullable: false, maxLength: 150),
                    })
                .PrimaryKey(t => t.Autor);
            
            CreateTable(
                "dbo.LibrosAutoresLibros",
                c => new
                    {
                        LibrosAutores_Autor = c.String(nullable: false, maxLength: 150),
                        Libros_LibrosId = c.String(nullable: false, maxLength: 128),
                    })
                .PrimaryKey(t => new { t.LibrosAutores_Autor, t.Libros_LibrosId })
                .ForeignKey("MT.LibrosAutores", t => t.LibrosAutores_Autor, cascadeDelete: true)
                .ForeignKey("MT.Libros", t => t.Libros_LibrosId, cascadeDelete: true)
                .Index(t => t.LibrosAutores_Autor)
                .Index(t => t.Libros_LibrosId);
            
            CreateTable(
                "dbo.LibrosLibroDescriptores",
                c => new
                    {
                        Libros_LibrosId = c.String(nullable: false, maxLength: 128),
                        LibroDescriptores_Descriptor = c.String(nullable: false, maxLength: 128),
                    })
                .PrimaryKey(t => new { t.Libros_LibrosId, t.LibroDescriptores_Descriptor })
                .ForeignKey("MT.Libros", t => t.Libros_LibrosId, cascadeDelete: true)
                .ForeignKey("MT.LibroDescriptores", t => t.LibroDescriptores_Descriptor, cascadeDelete: true)
                .Index(t => t.Libros_LibrosId)
                .Index(t => t.LibroDescriptores_Descriptor);
            
        }
        
        public override void Down()
        {
            DropForeignKey("dbo.LibrosLibroDescriptores", "LibroDescriptores_Descriptor", "MT.LibroDescriptores");
            DropForeignKey("dbo.LibrosLibroDescriptores", "Libros_LibrosId", "MT.Libros");
            DropForeignKey("dbo.LibrosAutoresLibros", "Libros_LibrosId", "MT.Libros");
            DropForeignKey("dbo.LibrosAutoresLibros", "LibrosAutores_Autor", "MT.LibrosAutores");
            DropIndex("dbo.LibrosLibroDescriptores", new[] { "LibroDescriptores_Descriptor" });
            DropIndex("dbo.LibrosLibroDescriptores", new[] { "Libros_LibrosId" });
            DropIndex("dbo.LibrosAutoresLibros", new[] { "Libros_LibrosId" });
            DropIndex("dbo.LibrosAutoresLibros", new[] { "LibrosAutores_Autor" });
            DropTable("dbo.LibrosLibroDescriptores");
            DropTable("dbo.LibrosAutoresLibros");
            DropTable("MT.LibrosAutores");
            DropTable("MT.Libros");
            DropTable("MT.LibroDescriptores");
        }
    }
}
