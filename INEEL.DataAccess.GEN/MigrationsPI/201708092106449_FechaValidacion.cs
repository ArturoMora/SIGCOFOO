namespace INEEL.DataAccess.GEN.MigrationsPI
{
    using System;
    using System.Data.Entity.Migrations;
    
    public partial class FechaValidacion : DbMigration
    {
        public override void Up()
        {
            AddColumn("PI.tab_PropiedadIndustrial", "FechaValidacion", c => c.DateTime());
        }
        
        public override void Down()
        {
            DropColumn("PI.tab_PropiedadIndustrial", "FechaValidacion");
        }
    }
}
