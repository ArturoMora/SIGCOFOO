namespace INEEL.DataAccess.GEN.MigrationsGI
{
    using System;
    using System.Data.Entity.Migrations;
    
    public partial class tablasII : DbMigration
    {
        public override void Up()
        {
            CreateTable(
                "GI.tab_AutoresIdea",
                c => new
                    {
                        Id = c.Int(nullable: false, identity: true),
                        ClavePersona = c.String(),
                        IdeaInnovadoraId = c.Int(nullable: false),
                        ContribucionProponenteId = c.String(),
                        ContribucionProponente_Id = c.Int(),
                    })
                .PrimaryKey(t => t.Id)
                .ForeignKey("GI.cat_ContribucionProponente", t => t.ContribucionProponente_Id)
                .Index(t => t.ContribucionProponente_Id);
            
            CreateTable(
                "GI.cat_ContribucionProponente",
                c => new
                    {
                        Id = c.Int(nullable: false),
                        Contribucion = c.String(),
                    })
                .PrimaryKey(t => t.Id);
            
            CreateTable(
                "GI.tab_IdeaInnovadora",
                c => new
                    {
                        IdeaInnovadoraId = c.Int(nullable: false, identity: true),
                        NombreIdea = c.String(),
                        PalabrasClave = c.String(),
                        Problema = c.String(),
                        Limitaciones = c.String(),
                        RazonesInexistncia = c.String(),
                        RelevanciaNuevaSolucion = c.String(),
                        PartesInteresadasBeneficiadas = c.String(),
                        Capacidades = c.String(),
                        DescripcionDesarrollo = c.String(),
                        BarrerasTecnologicas = c.String(),
                        CapacidadServicio = c.String(),
                        OfertaValor = c.String(),
                        ProtegerDesarrolloTecnologico = c.String(),
                        ClietesPotenciales = c.String(),
                        DedicacionClientesP = c.String(),
                        BeneficiosCliente = c.String(),
                        ComunidadPracticaId = c.String(),
                        AdjuntoId = c.String(),
                        FechaRegistro = c.String(),
                        ClavePersona = c.String(),
                        FechaValidacion = c.DateTime(),
                        EstadoFlujoId = c.String(),
                        TipoAcceso = c.Int(nullable: false),
                        Adjunto_AdjuntoId = c.Long(),
                        EstadoFlujo_EstadoFlujoId = c.Int(),
                        TipoAccesoGI_Id = c.Int(),
                    })
                .PrimaryKey(t => t.IdeaInnovadoraId)
                .ForeignKey("GEN.Adjunto", t => t.Adjunto_AdjuntoId)
                .ForeignKey("GEN.cat_EstadoFlujo", t => t.EstadoFlujo_EstadoFlujoId)
                .ForeignKey("GI.cat_TipoAcceso", t => t.TipoAccesoGI_Id)
                .Index(t => t.Adjunto_AdjuntoId)
                .Index(t => t.EstadoFlujo_EstadoFlujoId)
                .Index(t => t.TipoAccesoGI_Id);
            
            CreateTable(
                "GI.cat_TipoAcceso",
                c => new
                    {
                        Id = c.Int(nullable: false, identity: true),
                        Nombre = c.String(),
                    })
                .PrimaryKey(t => t.Id);
            
        }
        
        public override void Down()
        {
            DropForeignKey("GI.tab_IdeaInnovadora", "TipoAccesoGI_Id", "GI.cat_TipoAcceso");
            DropForeignKey("GI.tab_IdeaInnovadora", "EstadoFlujo_EstadoFlujoId", "GEN.cat_EstadoFlujo");
            DropForeignKey("GI.tab_IdeaInnovadora", "Adjunto_AdjuntoId", "GEN.Adjunto");
            DropForeignKey("GI.tab_AutoresIdea", "ContribucionProponente_Id", "GI.cat_ContribucionProponente");
            DropIndex("GI.tab_IdeaInnovadora", new[] { "TipoAccesoGI_Id" });
            DropIndex("GI.tab_IdeaInnovadora", new[] { "EstadoFlujo_EstadoFlujoId" });
            DropIndex("GI.tab_IdeaInnovadora", new[] { "Adjunto_AdjuntoId" });
            DropIndex("GI.tab_AutoresIdea", new[] { "ContribucionProponente_Id" });
            DropTable("GI.cat_TipoAcceso");
            DropTable("GI.tab_IdeaInnovadora");
            DropTable("GI.cat_ContribucionProponente");
            DropTable("GI.tab_AutoresIdea");
        }
    }
}
