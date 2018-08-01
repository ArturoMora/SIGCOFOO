namespace INEEL.DataAccess.GEN.MigrationsMT
{
    using System;
    using System.Data.Entity.Migrations;
    
    public partial class AdrianlontToInt : DbMigration
    {
        public override void Up()
        {
            DropPrimaryKey("MT.SolicitudRevisionITF");
            AlterColumn("MT.SolicitudRevisionITF", "SolicitudRevisionITFId", c => c.Int(nullable: false, identity: true));
            AddPrimaryKey("MT.SolicitudRevisionITF", "SolicitudRevisionITFId");
        }
        
        public override void Down()
        {
            DropPrimaryKey("MT.SolicitudRevisionITF");
            AlterColumn("MT.SolicitudRevisionITF", "SolicitudRevisionITFId", c => c.Long(nullable: false, identity: true));
            AddPrimaryKey("MT.SolicitudRevisionITF", "SolicitudRevisionITFId");
        }
    }
}
