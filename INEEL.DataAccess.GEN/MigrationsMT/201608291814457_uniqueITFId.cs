namespace INEEL.DataAccess.GEN.MigrationsMT
{
    using System;
    using System.Data.Entity.Migrations;
    
    public partial class uniqueITFId : DbMigration
    {
        public override void Up()
        {
            DropIndex("MT.SolicitudRevisionITF", new[] { "InformeTecnicoFinalId" });
            CreateIndex("MT.SolicitudRevisionITF", "InformeTecnicoFinalId", unique: true);
        }
        
        public override void Down()
        {
            DropIndex("MT.SolicitudRevisionITF", new[] { "InformeTecnicoFinalId" });
            CreateIndex("MT.SolicitudRevisionITF", "InformeTecnicoFinalId");
        }
    }
}
