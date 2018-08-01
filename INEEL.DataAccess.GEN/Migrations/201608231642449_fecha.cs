namespace INEEL.DataAccess.GEN.Migrations
{
    using System;
    using System.Data.Entity.Migrations;
    
    public partial class fecha : DbMigration
    {
        public override void Up()
        {
            AlterColumn("GEN.PersonalProyecto", "FechaTermino", c => c.DateTime());
        }
        
        public override void Down()
        {
            AlterColumn("GEN.PersonalProyecto", "FechaTermino", c => c.DateTime(nullable: false));
        }
    }
}
