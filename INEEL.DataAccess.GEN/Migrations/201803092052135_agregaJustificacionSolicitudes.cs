namespace INEEL.DataAccess.GEN.Migrations
{
    using System;
    using System.Data.Entity.Migrations;
    
    public partial class agregaJustificacionSolicitudes : DbMigration
    {
        public override void Up()
        {
            AddColumn("GEN.tab_BitacoraSolicitudesAcceso", "justificacion", c => c.String());
        }
        
        public override void Down()
        {
            DropColumn("GEN.tab_BitacoraSolicitudesAcceso", "justificacion");
        }
    }
}
