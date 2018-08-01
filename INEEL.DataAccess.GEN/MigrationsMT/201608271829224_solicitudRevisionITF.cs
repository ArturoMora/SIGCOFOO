namespace INEEL.DataAccess.GEN.MigrationsMT
{
    using System;
    using System.Data.Entity.Migrations;
    
    public partial class solicitudRevisionITF : DbMigration
    {
        public override void Up()
        {
            CreateTable(
                "MT.SolicitudRevisionITF",
                c => new
                    {
                        SolicitudRevisionITFId = c.Long(nullable: false, identity: true),
                        InformeTecnicoFinalId = c.String(maxLength: 10),
                        ClavePersonaSolicitante = c.String(nullable: false, maxLength: 10),
                        FechaSolicitud = c.DateTime(nullable: false),
                        Justificacion = c.String(maxLength: 500),
                        EstadoSolicitudId = c.Int(nullable: false),
                        ClaveUnidad = c.String(),
                        FechaAtencion = c.DateTime(),
                        TextoRespuesta = c.String(maxLength: 500),
                        FechaInicioDescarga = c.DateTime(),
                        FechaFinalDescarga = c.DateTime(),
                    })
                .PrimaryKey(t => t.SolicitudRevisionITFId)
                .ForeignKey("MT.cat_EstadoSolicitud", t => t.EstadoSolicitudId, cascadeDelete: true)
                .ForeignKey("MT.InformeTecnicoFinal", t => t.InformeTecnicoFinalId)
                .Index(t => t.InformeTecnicoFinalId)
                .Index(t => t.EstadoSolicitudId);
            
        }
        
        public override void Down()
        {
            DropForeignKey("MT.SolicitudRevisionITF", "InformeTecnicoFinalId", "MT.InformeTecnicoFinal");
            DropForeignKey("MT.SolicitudRevisionITF", "EstadoSolicitudId", "MT.cat_EstadoSolicitud");
            DropIndex("MT.SolicitudRevisionITF", new[] { "EstadoSolicitudId" });
            DropIndex("MT.SolicitudRevisionITF", new[] { "InformeTecnicoFinalId" });
            DropTable("MT.SolicitudRevisionITF");
        }
    }
}
