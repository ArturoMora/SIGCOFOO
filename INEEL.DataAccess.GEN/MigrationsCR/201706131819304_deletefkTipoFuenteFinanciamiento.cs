namespace INEEL.DataAccess.GEN.MigrationsCR
{
    using System;
    using System.Data.Entity.Migrations;
    
    public partial class deletefkTipoFuenteFinanciamiento : DbMigration
    {
        public override void Up()
        {
            DropForeignKey("CR.tab_FuenteFinanciamiento", "TipoFuenteFinanciamientoId", "CR.cat_TipoFuentesFinanciamiento");
            DropIndex("CR.tab_FuenteFinanciamiento", new[] { "TipoFuenteFinanciamientoId" });
        }
        
        public override void Down()
        {
            CreateIndex("CR.tab_FuenteFinanciamiento", "TipoFuenteFinanciamientoId");
            AddForeignKey("CR.tab_FuenteFinanciamiento", "TipoFuenteFinanciamientoId", "CR.cat_TipoFuentesFinanciamiento", "TipoFuenteFinanciamientoId");
        }
    }
}
