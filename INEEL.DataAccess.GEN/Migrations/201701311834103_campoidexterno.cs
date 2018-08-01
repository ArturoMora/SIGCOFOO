namespace INEEL.DataAccess.GEN.Migrations
{
    using System;
    using System.Data.Entity.Migrations;
    
    public partial class campoidexterno : DbMigration
    {
        public override void Up()
        {
            AddColumn("GEN.NuevoOC", "IdExterno", c => c.String());
        }
        
        public override void Down()
        {
            DropColumn("GEN.NuevoOC", "IdExterno");
        }
    }
}
