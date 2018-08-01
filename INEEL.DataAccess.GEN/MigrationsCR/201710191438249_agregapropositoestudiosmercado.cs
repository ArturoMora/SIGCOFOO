namespace INEEL.DataAccess.GEN.MigrationsCR
{
    using System;
    using System.Data.Entity.Migrations;
    
    public partial class agregapropositoestudiosmercado : DbMigration
    {
        public override void Up()
        {
            AddColumn("CR.tab_EstudiosMercado", "proposito", c => c.String());
        }
        
        public override void Down()
        {
            DropColumn("CR.tab_EstudiosMercado", "proposito");
        }
    }
}
