namespace INEEL.DataAccess.GEN.MigrationsGI
{
    using System;
    using System.Data.Entity.Migrations;
    
    public partial class migSchemaGI : DbMigration
    {
        public override void Up()
        {
            RenameTable(name: "dbo.Propuesta", newName: "tab_Propuesta");
            MoveTable(name: "dbo.tab_Propuesta", newSchema: "GI");
        }
        
        public override void Down()
        {
            MoveTable(name: "GI.tab_Propuesta", newSchema: "dbo");
            RenameTable(name: "dbo.tab_Propuesta", newName: "Propuesta");
        }
    }
}
