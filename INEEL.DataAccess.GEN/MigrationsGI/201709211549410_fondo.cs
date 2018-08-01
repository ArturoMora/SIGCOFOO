namespace INEEL.DataAccess.GEN.MigrationsGI
{
    using System;
    using System.Data.Entity.Migrations;
    
    public partial class fondo : DbMigration
    {
        public override void Up()
        {
            AddColumn("GI.tab_Propuesta", "fondo", c => c.Int());
        }
        
        public override void Down()
        {
            DropColumn("GI.tab_Propuesta", "fondo");
        }
    }
}
