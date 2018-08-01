namespace INEEL.DataAccess.GEN.Migrations
{
    using System;
    using System.Data.Entity.Migrations;
    
    public partial class fechaIngreso : DbMigration
    {
        public override void Up()
        {
            AddColumn("GEN.cat_Personas", "FechaIngreso", c => c.DateTime(nullable: false));
            AddColumn("GEN.cat_Personas", "FechaNacimiento", c => c.DateTime(nullable: false));
        }
        
        public override void Down()
        {
            DropColumn("GEN.cat_Personas", "FechaNacimiento");
            DropColumn("GEN.cat_Personas", "FechaIngreso");
        }
    }
}
