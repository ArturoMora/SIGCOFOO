namespace INEEL.DataAccess.GEN.MigrationsCR
{
    using System;
    using System.Data.Entity.Migrations;
    
    public partial class campoestadoexpertos : DbMigration
    {
        public override void Up()
        {
            AddColumn("CR.cat_Expertos", "estado", c => c.Boolean(nullable: false));
        }
        
        public override void Down()
        {
            DropColumn("CR.cat_Expertos", "estado");
        }
    }
}
