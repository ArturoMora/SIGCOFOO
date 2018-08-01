namespace INEEL.DataAccess.GEN.MigrationsCH
{
    using System;
    using System.Data.Entity.Migrations;
    
    public partial class numerolargo : DbMigration
    {
        public override void Up()
        {
            AlterColumn("CH.tab_SNI", "numeroExpediente", c => c.String(maxLength: 30));
        }
        
        public override void Down()
        {
            AlterColumn("CH.tab_SNI", "numeroExpediente", c => c.Int(nullable: false));
        }
    }
}
