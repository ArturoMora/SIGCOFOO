namespace INEEL.DataAccess.GEN.MigrationsGI
{
    using System;
    using System.Data.Entity.Migrations;
    
    public partial class estadoPlan : DbMigration
    {
        public override void Up()
        {
            CreateIndex("GI.tab_PlanNegocioEvolutivo", "EstadoFlujoId");
            AddForeignKey("GI.tab_PlanNegocioEvolutivo", "EstadoFlujoId", "GEN.cat_EstadoFlujo", "EstadoFlujoId", cascadeDelete: false);
        }
        
        public override void Down()
        {
            DropForeignKey("GI.tab_PlanNegocioEvolutivo", "EstadoFlujoId", "GEN.cat_EstadoFlujo");
            DropIndex("GI.tab_PlanNegocioEvolutivo", new[] { "EstadoFlujoId" });
        }
    }
}
