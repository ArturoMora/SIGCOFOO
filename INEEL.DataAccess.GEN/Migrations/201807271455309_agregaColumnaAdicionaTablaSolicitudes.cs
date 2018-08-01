namespace INEEL.DataAccess.GEN.Migrations
{
    using System;
    using System.Data.Entity.Migrations;
    
    public partial class agregaColumnaAdicionaTablaSolicitudes : DbMigration
    {
        public override void Up()
        {
            AddColumn("GEN.tab_SolicitudAcceso", "idAdicional", c => c.String());
        }
        
        public override void Down()
        {
            DropColumn("GEN.tab_SolicitudAcceso", "idAdicional");
        }
    }
}
