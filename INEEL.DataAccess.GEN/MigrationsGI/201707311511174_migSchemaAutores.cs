namespace INEEL.DataAccess.GEN.MigrationsGI
{
    using System;
    using System.Data.Entity.Migrations;
    
    public partial class migSchemaAutores : DbMigration
    {
        public override void Up()
        {
            RenameTable(name: "dbo.PlanNegocioEvolArchivos", newName: "tab_PlanNegocioEvolArchivos");
            MoveTable(name: "dbo.tab_PlanNegocioEvolArchivos", newSchema: "GI");
        }
        
        public override void Down()
        {
            MoveTable(name: "GI.tab_PlanNegocioEvolArchivos", newSchema: "dbo");
            RenameTable(name: "dbo.tab_PlanNegocioEvolArchivos", newName: "PlanNegocioEvolArchivos");
        }
    }
}
