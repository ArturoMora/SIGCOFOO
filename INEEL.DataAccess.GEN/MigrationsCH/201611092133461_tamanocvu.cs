namespace INEEL.DataAccess.GEN.MigrationsCH
{
    using System;
    using System.Data.Entity.Migrations;
    
    public partial class tamanocvu : DbMigration
    {
        public override void Up()
        {
            AlterColumn("CH.tab_SNI", "numeroCVU", c => c.String(maxLength: 30));
        }
        
        public override void Down()
        {
            AlterColumn("CH.tab_SNI", "numeroCVU", c => c.String(maxLength: 10));
        }
    }
}
