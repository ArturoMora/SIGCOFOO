namespace INEEL.DataAccess.GEN.MigrationsMT
{
    using System;
    using System.Data.Entity.Migrations;
    
    public partial class agregaBitacoraPermisosDescargaITF : DbMigration
    {
        public override void Up()
        {
            CreateTable(
                "MT.BitacoraITFSolicitudDescarga",
                c => new
                    {
                        id = c.Int(nullable: false, identity: true),
                        iditf = c.String(),
                        idsolicitud = c.Int(nullable: false),
                        permisoDescarga = c.Boolean(nullable: false),
                        fechaRegistro = c.DateTime(nullable: false),
                    })
                .PrimaryKey(t => t.id);
            
        }
        
        public override void Down()
        {
            DropTable("MT.BitacoraITFSolicitudDescarga");
        }
    }
}
