namespace INEEL.DataAccess.GEN.MigrationsMT
{
    using System;
    using System.Data.Entity.Migrations;
    
    public partial class RemoviendoTablasNoUsadas : DbMigration
    {
        public override void Up()
        {
            DropForeignKey("dbo.LibrosAutoresLibros", "LibrosAutores_Autor", "MT.LibrosAutores");
            DropForeignKey("dbo.LibrosAutoresLibros", "Libros_LibrosId", "MT.Libros");
            DropForeignKey("dbo.LibrosLibroDescriptores", "Libros_LibrosId", "MT.Libros");
            DropForeignKey("dbo.LibrosLibroDescriptores", "LibroDescriptores_Descriptor", "MT.LibroDescriptores");
            DropForeignKey("dbo.LibroInventariosLibros", "LibroInventarios_NoInventario", "MT.LibroInventarios");
            DropForeignKey("dbo.LibroInventariosLibros", "Libros_LibrosId", "MT.Libros");
            DropIndex("dbo.LibrosAutoresLibros", new[] { "LibrosAutores_Autor" });
            DropIndex("dbo.LibrosAutoresLibros", new[] { "Libros_LibrosId" });
            DropIndex("dbo.LibrosLibroDescriptores", new[] { "Libros_LibrosId" });
            DropIndex("dbo.LibrosLibroDescriptores", new[] { "LibroDescriptores_Descriptor" });
            DropIndex("dbo.LibroInventariosLibros", new[] { "LibroInventarios_NoInventario" });
            DropIndex("dbo.LibroInventariosLibros", new[] { "Libros_LibrosId" });
            AddColumn("MT.Capitulos", "Abstract", c => c.String());
            DropTable("MT.LibroDescriptores");
            DropTable("MT.LibrosAutores");
            DropTable("MT.LibroInventarios");
            DropTable("dbo.LibrosAutoresLibros");
            DropTable("dbo.LibrosLibroDescriptores");
            DropTable("dbo.LibroInventariosLibros");
        }
        
        public override void Down()
        {
            CreateTable(
                "dbo.LibroInventariosLibros",
                c => new
                    {
                        LibroInventarios_NoInventario = c.String(nullable: false, maxLength: 128),
                        Libros_LibrosId = c.String(nullable: false, maxLength: 128),
                    })
                .PrimaryKey(t => new { t.LibroInventarios_NoInventario, t.Libros_LibrosId });
            
            CreateTable(
                "dbo.LibrosLibroDescriptores",
                c => new
                    {
                        Libros_LibrosId = c.String(nullable: false, maxLength: 128),
                        LibroDescriptores_Descriptor = c.String(nullable: false, maxLength: 128),
                    })
                .PrimaryKey(t => new { t.Libros_LibrosId, t.LibroDescriptores_Descriptor });
            
            CreateTable(
                "dbo.LibrosAutoresLibros",
                c => new
                    {
                        LibrosAutores_Autor = c.String(nullable: false, maxLength: 150),
                        Libros_LibrosId = c.String(nullable: false, maxLength: 128),
                    })
                .PrimaryKey(t => new { t.LibrosAutores_Autor, t.Libros_LibrosId });
            
            CreateTable(
                "MT.LibroInventarios",
                c => new
                    {
                        NoInventario = c.String(nullable: false, maxLength: 128),
                    })
                .PrimaryKey(t => t.NoInventario);
            
            CreateTable(
                "MT.LibrosAutores",
                c => new
                    {
                        Autor = c.String(nullable: false, maxLength: 150),
                    })
                .PrimaryKey(t => t.Autor);
            
            CreateTable(
                "MT.LibroDescriptores",
                c => new
                    {
                        Descriptor = c.String(nullable: false, maxLength: 128),
                    })
                .PrimaryKey(t => t.Descriptor);
            
            DropColumn("MT.Capitulos", "Abstract");
            CreateIndex("dbo.LibroInventariosLibros", "Libros_LibrosId");
            CreateIndex("dbo.LibroInventariosLibros", "LibroInventarios_NoInventario");
            CreateIndex("dbo.LibrosLibroDescriptores", "LibroDescriptores_Descriptor");
            CreateIndex("dbo.LibrosLibroDescriptores", "Libros_LibrosId");
            CreateIndex("dbo.LibrosAutoresLibros", "Libros_LibrosId");
            CreateIndex("dbo.LibrosAutoresLibros", "LibrosAutores_Autor");
            AddForeignKey("dbo.LibroInventariosLibros", "Libros_LibrosId", "MT.Libros", "LibrosId", cascadeDelete: true);
            AddForeignKey("dbo.LibroInventariosLibros", "LibroInventarios_NoInventario", "MT.LibroInventarios", "NoInventario", cascadeDelete: true);
            AddForeignKey("dbo.LibrosLibroDescriptores", "LibroDescriptores_Descriptor", "MT.LibroDescriptores", "Descriptor", cascadeDelete: true);
            AddForeignKey("dbo.LibrosLibroDescriptores", "Libros_LibrosId", "MT.Libros", "LibrosId", cascadeDelete: true);
            AddForeignKey("dbo.LibrosAutoresLibros", "Libros_LibrosId", "MT.Libros", "LibrosId", cascadeDelete: true);
            AddForeignKey("dbo.LibrosAutoresLibros", "LibrosAutores_Autor", "MT.LibrosAutores", "Autor", cascadeDelete: true);
        }
    }
}
