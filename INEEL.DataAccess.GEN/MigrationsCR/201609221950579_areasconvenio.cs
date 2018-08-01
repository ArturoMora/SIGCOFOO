namespace INEEL.DataAccess.GEN.MigrationsCR
{
    using System;
    using System.Data.Entity.Migrations;
    
    public partial class areasconvenio : DbMigration
    {
        public override void Up()
        {
            DropColumn("CR.tab_AreaConvenio", "ClaveUnidad");
        }
        
        public override void Down()
        {
            AddColumn("CR.tab_AreaConvenio", "ClaveUnidad", c => c.String(nullable: false, maxLength: 10));
        }
    }
}
