namespace INEEL.DataAccess.GEN.Migrations
{
    using System;
    using System.Data.Entity.Migrations;
    
    public partial class addModuloOrigenId : DbMigration
    {
        public override void Up()
        {
            AddColumn("GEN.cat_Ocs", "ModuloOrigenId", c => c.String(maxLength: 3));
            CreateIndex("GEN.cat_Ocs", "ModuloOrigenId");
            AddForeignKey("GEN.cat_Ocs", "ModuloOrigenId", "GEN.cat_Modulo", "ModuloId");
        }
        
        public override void Down()
        {
            DropForeignKey("GEN.cat_Ocs", "ModuloOrigenId", "GEN.cat_Modulo");
            DropIndex("GEN.cat_Ocs", new[] { "ModuloOrigenId" });
            DropColumn("GEN.cat_Ocs", "ModuloOrigenId");
        }
    }
}
