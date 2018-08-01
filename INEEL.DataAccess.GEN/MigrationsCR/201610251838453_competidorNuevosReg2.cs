namespace INEEL.DataAccess.GEN.MigrationsCR
{
    using System;
    using System.Data.Entity.Migrations;
    
    public partial class competidorNuevosReg2 : DbMigration
    {
        public override void Up()
        {
            AddColumn("CR.tab_AdjuntoPorCompetidor", "Tarifa", c => c.Boolean(nullable: false));
            AddColumn("CR.tab_AdjuntoPorCompetidor", "VTC", c => c.Boolean(nullable: false));
        }
        
        public override void Down()
        {
            DropColumn("CR.tab_AdjuntoPorCompetidor", "VTC");
            DropColumn("CR.tab_AdjuntoPorCompetidor", "Tarifa");
        }
    }
}
