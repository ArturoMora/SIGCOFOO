namespace INEEL.DataAccess.GEN.MigrationsGI
{
    using System;
    using System.Data.Entity.Migrations;
    
    public partial class ModificaPKCatalogoComite : DbMigration
    {
        public override void Up()
        {
            DropForeignKey("GI.cat_MiembrosGI", "ComiteGIId", "GI.cat_ComiteGI");
            DropIndex("GI.cat_MiembrosGI", new[] { "ComiteGIId" });
            DropPrimaryKey("GI.cat_ComiteGI");
            AddColumn("GI.cat_ComiteGI", "comiteId", c => c.Int(nullable: false, identity: true));
            AddColumn("GI.cat_MiembrosGI", "ComiteGI_comiteId", c => c.Int());
            AlterColumn("GI.cat_ComiteGI", "Id", c => c.Int(nullable: true));
            AddPrimaryKey("GI.cat_ComiteGI", "comiteId");
            CreateIndex("GI.cat_MiembrosGI", "ComiteGI_comiteId");
            AddForeignKey("GI.cat_MiembrosGI", "ComiteGI_comiteId", "GI.cat_ComiteGI", "comiteId");
        }
        
        public override void Down()
        {
            DropForeignKey("GI.cat_MiembrosGI", "ComiteGI_comiteId", "GI.cat_ComiteGI");
            DropIndex("GI.cat_MiembrosGI", new[] { "ComiteGI_comiteId" });
            DropPrimaryKey("GI.cat_ComiteGI");
            AlterColumn("GI.cat_ComiteGI", "Id", c => c.Int(nullable: false, identity: true));
            DropColumn("GI.cat_MiembrosGI", "ComiteGI_comiteId");
            DropColumn("GI.cat_ComiteGI", "comiteId");
            AddPrimaryKey("GI.cat_ComiteGI", "Id");
            CreateIndex("GI.cat_MiembrosGI", "ComiteGIId");
            AddForeignKey("GI.cat_MiembrosGI", "ComiteGIId", "GI.cat_ComiteGI", "Id", cascadeDelete: true);
        }
    }
}
