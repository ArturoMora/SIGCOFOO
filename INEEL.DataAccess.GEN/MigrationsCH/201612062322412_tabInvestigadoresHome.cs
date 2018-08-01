namespace INEEL.DataAccess.GEN.MigrationsCH
{
    using System;
    using System.Data.Entity.Migrations;
    
    public partial class tabInvestigadoresHome : DbMigration
    {
        public override void Up()
        {
            CreateTable(
                "CH.temp_InvestigadoresHome",
                c => new
                    {
                        InvestigadoresHomeId = c.Long(nullable: false, identity: true),
                        Fecha = c.DateTime(nullable: false),
                        GraficaJson = c.String(),
                    })
                .PrimaryKey(t => t.InvestigadoresHomeId);
            
        }
        
        public override void Down()
        {
            DropTable("CH.temp_InvestigadoresHome");
        }
    }
}
