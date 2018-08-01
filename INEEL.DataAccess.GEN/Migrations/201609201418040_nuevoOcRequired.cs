namespace INEEL.DataAccess.GEN.Migrations
{
    using System;
    using System.Data.Entity.Migrations;
    
    public partial class nuevoOcRequired : DbMigration
    {
        public override void Up()
        {
            DropForeignKey("GEN.NuevoOC", "ModuloId", "GEN.cat_Modulo");
            DropForeignKey("GEN.NuevoOC", "OcsId", "GEN.cat_Ocs");
            DropIndex("GEN.NuevoOC", new[] { "ModuloId" });
            DropIndex("GEN.NuevoOC", new[] { "OcsId" });
            AlterColumn("GEN.NuevoOC", "descripcion", c => c.String(nullable: false));
            AlterColumn("GEN.NuevoOC", "ModuloId", c => c.String(nullable: false, maxLength: 3));
            AlterColumn("GEN.NuevoOC", "OcsId", c => c.String(nullable: false, maxLength: 100));
            CreateIndex("GEN.NuevoOC", "ModuloId");
            CreateIndex("GEN.NuevoOC", "OcsId");
            AddForeignKey("GEN.NuevoOC", "ModuloId", "GEN.cat_Modulo", "ModuloId", cascadeDelete: true);
            AddForeignKey("GEN.NuevoOC", "OcsId", "GEN.cat_Ocs", "OcsId", cascadeDelete: true);
        }
        
        public override void Down()
        {
            DropForeignKey("GEN.NuevoOC", "OcsId", "GEN.cat_Ocs");
            DropForeignKey("GEN.NuevoOC", "ModuloId", "GEN.cat_Modulo");
            DropIndex("GEN.NuevoOC", new[] { "OcsId" });
            DropIndex("GEN.NuevoOC", new[] { "ModuloId" });
            AlterColumn("GEN.NuevoOC", "OcsId", c => c.String(maxLength: 100));
            AlterColumn("GEN.NuevoOC", "ModuloId", c => c.String(maxLength: 3));
            AlterColumn("GEN.NuevoOC", "descripcion", c => c.String());
            CreateIndex("GEN.NuevoOC", "OcsId");
            CreateIndex("GEN.NuevoOC", "ModuloId");
            AddForeignKey("GEN.NuevoOC", "OcsId", "GEN.cat_Ocs", "OcsId");
            AddForeignKey("GEN.NuevoOC", "ModuloId", "GEN.cat_Modulo", "ModuloId");
        }
    }
}
