namespace INEEL.DataAccess.GEN.MigrationsCH
{
    using System;
    using System.Data.Entity.Migrations;
    
    public partial class testtamanoName : DbMigration
    {
        public override void Up()
        {
            //AlterColumn("GEN.Adjunto", "nombre", c => c.String());
        }
        
        public override void Down()
        {
            //AlterColumn("GEN.Adjunto", "nombre", c => c.String(maxLength: 100));
        }
    }
}
