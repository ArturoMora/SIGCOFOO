namespace INEEL.DataAccess.GEN.MigrationsCH
{
    using System;
    using System.Data.Entity.Migrations;
    
    public partial class BImodificacion : DbMigration
    {
        public override void Up()
        {
            AlterColumn("CH.tab_BecarioInterno", "FechaBaja", c => c.DateTime());
        }
        
        public override void Down()
        {
            AlterColumn("CH.tab_BecarioInterno", "FechaBaja", c => c.DateTime(nullable: false));
        }
    }
}
