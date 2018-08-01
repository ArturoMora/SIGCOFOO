namespace INEEL.DataAccess.GEN.MigrationsGI
{
    using System;
    using System.Data.Entity.Migrations;
    
    public partial class califnullidea : DbMigration
    {
        public override void Up()
        {
            AlterColumn("GI.tab_IdeaInnovadora", "Calificacion", c => c.Single());
        }
        
        public override void Down()
        {
            AlterColumn("GI.tab_IdeaInnovadora", "Calificacion", c => c.Single(nullable: false));
        }
    }
}
