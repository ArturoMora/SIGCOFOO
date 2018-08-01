namespace INEEL.DataAccess.GEN.Migrations
{
    using System;
    using System.Data.Entity.Migrations;
    
    public partial class columnaEgresosEnProyectos : DbMigration
    {
        public override void Up()
        {
            AddColumn("GEN.Proyectos", "egresos", c => c.Single());
        }
        
        public override void Down()
        {
            DropColumn("GEN.Proyectos", "egresos");
        }
    }
}
