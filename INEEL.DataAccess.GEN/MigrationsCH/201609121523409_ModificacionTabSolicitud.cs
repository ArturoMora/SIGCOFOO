namespace INEEL.DataAccess.GEN.MigrationsCH
{
    using System;
    using System.Data.Entity.Migrations;
    
    public partial class ModificacionTabSolicitud : DbMigration
    {
        public override void Up()
        {
            AddColumn("CH.tab_Solicitud", "ClavePersonaAut", c => c.Int(nullable: false));
        }
        
        public override void Down()
        {
            DropColumn("CH.tab_Solicitud", "ClavePersonaAut");
        }
    }
}
