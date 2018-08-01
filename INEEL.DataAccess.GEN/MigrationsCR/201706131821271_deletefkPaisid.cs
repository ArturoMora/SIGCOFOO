namespace INEEL.DataAccess.GEN.MigrationsCR
{
    using System;
    using System.Data.Entity.Migrations;
    
    public partial class deletefkPaisid : DbMigration
    {
        public override void Up()
        {
            DropForeignKey("CR.tab_FuenteFinanciamiento", "PaisId", "CH.cat_Pais");
            DropIndex("CR.tab_FuenteFinanciamiento", new[] { "PaisId" });
        }
        
        public override void Down()
        {
            CreateIndex("CR.tab_FuenteFinanciamiento", "PaisId");
            AddForeignKey("CR.tab_FuenteFinanciamiento", "PaisId", "CH.cat_Pais", "PaisID");
        }
    }
}
