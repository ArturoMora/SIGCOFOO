namespace INEEL.DataAccess.GEN.MigrationsCR
{
    using System;
    using System.Data.Entity.Migrations;
    
    public partial class campoFechaON : DbMigration
    {
        public override void Up()
        {
            AddColumn("CR.tab_BitacoraON", "FechaRegistro", c => c.DateTime(nullable: false));
        }
        
        public override void Down()
        {
            DropColumn("CR.tab_BitacoraON", "FechaRegistro");
        }
    }
}
