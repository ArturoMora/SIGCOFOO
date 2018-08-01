namespace INEEL.DataAccess.GEN.MigrationsCR
{
    using System;
    using System.Data.Entity.Migrations;
    
    public partial class campoestadoexpertos2 : DbMigration
    {
        public override void Up()
        {
            AlterColumn("CR.cat_Expertos", "estado", c => c.Boolean());
        }
        
        public override void Down()
        {
            AlterColumn("CR.cat_Expertos", "estado", c => c.Boolean(nullable: false));
        }
    }
}
