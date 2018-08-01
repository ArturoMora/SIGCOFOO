namespace INEEL.DataAccess.GEN.MigrationsCR
{
    using System;
    using System.Data.Entity.Migrations;
    
    public partial class agregaColumnaTablaCompetidor : DbMigration
    {
        public override void Up()
        {
            AddColumn("CR.tab_Competidor", "TipoAccesoTarifas", c => c.String());
        }
        
        public override void Down()
        {
            DropColumn("CR.tab_Competidor", "TipoAccesoTarifas");
        }
    }
}
