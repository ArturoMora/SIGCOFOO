namespace INEEL.DataAccess.GEN.MigrationsCR
{
    using System;
    using System.Data.Entity.Migrations;
    
    public partial class competidorNuevosReg : DbMigration
    {
        public override void Up()
        {
            AddColumn("CR.tab_Competidor", "TipoAccesoVTC", c => c.String(maxLength: 20));
            AddColumn("CR.tab_Competidor", "ClaveUnidad", c => c.String());
        }
        
        public override void Down()
        {
            DropColumn("CR.tab_Competidor", "ClaveUnidad");
            DropColumn("CR.tab_Competidor", "TipoAccesoVTC");
        }
    }
}
