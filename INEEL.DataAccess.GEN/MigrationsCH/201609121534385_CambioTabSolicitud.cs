namespace INEEL.DataAccess.GEN.MigrationsCH
{
    using System;
    using System.Data.Entity.Migrations;
    
    public partial class CambioTabSolicitud : DbMigration
    {
        public override void Up()
        {
            AlterColumn("CH.tab_Solicitud", "ClavePersonaAut", c => c.Int());
        }
        
        public override void Down()
        {
            AlterColumn("CH.tab_Solicitud", "ClavePersonaAut", c => c.Int(nullable: false));
        }
    }
}
