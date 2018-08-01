namespace INEEL.DataAccess.GEN.MigrationsMT
{
    using System;
    using System.Data.Entity.Migrations;
    
    public partial class cambiaCamposBitacoraITFsolicitudDescarga : DbMigration
    {
        public override void Up()
        {
            AddColumn("MT.BitacoraITFSolicitudDescarga", "claveSolicitante", c => c.String());
            AddColumn("MT.BitacoraITFSolicitudDescarga", "claveAutorizador", c => c.String());
            AlterColumn("MT.BitacoraITFSolicitudDescarga", "permisoDescarga", c => c.String());
        }
        
        public override void Down()
        {
            AlterColumn("MT.BitacoraITFSolicitudDescarga", "permisoDescarga", c => c.Boolean(nullable: false));
            DropColumn("MT.BitacoraITFSolicitudDescarga", "claveAutorizador");
            DropColumn("MT.BitacoraITFSolicitudDescarga", "claveSolicitante");
        }
    }
}
