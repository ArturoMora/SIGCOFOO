namespace INEEL.DataAccess.GEN.MigrationsMT
{
    using System;
    using System.Data.Entity.Migrations;
    
    public partial class libros10oct : DbMigration
    {
        public override void Up()
        {
            CreateTable(
                "MT.LibroInventarios",
                c => new
                    {
                        NoInventario = c.String(nullable: false, maxLength: 128),
                    })
                .PrimaryKey(t => t.NoInventario);
            
            CreateTable(
                "dbo.LibroInventariosLibros",
                c => new
                    {
                        LibroInventarios_NoInventario = c.String(nullable: false, maxLength: 128),
                        Libros_LibrosId = c.String(nullable: false, maxLength: 128),
                    })
                .PrimaryKey(t => new { t.LibroInventarios_NoInventario, t.Libros_LibrosId })
                .ForeignKey("MT.LibroInventarios", t => t.LibroInventarios_NoInventario, cascadeDelete: true)
                .ForeignKey("MT.Libros", t => t.Libros_LibrosId, cascadeDelete: true)
                .Index(t => t.LibroInventarios_NoInventario)
                .Index(t => t.Libros_LibrosId);
            
            DropColumn("MT.Libros", "NoInventario");
        }
        
        public override void Down()
        {
            AddColumn("MT.Libros", "NoInventario", c => c.String());
            DropForeignKey("dbo.LibroInventariosLibros", "Libros_LibrosId", "MT.Libros");
            DropForeignKey("dbo.LibroInventariosLibros", "LibroInventarios_NoInventario", "MT.LibroInventarios");
            DropIndex("dbo.LibroInventariosLibros", new[] { "Libros_LibrosId" });
            DropIndex("dbo.LibroInventariosLibros", new[] { "LibroInventarios_NoInventario" });
            DropTable("dbo.LibroInventariosLibros");
            DropTable("MT.LibroInventarios");
        }
    }
}
