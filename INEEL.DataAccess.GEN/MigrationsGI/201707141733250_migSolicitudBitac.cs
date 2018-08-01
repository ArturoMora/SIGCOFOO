namespace INEEL.DataAccess.GEN.MigrationsGI
{
    using System;
    using System.Data.Entity.Migrations;
    
    public partial class migSolicitudBitac : DbMigration
    {
        public override void Up()
        {
            CreateTable(
                "GI.tab_BitacoraSolicitudesGI",
                c => new
                    {
                        BitacoraSolicitudesId = c.Long(nullable: false, identity: true),
                        SolicitudId = c.Int(nullable: false),
                        FechaMovimiento = c.DateTime(nullable: false),
                        ClavePersona = c.String(),
                        Descripcion = c.String(),
                        EstadoFlujoId = c.Int(nullable: false),
                        IdRol = c.Int(),
                    })
                .PrimaryKey(t => t.BitacoraSolicitudesId)
                .ForeignKey("GEN.cat_EstadoFlujo", t => t.EstadoFlujoId, cascadeDelete: true)
                .Index(t => t.EstadoFlujoId);
            
            CreateTable(
                "GI.tab_SolicitudGI",
                c => new
                    {
                        SolicitudId = c.Int(nullable: false, identity: true),
                        ClavePersona = c.String(),
                        TipoInformacionId = c.Int(nullable: false),
                        InformacionId = c.String(),
                        FechaSolicitud = c.DateTime(nullable: false),
                        EstadoFlujoId = c.Int(nullable: false),
                        IdRol = c.Int(),
                        ClaveUnidadAut = c.String(),
                        TipoPersonal_Id = c.String(),
                    })
                .PrimaryKey(t => t.SolicitudId)
                .ForeignKey("GEN.cat_EstadoFlujo", t => t.EstadoFlujoId, cascadeDelete: true)
                .ForeignKey("CH.cat_TipoInformacion", t => t.TipoInformacionId, cascadeDelete: true)
                .Index(t => t.TipoInformacionId)
                .Index(t => t.EstadoFlujoId);
            
        }
        
        public override void Down()
        {
            DropForeignKey("GI.tab_SolicitudGI", "TipoInformacionId", "CH.cat_TipoInformacion");
            DropForeignKey("GI.tab_SolicitudGI", "EstadoFlujoId", "GEN.cat_EstadoFlujo");
            DropForeignKey("GI.tab_BitacoraSolicitudesGI", "EstadoFlujoId", "GEN.cat_EstadoFlujo");
            DropIndex("GI.tab_SolicitudGI", new[] { "EstadoFlujoId" });
            DropIndex("GI.tab_SolicitudGI", new[] { "TipoInformacionId" });
            DropIndex("GI.tab_BitacoraSolicitudesGI", new[] { "EstadoFlujoId" });
            DropTable("GI.tab_SolicitudGI");
            DropTable("GI.tab_BitacoraSolicitudesGI");
        }
    }
}
