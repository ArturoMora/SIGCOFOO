namespace INEEL.DataAccess.GEN.MigrationsGI
{
    using System;
    using System.Data.Entity.Migrations;
    
    public partial class cambiaTipoDatoClavePropuestaTablaPNE : DbMigration
    {
        public override void Up()
        {
            DropForeignKey("GI.tab_PlanNegocioEvolutivo", "PropuestaClave", "GI.tab_Propuesta");
            DropIndex("GI.tab_PlanNegocioEvolutivo", new[] { "PropuestaClave" });
            AlterColumn("GI.tab_PlanNegocioEvolutivo", "PropuestaClave", c => c.Int(nullable: false));
            CreateIndex("GI.tab_PlanNegocioEvolutivo", "PropuestaClave");
            AddForeignKey("GI.tab_PlanNegocioEvolutivo", "PropuestaClave", "GI.tab_Propuesta", "Id", cascadeDelete: false);
        }
        
        public override void Down()
        {
            DropForeignKey("GI.tab_PlanNegocioEvolutivo", "PropuestaClave", "GI.tab_Propuesta");
            DropIndex("GI.tab_PlanNegocioEvolutivo", new[] { "PropuestaClave" });
            AlterColumn("GI.tab_PlanNegocioEvolutivo", "PropuestaClave", c => c.Int());
            CreateIndex("GI.tab_PlanNegocioEvolutivo", "PropuestaClave");
            AddForeignKey("GI.tab_PlanNegocioEvolutivo", "PropuestaClave", "GI.tab_Propuesta", "Id");
        }
    }
}
