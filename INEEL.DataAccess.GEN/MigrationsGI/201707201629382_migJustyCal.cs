namespace INEEL.DataAccess.GEN.MigrationsGI
{
    using System;
    using System.Data.Entity.Migrations;
    
    public partial class migJustyCal : DbMigration
    {
        public override void Up()
        {
            AddColumn("GI.tab_BitacoraSolicitudesGI", "Justificacion", c => c.String());
            AddColumn("GI.tab_IdeaInnovadora", "Calificacion", c => c.Single(nullable: false));
        }
        
        public override void Down()
        {
            DropColumn("GI.tab_IdeaInnovadora", "Calificacion");
            DropColumn("GI.tab_BitacoraSolicitudesGI", "Justificacion");
        }
    }
}
