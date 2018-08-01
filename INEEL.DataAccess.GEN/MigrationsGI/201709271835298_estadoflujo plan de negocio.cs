namespace INEEL.DataAccess.GEN.MigrationsGI
{
    using System;
    using System.Data.Entity.Migrations;
    
    public partial class estadoflujoplandenegocio : DbMigration
    {
        public override void Up()
        {
            AddColumn("GI.tab_PlanNegocioEvolutivo", "EstadoFlujoId", c => c.Int(nullable: false));
        }
        
        public override void Down()
        {
            DropColumn("GI.tab_PlanNegocioEvolutivo", "EstadoFlujoId");
        }
    }
}
