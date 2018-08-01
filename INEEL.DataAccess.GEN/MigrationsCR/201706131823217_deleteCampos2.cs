namespace INEEL.DataAccess.GEN.MigrationsCR
{
    using System;
    using System.Data.Entity.Migrations;
    
    public partial class deleteCampos2 : DbMigration
    {
        public override void Up()
        {
            DropColumn("CR.tab_FuenteFinanciamiento", "TipoFuenteFinanciamientoId");
            DropColumn("CR.tab_FuenteFinanciamiento", "PaisId");
        }
        
        public override void Down()
        {
            AddColumn("CR.tab_FuenteFinanciamiento", "PaisId", c => c.Int());
            AddColumn("CR.tab_FuenteFinanciamiento", "TipoFuenteFinanciamientoId", c => c.Int());
        }
    }
}
