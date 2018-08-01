namespace INEEL.DataAccess.GEN.MigrationsCR
{
    using System;
    using System.Data.Entity.Migrations;
    
    public partial class nombreTBL : DbMigration
    {
        public override void Up()
        {
            RenameTable(name: "dbo.EstadoON", newName: "tab_EstadoON");
            MoveTable(name: "dbo.tab_EstadoON", newSchema: "CR");
        }
        
        public override void Down()
        {
            MoveTable(name: "CR.tab_EstadoON", newSchema: "dbo");
            RenameTable(name: "dbo.tab_EstadoON", newName: "EstadoON");
        }
    }
}
