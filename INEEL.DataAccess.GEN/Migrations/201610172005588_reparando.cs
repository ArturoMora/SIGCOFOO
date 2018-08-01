namespace INEEL.DataAccess.GEN.Migrations
{
    using System;
    using System.Data.Entity.Migrations;
    
    public partial class reparando : DbMigration
    {
        public override void Up()
        {
            AlterColumn("GEN.Iniciativas", "Costos", c => c.Decimal(precision: 18, scale: 2));
        }
        
        public override void Down()
        {
            AlterColumn("GEN.Iniciativas", "Costos", c => c.Single());
        }
    }
}
