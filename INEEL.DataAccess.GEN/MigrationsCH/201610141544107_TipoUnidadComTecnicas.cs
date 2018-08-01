namespace INEEL.DataAccess.GEN.MigrationsCH
{
    using System;
    using System.Data.Entity.Migrations;
    
    public partial class TipoUnidadComTecnicas : DbMigration
    {
        public override void Up()
        {
            AddColumn("CH.tab_FamiliaUnidad", "TipoAreaId", c => c.Int());
            CreateIndex("CH.tab_FamiliaUnidad", "TipoAreaId");
            AddForeignKey("CH.tab_FamiliaUnidad", "TipoAreaId", "CH.cat_TipoArea", "TipoAreaId");
        }
        
        public override void Down()
        {
            DropForeignKey("CH.tab_FamiliaUnidad", "TipoAreaId", "CH.cat_TipoArea");
            DropIndex("CH.tab_FamiliaUnidad", new[] { "TipoAreaId" });
            DropColumn("CH.tab_FamiliaUnidad", "TipoAreaId");
        }
    }
}
