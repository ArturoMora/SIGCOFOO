namespace INEEL.DataAccess.GEN.MigrationsPI
{
    using System;
    using System.Data.Entity.Migrations;
    
    public partial class intToStringPI : DbMigration
    {
        public override void Up()
        {
            AlterColumn("PI.tab_PIExterno", "NumExpedicionTitulo", c => c.String());
        }
        
        public override void Down()
        {
            AlterColumn("PI.tab_PIExterno", "NumExpedicionTitulo", c => c.Int(nullable: false));
        }
    }
}
