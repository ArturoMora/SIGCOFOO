namespace INEEL.DataAccess.GEN.MigrationsCH
{
    using System;
    using System.Data.Entity.Migrations;
    
    public partial class BEModificated : DbMigration
    {
        public override void Up()
        {
            RenameTable(name: "CH.BecarioExterno", newName: "tab_BecarioExterno");
        }
        
        public override void Down()
        {
            RenameTable(name: "CH.tab_BecarioExterno", newName: "BecarioExterno");
        }
    }
}
