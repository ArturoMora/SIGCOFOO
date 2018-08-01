namespace INEEL.DataAccess.GEN.MigrationsMT
{
    using System;
    using System.Data.Entity.Migrations;
    
    public partial class AjusteSolicitudRevisionITF : DbMigration
    {
        public override void Up()
        {
            DropColumn("MT.SolicitudRevisionITF", "FechaInicioDescarga");
            DropColumn("MT.SolicitudRevisionITF", "FechaFinalDescarga");
        }
        
        public override void Down()
        {
            AddColumn("MT.SolicitudRevisionITF", "FechaFinalDescarga", c => c.DateTime());
            AddColumn("MT.SolicitudRevisionITF", "FechaInicioDescarga", c => c.DateTime());
        }
    }
}
