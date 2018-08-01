namespace INEEL.DataAccess.GEN.MigrationsCR
{
    using System;
    using System.Data.Entity.Migrations;
    
    public partial class AgregarTipoConvocatoria : DbMigration
    {
        public override void Up()
        {
            AddColumn("CR.tab_Convocatoria", "TipoFuenteFinanciamientoId", c => c.Int());
            CreateIndex("CR.tab_Convocatoria", "TipoFuenteFinanciamientoId");
            AddForeignKey("CR.tab_Convocatoria", "TipoFuenteFinanciamientoId", "CR.cat_TipoFuentesFinanciamiento", "TipoFuenteFinanciamientoId");
        }
        
        public override void Down()
        {
            DropForeignKey("CR.tab_Convocatoria", "TipoFuenteFinanciamientoId", "CR.cat_TipoFuentesFinanciamiento");
            DropIndex("CR.tab_Convocatoria", new[] { "TipoFuenteFinanciamientoId" });
            DropColumn("CR.tab_Convocatoria", "TipoFuenteFinanciamientoId");
        }
    }
}
