namespace INEEL.DataAccess.GEN.Migrations
{
    using System;
    using System.Data.Entity.Migrations;
    
    public partial class NuevoOcs : DbMigration
    {
        public override void Up()
        {
            CreateTable(
                "GEN.NuevoOC",
                c => new
                    {
                        NuevoOCId = c.Long(nullable: false, identity: true),
                        descripcion = c.String(),
                        ModuloId = c.String(maxLength: 3),
                        OcsId = c.String(maxLength: 100),
                        FechaRegistro = c.DateTime(nullable: false),
                        nuevo = c.Boolean(nullable: false),
                    })
                .PrimaryKey(t => t.NuevoOCId)
                .ForeignKey("GEN.cat_Modulo", t => t.ModuloId)
                .ForeignKey("GEN.cat_Ocs", t => t.OcsId)
                .Index(t => t.ModuloId)
                .Index(t => t.OcsId);
            
            CreateTable(
                "GEN.cat_Ocs",
                c => new
                    {
                        OcsId = c.String(nullable: false, maxLength: 100),
                    })
                .PrimaryKey(t => t.OcsId);
            
        }
        
        public override void Down()
        {
            DropForeignKey("GEN.NuevoOC", "OcsId", "GEN.cat_Ocs");
            DropForeignKey("GEN.NuevoOC", "ModuloId", "GEN.cat_Modulo");
            DropIndex("GEN.NuevoOC", new[] { "OcsId" });
            DropIndex("GEN.NuevoOC", new[] { "ModuloId" });
            DropTable("GEN.cat_Ocs");
            DropTable("GEN.NuevoOC");
        }
    }
}
