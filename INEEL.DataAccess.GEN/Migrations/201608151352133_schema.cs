namespace INEEL.DataAccess.GEN.Migrations
{
    using System;
    using System.Data.Entity.Migrations;
    
    public partial class schema : DbMigration
    {
        public override void Up()
        {
            MoveTable(name: "dbo.Vocabulario", newSchema: "GEN");
        }
        
        public override void Down()
        {
            MoveTable(name: "GEN.Vocabulario", newSchema: "dbo");
        }
    }
}
