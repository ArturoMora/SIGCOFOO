namespace INEEL.DataAccess.GEN.Migrations
{
    using System;
    using System.Data.Entity.Migrations;
    
    public partial class addModuloOrigenIdRequired : DbMigration
    {
        public override void Up()
        {
            DropForeignKey("GEN.cat_Ocs", "ModuloOrigenId", "GEN.cat_Modulo");
            DropIndex("GEN.cat_Ocs", new[] { "ModuloOrigenId" });
            AlterColumn("GEN.cat_Ocs", "ModuloOrigenId", c => c.String(nullable: false, maxLength: 3));
            CreateIndex("GEN.cat_Ocs", "ModuloOrigenId");
            AddForeignKey("GEN.cat_Ocs", "ModuloOrigenId", "GEN.cat_Modulo", "ModuloId", cascadeDelete: false);
        }
        
        public override void Down()
        {
            DropForeignKey("GEN.cat_Ocs", "ModuloOrigenId", "GEN.cat_Modulo");
            DropIndex("GEN.cat_Ocs", new[] { "ModuloOrigenId" });
            AlterColumn("GEN.cat_Ocs", "ModuloOrigenId", c => c.String(maxLength: 3));
            CreateIndex("GEN.cat_Ocs", "ModuloOrigenId");
            AddForeignKey("GEN.cat_Ocs", "ModuloOrigenId", "GEN.cat_Modulo", "ModuloId");
        }
    }
}
