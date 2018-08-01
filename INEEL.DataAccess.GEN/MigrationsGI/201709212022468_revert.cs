namespace INEEL.DataAccess.GEN.MigrationsGI
{
    using System;
    using System.Data.Entity.Migrations;
    
    public partial class revert : DbMigration
    {
        public override void Up()
        {
           // DropColumn("GI.tab_Propuesta", "PlanNegocioEvolutivoId");
        }
        
        public override void Down()
        {
           // AddColumn("GI.tab_Propuesta", "PlanNegocioEvolutivoId", c => c.Int(nullable: false));
        }
    }
}
