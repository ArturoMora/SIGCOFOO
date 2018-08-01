namespace INEEL.DataAccess.GEN.Migrations
{
    using System;
    using System.Data.Entity.Migrations;
    
    public partial class migraDeleteUbicaAddUbica : DbMigration
    {
        public override void Up()
        {
            AddColumn("GEN.tab_DetallePersona", "Ubicacion", c => c.String());
            DropColumn("GEN.cat_Personas", "Localizacion");
        }
        
        public override void Down()
        {
            AddColumn("GEN.cat_Personas", "Localizacion", c => c.String(maxLength: 200));
            DropColumn("GEN.tab_DetallePersona", "Ubicacion");
        }
    }
}
