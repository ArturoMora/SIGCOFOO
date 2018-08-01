namespace INEEL.DataAccess.GEN.Migrations
{
    using System;
    using System.Data.Entity.Migrations;
    
    public partial class stringInformacionOCId : DbMigration
    {
        public override void Up()
        {
            AlterColumn("GEN.tab_SolicitudAcceso", "InformacionOCId", c => c.String());
        }
        
        public override void Down()
        {
            AlterColumn("GEN.tab_SolicitudAcceso", "InformacionOCId", c => c.Int(nullable: false));
        }
    }
}
