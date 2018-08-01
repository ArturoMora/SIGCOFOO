namespace INEEL.DataAccess.GEN.Migrations
{
    using System;
    using System.Data.Entity.Migrations;
    
    public partial class UltimaActualizacionFicha : DbMigration
    {
        public override void Up()
        {
            AddColumn("GEN.cat_Personas", "ultimaActualizacion", c => c.DateTime());
        }
        
        public override void Down()
        {
            DropColumn("GEN.cat_Personas", "ultimaActualizacion");
        }
    }
}
