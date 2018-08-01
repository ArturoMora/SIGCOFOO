namespace INEEL.DataAccess.GEN.MigrationsPI
{
    using System;
    using System.Data.Entity.Migrations;
    
    public partial class modelopi : DbMigration
    {
        public override void Up()
        {
            CreateTable(
                "PI.tab_AutoresPI",
                c => new
                    {
                        AutoresPIId = c.Int(nullable: false, identity: true),
                        ClavePersona = c.String(),
                        Nombre = c.String(),
                        Institucion = c.String(),
                        EsExterno = c.Boolean(nullable: false),
                        PropiedadIndustrialId = c.Int(nullable: false),
                    })
                .PrimaryKey(t => t.AutoresPIId)
                .ForeignKey("PI.tab_PropiedadIndustrial", t => t.PropiedadIndustrialId, cascadeDelete: true)
                .Index(t => t.PropiedadIndustrialId);
            
            CreateTable(
                "PI.tab_PropiedadIndustrial",
                c => new
                    {
                        PropiedadIndustrialId = c.Int(nullable: false, identity: true),
                        EsPropiedadInstituto = c.Boolean(nullable: false),
                        TitularPropiedadPatrimonial = c.String(),
                        Titulo = c.String(nullable: false, maxLength: 300),
                        TipoPropiedadIndustrial = c.Int(nullable: false),
                        EstadoDelProceso = c.Int(nullable: false),
                        NumeroProyecto = c.String(),
                        ClaveUnidad = c.String(),
                        Expediente = c.String(),
                        FechaPresentacion = c.DateTime(),
                        NumeroTitulo = c.Int(nullable: false),
                        FechaExpedicion = c.DateTime(),
                        FechaVencimiento = c.DateTime(),
                        FechaProximoPago = c.DateTime(),
                        FechaInicioTramite = c.DateTime(),
                        Licenciado = c.Boolean(nullable: false),
                        Observaciones = c.String(maxLength: 200),
                        ConsecutivoInterno = c.String(maxLength: 10),
                        Completo = c.Boolean(nullable: false),
                        EstadoFlujoId = c.Int(nullable: false),
                        AdjuntoId = c.Long(),
                        ClavePersona = c.String(maxLength: 10),
                    })
                .PrimaryKey(t => t.PropiedadIndustrialId)
                .ForeignKey("GEN.Adjunto", t => t.AdjuntoId)
                .ForeignKey("GEN.cat_EstadoFlujo", t => t.EstadoFlujoId, cascadeDelete: true)
                .Index(t => t.EstadoFlujoId)
                .Index(t => t.AdjuntoId);
            
        }
        
        public override void Down()
        {
            DropForeignKey("PI.tab_AutoresPI", "PropiedadIndustrialId", "PI.tab_PropiedadIndustrial");
            DropForeignKey("PI.tab_PropiedadIndustrial", "EstadoFlujoId", "GEN.cat_EstadoFlujo");
            DropForeignKey("PI.tab_PropiedadIndustrial", "AdjuntoId", "GEN.Adjunto");
            DropIndex("PI.tab_PropiedadIndustrial", new[] { "AdjuntoId" });
            DropIndex("PI.tab_PropiedadIndustrial", new[] { "EstadoFlujoId" });
            DropIndex("PI.tab_AutoresPI", new[] { "PropiedadIndustrialId" });
            DropTable("PI.tab_PropiedadIndustrial");
            DropTable("PI.tab_AutoresPI");
        }
    }
}
