namespace INEEL.DataAccess.GEN.Migrations
{
    using System;
    using System.Data.Entity.Migrations;
    
    public partial class BlackList : DbMigration
    {
        public override void Up()
        {
            CreateTable(
                "GEN.cat_OCcRolesBlackList",
                c => new
                    {
                        RolId = c.Int(nullable: false),
                        OcsId = c.String(nullable: false, maxLength: 100),
                    })
                .PrimaryKey(t => new { t.RolId, t.OcsId })
                .ForeignKey("GEN.cat_Ocs", t => t.OcsId, cascadeDelete: true)
                .ForeignKey("GEN.cat_Roles", t => t.RolId, cascadeDelete: true)
                .Index(t => t.RolId)
                .Index(t => t.OcsId);
            
        }
        
        public override void Down()
        {
            DropForeignKey("GEN.cat_OCcRolesBlackList", "RolId", "GEN.cat_Roles");
            DropForeignKey("GEN.cat_OCcRolesBlackList", "OcsId", "GEN.cat_Ocs");
            DropIndex("GEN.cat_OCcRolesBlackList", new[] { "OcsId" });
            DropIndex("GEN.cat_OCcRolesBlackList", new[] { "RolId" });
            DropTable("GEN.cat_OCcRolesBlackList");
        }
    }
}
