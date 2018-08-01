namespace INEEL.DataAccess.GEN.Migrations
{
    using System;
    using System.Data.Entity.Migrations;
    
    public partial class va : DbMigration
    {
        public override void Up()
        {
            //MoveTable(name: "dbo.Iniciativas", newSchema: "GEN");
            //MoveTable(name: "dbo.Propuestas", newSchema: "GEN");
        }
        
        public override void Down()
        {
            //MoveTable(name: "GEN.Propuestas", newSchema: "dbo");
            //MoveTable(name: "GEN.Iniciativas", newSchema: "dbo");
        }
    }
}
