namespace INEEL.DataAccess.GEN.MigrationsCH
{
    using System;
    using System.Data.Entity.Migrations;
    
    public partial class informacionId2String : DbMigration
    {
        public override void Up()
        {
            AlterColumn("CH.tab_Solicitud", "InformacionId", c => c.String());
        }
        
        public override void Down()
        {
            AlterColumn("CH.tab_Solicitud", "InformacionId", c => c.Int(nullable: false));
        }
    }
}
