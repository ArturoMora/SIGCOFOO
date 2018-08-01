namespace INEEL.DataAccess.GEN.MigrationsCH
{
    using System;
    using System.Data.Entity.Migrations;
    
    public partial class certificacionesobtenidas : DbMigration
    {
        public override void Up()
        {
            CreateTable(
                "CH.tab_CertificacionesObtenidas",
                c => new
                    {
                        CertificacionesObtenidasId = c.Int(nullable: false, identity: true),
                        ClavePersona = c.String(),
                        FechaValidacion = c.DateTime(),
                        EstadoFlujoId = c.Int(nullable: false),
                        AdjuntoId = c.Long(),
                        NombreCertificacion = c.String(),
                        AutoridadEmisora = c.String(),
                        NumeroLicencia = c.Int(nullable: false),
                        FechaInicio = c.DateTime(nullable: false),
                        FechaTermino = c.DateTime(),
                        Url = c.String(),
                    })
                .PrimaryKey(t => t.CertificacionesObtenidasId)
                .ForeignKey("GEN.Adjunto", t => t.AdjuntoId)
                .ForeignKey("GEN.cat_EstadoFlujo", t => t.EstadoFlujoId, cascadeDelete: true)
                .Index(t => t.EstadoFlujoId)
                .Index(t => t.AdjuntoId);
            
        }
        
        public override void Down()
        {
            DropForeignKey("CH.tab_CertificacionesObtenidas", "EstadoFlujoId", "GEN.cat_EstadoFlujo");
            DropForeignKey("CH.tab_CertificacionesObtenidas", "AdjuntoId", "GEN.Adjunto");
            DropIndex("CH.tab_CertificacionesObtenidas", new[] { "AdjuntoId" });
            DropIndex("CH.tab_CertificacionesObtenidas", new[] { "EstadoFlujoId" });
            DropTable("CH.tab_CertificacionesObtenidas");
        }
    }
}
