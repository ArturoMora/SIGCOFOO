namespace INEEL.DataAccess.GEN.MigrationsMT
{
    using System;
    using System.Data.Entity.Migrations;
    
    public partial class AjusteSolicitudRevisionITF2 : DbMigration
    {
        public override void Up()
        {
            DropIndex("MT.SolicitudRevisionITF", new[] { "InformeTecnicoFinalId" });
            AddColumn("MT.SolicitudRevisionITF", "AdminMT", c => c.Boolean(nullable: false));
            CreateIndex("MT.SolicitudRevisionITF", "InformeTecnicoFinalId");
        }
        
        public override void Down()
        {
            DropIndex("MT.SolicitudRevisionITF", new[] { "InformeTecnicoFinalId" });
            DropColumn("MT.SolicitudRevisionITF", "AdminMT");
            CreateIndex("MT.SolicitudRevisionITF", "InformeTecnicoFinalId", unique: true);
        }
    }
}
