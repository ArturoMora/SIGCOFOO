namespace INEEL.DataAccess.GEN.MigrationsCH
{
    using System;
    using System.Data.Entity.Migrations;
    
    public partial class claveUnidadSolicitudValidacionGerente : DbMigration
    {
        public override void Up()
        {
            AddColumn("CH.tab_Solicitud", "ClaveUnidadAut", c => c.String());
        }
        
        public override void Down()
        {
            DropColumn("CH.tab_Solicitud", "ClaveUnidadAut");
        }
    }
}
