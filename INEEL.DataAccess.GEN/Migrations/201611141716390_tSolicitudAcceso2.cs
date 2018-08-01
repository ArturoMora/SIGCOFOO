namespace INEEL.DataAccess.GEN.Migrations
{
    using System;
    using System.Data.Entity.Migrations;
    
    public partial class tSolicitudAcceso2 : DbMigration
    {
        public override void Up()
        {
            CreateTable(
                "GEN.tab_SolicitudAcceso",
                c => new
                    {
                        SolicitudAccesoId = c.Long(nullable: false, identity: true),
                        ClavePersonaSolicitante = c.String(),
                        TipoInformacionId = c.Int(nullable: false),
                        InformacionOCId = c.Int(nullable: false),
                        FechaSolicitud = c.DateTime(nullable: false),
                        unidadAutorizadoraId = c.String(),
                        EstadoFlujoId = c.Int(nullable: false),
                    })
                .PrimaryKey(t => t.SolicitudAccesoId)
                .ForeignKey("GEN.cat_EstadoFlujo", t => t.EstadoFlujoId, cascadeDelete: false)
                .ForeignKey("CH.cat_TipoInformacion", t => t.TipoInformacionId, cascadeDelete: false)
                .Index(t => t.TipoInformacionId)
                .Index(t => t.EstadoFlujoId);
            
            //CreateTable(
            //    "CH.cat_TipoInformacion",
            //    c => new
            //        {
            //            TipoInformacionId = c.Int(nullable: false, identity: true),
            //            Descripcion = c.String(maxLength: 150),
            //        })
            //    .PrimaryKey(t => t.TipoInformacionId);
            
        }
        
        public override void Down()
        {
            DropForeignKey("GEN.tab_SolicitudAcceso", "TipoInformacionId", "CH.cat_TipoInformacion");
            DropForeignKey("GEN.tab_SolicitudAcceso", "EstadoFlujoId", "GEN.cat_EstadoFlujo");
            DropIndex("GEN.tab_SolicitudAcceso", new[] { "EstadoFlujoId" });
            DropIndex("GEN.tab_SolicitudAcceso", new[] { "TipoInformacionId" });
            //DropTable("CH.cat_TipoInformacion");
            DropTable("GEN.tab_SolicitudAcceso");
        }
    }
}
