namespace INEEL.DataAccess.GEN.MigrationsGI
{
    using System;
    using System.Data.Entity.Migrations;
    
    public partial class migFKdesdeArchivos : DbMigration
    {
        public override void Up()
        {
            DropForeignKey("GI.tab_PlanNegocioEvolArchivos", "PlanNegocioEvolutivo_PlanNegocioEvolutivoId", "GI.tab_PlanNegocioEvolutivo");
            DropIndex("GI.tab_PlanNegocioEvolArchivos", new[] { "PlanNegocioEvolutivo_PlanNegocioEvolutivoId" });
            RenameColumn(table: "GI.tab_PlanNegocioEvolArchivos", name: "PlanNegocioEvolutivo_PlanNegocioEvolutivoId", newName: "PlanNegocioEvolutivoId");
            AlterColumn("GI.tab_PlanNegocioEvolArchivos", "PlanNegocioEvolutivoId", c => c.Int(nullable: false));
            CreateIndex("GI.tab_PlanNegocioEvolArchivos", "PlanNegocioEvolutivoId");
            AddForeignKey("GI.tab_PlanNegocioEvolArchivos", "PlanNegocioEvolutivoId", "GI.tab_PlanNegocioEvolutivo", "PlanNegocioEvolutivoId", cascadeDelete: true);
        }
        
        public override void Down()
        {
            DropForeignKey("GI.tab_PlanNegocioEvolArchivos", "PlanNegocioEvolutivoId", "GI.tab_PlanNegocioEvolutivo");
            DropIndex("GI.tab_PlanNegocioEvolArchivos", new[] { "PlanNegocioEvolutivoId" });
            AlterColumn("GI.tab_PlanNegocioEvolArchivos", "PlanNegocioEvolutivoId", c => c.Int());
            RenameColumn(table: "GI.tab_PlanNegocioEvolArchivos", name: "PlanNegocioEvolutivoId", newName: "PlanNegocioEvolutivo_PlanNegocioEvolutivoId");
            CreateIndex("GI.tab_PlanNegocioEvolArchivos", "PlanNegocioEvolutivo_PlanNegocioEvolutivoId");
            AddForeignKey("GI.tab_PlanNegocioEvolArchivos", "PlanNegocioEvolutivo_PlanNegocioEvolutivoId", "GI.tab_PlanNegocioEvolutivo", "PlanNegocioEvolutivoId");
        }
    }
}
