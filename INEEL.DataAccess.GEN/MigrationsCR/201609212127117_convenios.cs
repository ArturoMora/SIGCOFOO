namespace INEEL.DataAccess.GEN.MigrationsCR
{
    using System;
    using System.Data.Entity.Migrations;
    
    public partial class convenios : DbMigration
    {
        public override void Up()
        {
            AddColumn("CR.tab_AreaConvenio", "ClaveUnidad", c => c.String(nullable: false, maxLength: 10));
            AlterColumn("CR.tab_AreaConvenio", "Autor", c => c.String(maxLength: 250));
        }
        
        public override void Down()
        {
            AlterColumn("CR.tab_AreaConvenio", "Autor", c => c.String(nullable: false, maxLength: 250));
            DropColumn("CR.tab_AreaConvenio", "ClaveUnidad");
        }
    }
}
