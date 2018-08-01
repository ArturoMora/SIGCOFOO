namespace INEEL.DataAccess.GEN.Migrations
{
    using System;
    using System.Data.Entity.Migrations;
    
    public partial class horas : DbMigration
    {
        public override void Up()
        {
            AddColumn("GEN.PersonalProyecto", "Horas", c => c.Decimal(precision: 18, scale: 2));
        }
        
        public override void Down()
        {
            DropColumn("GEN.PersonalProyecto", "Horas");
        }
    }
}
