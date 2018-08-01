namespace INEEL.DataAccess.GEN.MigrationsCR
{
    using System;
    using System.Data.Entity.Migrations;
    
    public partial class sigproy : DbMigration
    {
        public override void Up()
        {
            AddColumn("CR.tab_FuenteFinanciamiento", "OrigenDatos", c => c.String(maxLength: 20));
        }
        
        public override void Down()
        {
            DropColumn("CR.tab_FuenteFinanciamiento", "OrigenDatos");
        }
    }
}
