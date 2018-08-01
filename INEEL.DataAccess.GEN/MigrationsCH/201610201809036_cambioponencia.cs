namespace INEEL.DataAccess.GEN.MigrationsCH
{
    using System;
    using System.Data.Entity.Migrations;
    
    public partial class cambioponencia : DbMigration
    {
        public override void Up()
        {
            AddColumn("CH.tab_Ponencia", "PaisID", c => c.Int());
            CreateIndex("CH.tab_Ponencia", "PaisID");
            AddForeignKey("CH.tab_Ponencia", "PaisID", "CH.cat_Pais", "PaisID");
            DropColumn("CH.tab_Ponencia", "LugarCongreso");
        }
        
        public override void Down()
        {
            AddColumn("CH.tab_Ponencia", "LugarCongreso", c => c.String(maxLength: 150));
            DropForeignKey("CH.tab_Ponencia", "PaisID", "CH.cat_Pais");
            DropIndex("CH.tab_Ponencia", new[] { "PaisID" });
            DropColumn("CH.tab_Ponencia", "PaisID");
        }
    }
}
