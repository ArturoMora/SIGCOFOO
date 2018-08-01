namespace INEEL.DataAccess.GEN.MigrationsCR
{
    using System;
    using System.Data.Entity.Migrations;
    
    public partial class cambioDelCampoInvestigadorId : DbMigration
    {
        public override void Up()
        {
            AlterColumn("CR.tab_BitacoraON", "InvestigadorId", c => c.String());
        }
        
        public override void Down()
        {
            AlterColumn("CR.tab_BitacoraON", "InvestigadorId", c => c.Int(nullable: false));
        }
    }
}
