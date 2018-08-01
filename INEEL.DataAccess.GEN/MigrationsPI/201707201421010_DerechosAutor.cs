namespace INEEL.DataAccess.GEN.MigrationsPI
{
    using System;
    using System.Data.Entity.Migrations;
    
    public partial class DerechosAutor : DbMigration
    {
        public override void Up()
        {
            CreateTable(
                "PI.tab_AutoresDA",
                c => new
                    {
                        AutoresDAId = c.Int(nullable: false, identity: true),
                        ClavePersona = c.String(),
                        Nombre = c.String(),
                        Institucion = c.String(),
                        EsExterno = c.Boolean(nullable: false),
                        DerechosAutorId = c.Int(nullable: false),
                    })
                .PrimaryKey(t => t.AutoresDAId)
                .ForeignKey("PI.tab_DerechosAutor", t => t.DerechosAutorId, cascadeDelete: true)
                .Index(t => t.DerechosAutorId);
            
            CreateTable(
                "PI.tab_DerechosAutor",
                c => new
                    {
                        DerechosAutorId = c.Int(nullable: false, identity: true),
                        EspropiedadInstituto = c.Boolean(nullable: false),
                        TitularPropiedadPatrimonial = c.String(),
                        Titulo = c.String(maxLength: 300),
                        Sintesis = c.String(),
                        RamaId = c.Int(nullable: false),
                        Esderivada = c.Int(nullable: false),
                        DerechosAutorPadre = c.Int(nullable: false),
                        RelacionMedianteProyecto = c.Boolean(nullable: false),
                        NumeroProyecto = c.Int(nullable: false),
                        ClaveUnidad = c.String(),
                        FechaExpedicion = c.DateTime(nullable: false),
                        FechaSolicitud = c.DateTime(nullable: false),
                        Certificado = c.String(maxLength: 50),
                        Observaciones = c.String(maxLength: 200),
                        ConsecutivoInterno = c.String(maxLength: 10),
                        EstadoFlujoId = c.Int(nullable: false),
                        AdjuntoId = c.Long(),
                        UnidadOrganizacional_ClaveUnidad = c.String(maxLength: 10),
                        UnidadOrganizacional_FechaEfectiva = c.DateTime(),
                    })
                .PrimaryKey(t => t.DerechosAutorId)
                .ForeignKey("GEN.Adjunto", t => t.AdjuntoId)
                .ForeignKey("GEN.cat_EstadoFlujo", t => t.EstadoFlujoId, cascadeDelete: true)
                .ForeignKey("PI.cat_Ramas", t => t.RamaId, cascadeDelete: true)
                .ForeignKey("GEN.cat_UnidadOrganizacional", t => new { t.UnidadOrganizacional_ClaveUnidad, t.UnidadOrganizacional_FechaEfectiva })
                .Index(t => t.RamaId)
                .Index(t => t.EstadoFlujoId)
                .Index(t => t.AdjuntoId)
                .Index(t => new { t.UnidadOrganizacional_ClaveUnidad, t.UnidadOrganizacional_FechaEfectiva });
            
            CreateTable(
                "PI.cat_Ramas",
                c => new
                    {
                        RamaId = c.Int(nullable: false, identity: true),
                        Descripcion = c.String(),
                        DescripcionCorta = c.String(),
                        Estado = c.Int(nullable: false),
                    })
                .PrimaryKey(t => t.RamaId);
            
        }
        
        public override void Down()
        {
            DropForeignKey("PI.tab_AutoresDA", "DerechosAutorId", "PI.tab_DerechosAutor");
            DropForeignKey("PI.tab_DerechosAutor", new[] { "UnidadOrganizacional_ClaveUnidad", "UnidadOrganizacional_FechaEfectiva" }, "GEN.cat_UnidadOrganizacional");
            DropForeignKey("PI.tab_DerechosAutor", "RamaId", "PI.cat_Ramas");
            DropForeignKey("PI.tab_DerechosAutor", "EstadoFlujoId", "GEN.cat_EstadoFlujo");
            DropForeignKey("PI.tab_DerechosAutor", "AdjuntoId", "GEN.Adjunto");
            DropIndex("PI.tab_DerechosAutor", new[] { "UnidadOrganizacional_ClaveUnidad", "UnidadOrganizacional_FechaEfectiva" });
            DropIndex("PI.tab_DerechosAutor", new[] { "AdjuntoId" });
            DropIndex("PI.tab_DerechosAutor", new[] { "EstadoFlujoId" });
            DropIndex("PI.tab_DerechosAutor", new[] { "RamaId" });
            DropIndex("PI.tab_AutoresDA", new[] { "DerechosAutorId" });
            DropTable("PI.cat_Ramas");
            DropTable("PI.tab_DerechosAutor");
            DropTable("PI.tab_AutoresDA");
        }
    }
}
