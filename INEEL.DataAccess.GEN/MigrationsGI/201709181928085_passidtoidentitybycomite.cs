namespace INEEL.DataAccess.GEN.MigrationsGI
{
    using System;
    using System.Data.Entity.Migrations;
    
    public partial class passidtoidentitybycomite : DbMigration
    {
        public override void Up()
        {
            DropForeignKey("GI.cat_MiembrosGI", "ComiteGIId", "GI.cat_ComiteGI");
            DropPrimaryKey("GI.cat_ComiteGI");
            AlterColumn("GI.cat_ComiteGI", "Id", c => c.Int(nullable: false, identity: true));
            AddPrimaryKey("GI.cat_ComiteGI", "Id");
            AddForeignKey("GI.cat_MiembrosGI", "ComiteGIId", "GI.cat_ComiteGI", "Id", cascadeDelete: true);
        }
        
        public override void Down()
        {
            DropForeignKey("GI.cat_MiembrosGI", "ComiteGIId", "GI.cat_ComiteGI");
            DropPrimaryKey("GI.cat_ComiteGI");
            AlterColumn("GI.cat_ComiteGI", "Id", c => c.Int(nullable: false));
            AddPrimaryKey("GI.cat_ComiteGI", "Id");
            AddForeignKey("GI.cat_MiembrosGI", "ComiteGIId", "GI.cat_ComiteGI", "Id", cascadeDelete: true);
        }
    }
}
