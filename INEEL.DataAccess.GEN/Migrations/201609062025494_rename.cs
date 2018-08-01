namespace INEEL.DataAccess.GEN.Migrations
{
    using System;
    using System.Data.Entity.Migrations;
    
    public partial class rename : DbMigration
    {
        public override void Up()
        {
            RenameTable(name: "dbo.BitacoraSolicitudes", newName: "tab_BitacoraSolicitudes");
            MoveTable(name: "dbo.tab_BitacoraSolicitudes", newSchema: "GEN");
        }
        
        public override void Down()
        {
            MoveTable(name: "GEN.tab_BitacoraSolicitudes", newSchema: "dbo");
            RenameTable(name: "dbo.tab_BitacoraSolicitudes", newName: "BitacoraSolicitudes");
        }
    }
}
