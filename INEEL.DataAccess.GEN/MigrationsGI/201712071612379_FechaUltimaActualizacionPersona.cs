namespace INEEL.DataAccess.GEN.MigrationsGI
{
    using System;
    using System.Data.Entity.Migrations;
    
    public partial class FechaUltimaActualizacionPersona : DbMigration
    {
        public override void Up()
        {
          //  AddColumn("GEN.cat_Personas", "ultimaActualizacion", c => c.DateTime());
        }
        
        public override void Down()
        {
          //  DropColumn("GEN.cat_Personas", "ultimaActualizacion");
        }
    }
}
