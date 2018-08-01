namespace INEEL.DataAccess.GEN.MigrationsPI
{
    using System;
    using System.Data.Entity.Migrations;
    
    public partial class ReiniciaPI : DbMigration
    {
        public override void Up()
        {
            //DropForeignKey("GEN.cat_Funciones", "IdPadre", "GEN.cat_Funciones");
            //DropForeignKey("GEN.cat_Funciones", "IdModulo", "GEN.cat_Modulo");
            //DropForeignKey("GEN.Adjunto", "ModuloId", "GEN.cat_Modulo");
            DropForeignKey("PI.tab_DAExterno", "AdjuntoId", "GEN.Adjunto");
            DropForeignKey("PI.tab_DAExterno", "EstadoFlujoId", "GEN.cat_EstadoFlujo");
            DropForeignKey("PI.tab_DAExterno", "RamaDAId", "PI.cat_RamaDA");
            DropForeignKey("PI.tab_AutoresExtDA", "DAExternoId", "PI.tab_DAExterno");
            DropForeignKey("PI.tab_RequisicionesPI", "TipoPIId", "PI.cat_TipoPI");
            //DropForeignKey("GEN.cat_UnidadOrganizacional", "tipoO", "GEN.cat_TipoUnidad");
            DropForeignKey("PI.tab_RequisicionesPI", new[] { "ClaveUnidad", "FechaEfectiva" }, "GEN.cat_UnidadOrganizacional");
            DropForeignKey("PI.tab_AutoresExtPIPatrimonio", "RequisicionesPIId", "PI.tab_RequisicionesPI");
            DropForeignKey("PI.tab_PIExterno", "AdjuntoId", "GEN.Adjunto");
            DropForeignKey("PI.tab_PIExterno", "EstadoFlujoId", "GEN.cat_EstadoFlujo");
            DropForeignKey("PI.tab_PIExterno", "TipoPIId", "PI.cat_TipoPI");
            DropForeignKey("PI.tab_AutoresIndustrialExt", "PIExternoId", "PI.tab_PIExterno");
            DropForeignKey("PI.tab_AutoresIndustrialInt", "PIExternoId", "PI.tab_PIExterno");
            DropForeignKey("PI.tab_AutoresIntDA", "DAExternoId", "PI.tab_DAExterno");
            DropForeignKey("PI.tab_AutoresIntDAPatrimonio", "CategoriaId", "GEN.cat_Categoria");
            DropForeignKey("PI.tab_AutoresIntDAPatrimonio", "TipoBecaId", "CH.cat_TipoBecas");
            DropForeignKey("PI.tab_AutoresIntDAPatrimonio", "TipoEmpleadoId", "PI.cat_TipoEmpleado");
            DropForeignKey("PI.tab_AutoresIntPIPatrimonio", "RequisicionesPIId", "PI.tab_RequisicionesPI");
            DropForeignKey("PI.tab_SolicitudesDA", "RamaDAId", "PI.cat_RamaDA");
            DropForeignKey("PI.tab_SolicitudesDA", "TipoDerivadaDAId", "PI.cat_TipoDerivadaDA");
            DropForeignKey("PI.tab_SolicitudParticiantesDA", "AutoresIntDAPatrimonioId", "PI.tab_AutoresIntDAPatrimonio");
            DropForeignKey("PI.tab_SolicitudParticiantesDA", "SolicitudesDAId", "PI.tab_SolicitudesDA");
            DropForeignKey("PI.tab_SolicitudParticiantesDA", "TipoParticipacionDAId", "PI.tab_TipoParticipacionDA");
            DropIndex("PI.tab_AutoresExtDA", new[] { "DAExternoId" });
            DropIndex("PI.tab_DAExterno", new[] { "EstadoFlujoId" });
            DropIndex("PI.tab_DAExterno", new[] { "RamaDAId" });
            DropIndex("PI.tab_DAExterno", new[] { "AdjuntoId" });
            //DropIndex("GEN.Adjunto", new[] { "ModuloId" });
            //DropIndex("GEN.cat_Funciones", new[] { "IdPadre" });
            //DropIndex("GEN.cat_Funciones", new[] { "IdModulo" });
            DropIndex("PI.tab_AutoresExtPIPatrimonio", new[] { "RequisicionesPIId" });
            DropIndex("PI.tab_RequisicionesPI", new[] { "ClaveUnidad", "FechaEfectiva" });
            DropIndex("PI.tab_RequisicionesPI", new[] { "TipoPIId" });
            //DropIndex("GEN.cat_UnidadOrganizacional", new[] { "tipoO" });
            DropIndex("PI.tab_AutoresIndustrialExt", new[] { "PIExternoId" });
            DropIndex("PI.tab_PIExterno", new[] { "EstadoFlujoId" });
            DropIndex("PI.tab_PIExterno", new[] { "TipoPIId" });
            DropIndex("PI.tab_PIExterno", new[] { "AdjuntoId" });
            DropIndex("PI.tab_AutoresIndustrialInt", new[] { "PIExternoId" });
            DropIndex("PI.tab_AutoresIntDA", new[] { "DAExternoId" });
            DropIndex("PI.tab_AutoresIntDAPatrimonio", new[] { "TipoEmpleadoId" });
            DropIndex("PI.tab_AutoresIntDAPatrimonio", new[] { "TipoBecaId" });
            DropIndex("PI.tab_AutoresIntDAPatrimonio", new[] { "CategoriaId" });
            DropIndex("PI.tab_AutoresIntPIPatrimonio", new[] { "RequisicionesPIId" });
            DropIndex("PI.tab_SolicitudesDA", new[] { "RamaDAId" });
            DropIndex("PI.tab_SolicitudesDA", new[] { "TipoDerivadaDAId" });
            DropIndex("PI.tab_SolicitudParticiantesDA", new[] { "SolicitudesDAId" });
            DropIndex("PI.tab_SolicitudParticiantesDA", new[] { "AutoresIntDAPatrimonioId" });
            DropIndex("PI.tab_SolicitudParticiantesDA", new[] { "TipoParticipacionDAId" });
            DropTable("PI.tab_AutoresExtDA");
            DropTable("PI.tab_AutoresIntDA");
            DropTable("PI.cat_RamaDA");
            DropTable("PI.tab_DAExterno");
            //DropTable("GEN.Adjunto");
            //DropTable("GEN.cat_Modulo");
            //DropTable("GEN.cat_Funciones");
            //DropTable("GEN.cat_EstadoFlujo");
            
            DropTable("PI.tab_AutoresExtPIPatrimonio");
            DropTable("PI.tab_RequisicionesPI");
            DropTable("PI.cat_TipoPI");
            //DropTable("GEN.cat_UnidadOrganizacional");
            //DropTable("GEN.cat_TipoUnidad");
            DropTable("PI.tab_AutoresIndustrialExt");
            DropTable("PI.tab_PIExterno");
            DropTable("PI.tab_AutoresIndustrialInt");
            
            DropTable("PI.tab_AutoresIntDAPatrimonio");
            //DropTable("GEN.cat_Categoria");
            //DropTable("CH.cat_TipoBecas");
            DropTable("PI.cat_TipoEmpleado");
            DropTable("PI.tab_AutoresIntPIPatrimonio");
            DropTable("PI.tab_SolicitudesDA");
            DropTable("PI.cat_TipoDerivadaDA");
            DropTable("PI.tab_SolicitudParticiantesDA");
            DropTable("PI.tab_TipoParticipacionDA");
        }
        
        public override void Down()
        {
            CreateTable(
                "PI.tab_TipoParticipacionDA",
                c => new
                    {
                        TipoParticipacionDAId = c.Int(nullable: false, identity: true),
                        Nombre = c.String(),
                    })
                .PrimaryKey(t => t.TipoParticipacionDAId);
            
            CreateTable(
                "PI.tab_SolicitudParticiantesDA",
                c => new
                    {
                        SolicitudParticiantesDAId = c.Int(nullable: false, identity: true),
                        SolicitudesDAId = c.Int(nullable: false),
                        AutoresIntDAPatrimonioId = c.Int(nullable: false),
                        TipoParticipacionDAId = c.Int(nullable: false),
                        Porcentaje = c.Int(nullable: false),
                    })
                .PrimaryKey(t => t.SolicitudParticiantesDAId);
            
            CreateTable(
                "PI.cat_TipoDerivadaDA",
                c => new
                    {
                        TipoDerivadaDAId = c.Int(nullable: false, identity: true),
                        Descripcion = c.String(),
                    })
                .PrimaryKey(t => t.TipoDerivadaDAId);
            
            CreateTable(
                "PI.tab_SolicitudesDA",
                c => new
                    {
                        SolicitudesDAId = c.Int(nullable: false, identity: true),
                        NumeroSolicitud = c.Int(nullable: false),
                        Fecha = c.DateTime(nullable: false),
                        ClavePersona = c.String(),
                        TituloObra = c.String(),
                        SintesisObra = c.String(maxLength: 200),
                        RamaDAId = c.Int(nullable: false),
                        DadoConocer = c.Int(nullable: false),
                        FechaConocer = c.DateTime(),
                        Primigenia = c.Int(nullable: false),
                        Derivada = c.Int(nullable: false),
                        TipoDerivadaDAId = c.Int(nullable: false),
                        TituloPrimigenia = c.String(maxLength: 140),
                        Comentarios = c.String(maxLength: 100),
                        FechaRegistro = c.DateTime(),
                        RegistroPublico = c.String(maxLength: 50),
                        ComentarioRegistro = c.String(maxLength: 100),
                        Monto = c.Single(),
                        FechaCertificacion = c.DateTime(),
                        ComentarioCertificacion = c.String(maxLength: 100),
                        Legajo = c.String(maxLength: 100),
                        Anaquel = c.String(maxLength: 100),
                        Seccion = c.String(maxLength: 100),
                        FechaUbicacion = c.DateTime(),
                        ComentarioUbicacion = c.String(maxLength: 500),
                        CorreoEnviadoGerentes = c.Int(nullable: false),
                    })
                .PrimaryKey(t => t.SolicitudesDAId);
            
            CreateTable(
                "PI.tab_AutoresIntPIPatrimonio",
                c => new
                    {
                        AutoresIntPIPatrimonioId = c.Int(nullable: false, identity: true),
                        RequisicionesPIId = c.Int(nullable: false),
                        ClavePersona = c.String(),
                    })
                .PrimaryKey(t => t.AutoresIntPIPatrimonioId);
            
            CreateTable(
                "PI.cat_TipoEmpleado",
                c => new
                    {
                        TipoEmpleadoId = c.Int(nullable: false, identity: true),
                        Clave = c.String(),
                        Descripcion = c.String(),
                    })
                .PrimaryKey(t => t.TipoEmpleadoId);
            
            //CreateTable(
            //    "CH.cat_TipoBecas",
            //    c => new
            //        {
            //            TipoBecaId = c.Int(nullable: false, identity: true),
            //            FechaEfectiva = c.DateTime(nullable: false),
            //            Descripcion = c.String(maxLength: 200),
            //            DescripcionCorta = c.String(maxLength: 50),
            //            Estado = c.Int(nullable: false),
            //        })
            //    .PrimaryKey(t => t.TipoBecaId);
            
            //CreateTable(
            //    "GEN.cat_Categoria",
            //    c => new
            //        {
            //            CategoriaId = c.String(nullable: false, maxLength: 128),
            //            Descripcion = c.String(maxLength: 100),
            //            NivelInvestigador = c.String(maxLength: 5),
            //            Estado = c.Int(nullable: false),
            //        })
            //    .PrimaryKey(t => t.CategoriaId);
            
            CreateTable(
                "PI.tab_AutoresIntDAPatrimonio",
                c => new
                    {
                        AutoresIntDAPatrimonioId = c.Int(nullable: false, identity: true),
                        TipoEmpleadoId = c.Int(nullable: false),
                        ApellidoPaterno = c.String(),
                        ApellidoMaterno = c.String(),
                        Nombre = c.String(),
                        FechaNacimiento = c.DateTime(nullable: false),
                        LugarNacimiento = c.String(maxLength: 50),
                        Nacionalidad = c.String(maxLength: 50),
                        RFC = c.String(maxLength: 50),
                        CorreoElectronico = c.String(maxLength: 50),
                        Telefono = c.String(maxLength: 50),
                        Fax = c.String(maxLength: 50),
                        Calle = c.String(maxLength: 50),
                        NumeroExterior = c.String(maxLength: 50),
                        NumeroInterior = c.String(maxLength: 50),
                        Colonia = c.String(maxLength: 50),
                        Municipio = c.String(maxLength: 50),
                        CP = c.String(maxLength: 50),
                        Pais = c.String(maxLength: 50),
                        EntidadFederativa = c.String(maxLength: 50),
                        ClaveUnidad = c.String(maxLength: 10),
                        FechaEfectiva = c.DateTime(nullable: false),
                        TipoBecaId = c.Int(nullable: false),
                        NumeroBecario = c.String(),
                        CategoriaId = c.String(maxLength: 128),
                        ClavePersona = c.String(),
                    })
                .PrimaryKey(t => t.AutoresIntDAPatrimonioId);
            
            CreateTable(
                "PI.tab_AutoresIntDA",
                c => new
                    {
                        AutoresIntDAId = c.Int(nullable: false, identity: true),
                        DAExternoId = c.Int(nullable: false),
                        ClavePersona = c.String(),
                        Contribucion = c.Single(nullable: false),
                        Estado = c.Int(nullable: false),
                    })
                .PrimaryKey(t => t.AutoresIntDAId);
            
            CreateTable(
                "PI.tab_AutoresIndustrialInt",
                c => new
                    {
                        AutoresIndustrialIntId = c.Int(nullable: false, identity: true),
                        PIExternoId = c.Int(nullable: false),
                        ClavePersona = c.String(),
                        Contribucion = c.Single(nullable: false),
                        Estado = c.Int(nullable: false),
                    })
                .PrimaryKey(t => t.AutoresIndustrialIntId);
            
            CreateTable(
                "PI.tab_PIExterno",
                c => new
                    {
                        PIExternoId = c.Int(nullable: false, identity: true),
                        ClavePersona = c.String(),
                        FechaValidacion = c.DateTime(),
                        EstadoFlujoId = c.Int(nullable: false),
                        Titulo = c.String(),
                        TipoPIId = c.Int(nullable: false),
                        Estado = c.String(),
                        NumSolicitudTitulo = c.String(),
                        FechaPresentacion = c.DateTime(nullable: false),
                        NumExpedicionTitulo = c.String(),
                        FechaExpedicionTitulo = c.DateTime(nullable: false),
                        AdjuntoId = c.Long(),
                    })
                .PrimaryKey(t => t.PIExternoId);
            
            CreateTable(
                "PI.tab_AutoresIndustrialExt",
                c => new
                    {
                        AutoresIndustrialExtId = c.Int(nullable: false, identity: true),
                        PIExternoId = c.Int(nullable: false),
                        Nombre = c.String(),
                        Institucion = c.String(),
                        Contribucion = c.Single(nullable: false),
                    })
                .PrimaryKey(t => t.AutoresIndustrialExtId);
            
            //CreateTable(
            //    "GEN.cat_TipoUnidad",
            //    c => new
            //        {
            //            TipoUnidadID = c.Int(nullable: false, identity: true),
            //            Descripcion = c.String(maxLength: 100),
            //            Estado = c.Int(nullable: false),
            //            FechaEfectiva = c.DateTime(nullable: false),
            //        })
            //    .PrimaryKey(t => t.TipoUnidadID);
            
            //CreateTable(
            //    "GEN.cat_UnidadOrganizacional",
            //    c => new
            //        {
            //            ClaveUnidad = c.String(nullable: false, maxLength: 10),
            //            FechaEfectiva = c.DateTime(nullable: false),
            //            NombreUnidad = c.String(maxLength: 200),
            //            tipoO = c.Int(nullable: false),
            //            padre = c.String(),
            //            ClaveResponsable = c.String(),
            //            Localizacion = c.String(maxLength: 100),
            //            Estado = c.Int(nullable: false),
            //        })
            //    .PrimaryKey(t => new { t.ClaveUnidad, t.FechaEfectiva });
            
            CreateTable(
                "PI.cat_TipoPI",
                c => new
                    {
                        TipoPIId = c.Int(nullable: false, identity: true),
                        Descripcion = c.String(),
                    })
                .PrimaryKey(t => t.TipoPIId);
            
            CreateTable(
                "PI.tab_RequisicionesPI",
                c => new
                    {
                        ClaveUnidad = c.String(maxLength: 10),
                        FechaEfectiva = c.DateTime(nullable: false),
                        RequisicionesPIId = c.Int(nullable: false, identity: true),
                        NumSolicitud = c.Int(nullable: false),
                        ClavePersona = c.String(),
                        TipoPIId = c.Int(nullable: false),
                        Titulo = c.String(),
                        NumSolicitudIMPI = c.String(),
                        NumTituloIMPI = c.String(),
                        FechaPresentacion = c.DateTime(),
                        FechaRecepcionTitulo = c.DateTime(),
                        FechaSolicitud = c.DateTime(),
                        FechaExamenFormaRecibido = c.DateTime(),
                        FechaExamenFondoRecibido = c.DateTime(),
                        FechaExpidicionTitulo = c.DateTime(),
                        DivicionId = c.String(),
                    })
                .PrimaryKey(t => t.RequisicionesPIId);
            
            CreateTable(
                "PI.tab_AutoresExtPIPatrimonio",
                c => new
                    {
                        AutoresExtPIPatrimonioId = c.Int(nullable: false, identity: true),
                        RequisicionesPIId = c.Int(nullable: false),
                        Nombre = c.String(),
                    })
                .PrimaryKey(t => t.AutoresExtPIPatrimonioId);
            
            CreateTable(
                "PI.cat_RamaDA",
                c => new
                    {
                        RamaDAId = c.Int(nullable: false, identity: true),
                        Descripcion = c.String(),
                    })
                .PrimaryKey(t => t.RamaDAId);
            
            //CreateTable(
            //    "GEN.cat_EstadoFlujo",
            //    c => new
            //        {
            //            EstadoFlujoId = c.Int(nullable: false, identity: true),
            //            Descripcion = c.String(maxLength: 200),
            //            DescripcionCorta = c.String(maxLength: 50),
            //            Estado = c.Int(),
            //        })
            //    .PrimaryKey(t => t.EstadoFlujoId);
            
            //CreateTable(
            //    "GEN.cat_Funciones",
            //    c => new
            //        {
            //            FuncionesId = c.Int(nullable: false, identity: true),
            //            Descripcion = c.String(maxLength: 255),
            //            Nombre = c.String(maxLength: 100),
            //            Url = c.String(maxLength: 255),
            //            Nivel = c.Int(nullable: false),
            //            Secuencia = c.Int(nullable: false),
            //            Estado = c.Int(nullable: false),
            //            IdPadre = c.Int(),
            //            IdModulo = c.String(nullable: false, maxLength: 3),
            //            ClaseIcono = c.String(),
            //            State = c.String(),
            //        })
            //    .PrimaryKey(t => t.FuncionesId);
            
            //CreateTable(
            //    "GEN.cat_Modulo",
            //    c => new
            //        {
            //            ModuloId = c.String(nullable: false, maxLength: 3),
            //            Descripcion = c.String(),
            //            Url = c.String(),
            //            UrlImagen = c.String(),
            //            Secuencia = c.Int(nullable: false),
            //            Estado = c.Int(nullable: false),
            //            FechaEfectiva = c.DateTime(nullable: false),
            //        })
            //    .PrimaryKey(t => t.ModuloId);
            
            //CreateTable(
            //    "GEN.Adjunto",
            //    c => new
            //        {
            //            AdjuntoId = c.Long(nullable: false, identity: true),
            //            RutaCompleta = c.String(nullable: false),
            //            nombre = c.String(),
            //            ModuloId = c.String(maxLength: 3),
            //        })
            //    .PrimaryKey(t => t.AdjuntoId);
            
            CreateTable(
                "PI.tab_DAExterno",
                c => new
                    {
                        DAExternoId = c.Int(nullable: false, identity: true),
                        ClavePersona = c.String(),
                        FechaValidacion = c.DateTime(),
                        EstadoFlujoId = c.Int(nullable: false),
                        Titulo = c.String(),
                        Sintesis = c.String(),
                        RamaDAId = c.Int(nullable: false),
                        Indautor = c.String(),
                        FechaCertificado = c.DateTime(nullable: false),
                        AdjuntoId = c.Long(),
                    })
                .PrimaryKey(t => t.DAExternoId);
            
            CreateTable(
                "PI.tab_AutoresExtDA",
                c => new
                    {
                        AutoresExtDAId = c.Int(nullable: false, identity: true),
                        DAExternoId = c.Int(nullable: false),
                        Nombre = c.String(),
                        Institucion = c.String(),
                        Contribucion = c.Single(nullable: false),
                    })
                .PrimaryKey(t => t.AutoresExtDAId);
            
            CreateIndex("PI.tab_SolicitudParticiantesDA", "TipoParticipacionDAId");
            CreateIndex("PI.tab_SolicitudParticiantesDA", "AutoresIntDAPatrimonioId");
            CreateIndex("PI.tab_SolicitudParticiantesDA", "SolicitudesDAId");
            CreateIndex("PI.tab_SolicitudesDA", "TipoDerivadaDAId");
            CreateIndex("PI.tab_SolicitudesDA", "RamaDAId");
            CreateIndex("PI.tab_AutoresIntPIPatrimonio", "RequisicionesPIId");
            CreateIndex("PI.tab_AutoresIntDAPatrimonio", "CategoriaId");
            CreateIndex("PI.tab_AutoresIntDAPatrimonio", "TipoBecaId");
            CreateIndex("PI.tab_AutoresIntDAPatrimonio", "TipoEmpleadoId");
            CreateIndex("PI.tab_AutoresIntDA", "DAExternoId");
            CreateIndex("PI.tab_AutoresIndustrialInt", "PIExternoId");
            CreateIndex("PI.tab_PIExterno", "AdjuntoId");
            CreateIndex("PI.tab_PIExterno", "TipoPIId");
            CreateIndex("PI.tab_PIExterno", "EstadoFlujoId");
            CreateIndex("PI.tab_AutoresIndustrialExt", "PIExternoId");
            //CreateIndex("GEN.cat_UnidadOrganizacional", "tipoO");
            CreateIndex("PI.tab_RequisicionesPI", "TipoPIId");
            CreateIndex("PI.tab_RequisicionesPI", new[] { "ClaveUnidad", "FechaEfectiva" });
            CreateIndex("PI.tab_AutoresExtPIPatrimonio", "RequisicionesPIId");
            //CreateIndex("GEN.cat_Funciones", "IdModulo");
            //CreateIndex("GEN.cat_Funciones", "IdPadre");
            //CreateIndex("GEN.Adjunto", "ModuloId");
            CreateIndex("PI.tab_DAExterno", "AdjuntoId");
            CreateIndex("PI.tab_DAExterno", "RamaDAId");
            CreateIndex("PI.tab_DAExterno", "EstadoFlujoId");
            CreateIndex("PI.tab_AutoresExtDA", "DAExternoId");
            AddForeignKey("PI.tab_SolicitudParticiantesDA", "TipoParticipacionDAId", "PI.tab_TipoParticipacionDA", "TipoParticipacionDAId", cascadeDelete: true);
            AddForeignKey("PI.tab_SolicitudParticiantesDA", "SolicitudesDAId", "PI.tab_SolicitudesDA", "SolicitudesDAId", cascadeDelete: true);
            AddForeignKey("PI.tab_SolicitudParticiantesDA", "AutoresIntDAPatrimonioId", "PI.tab_AutoresIntDAPatrimonio", "AutoresIntDAPatrimonioId", cascadeDelete: true);
            AddForeignKey("PI.tab_SolicitudesDA", "TipoDerivadaDAId", "PI.cat_TipoDerivadaDA", "TipoDerivadaDAId", cascadeDelete: true);
            AddForeignKey("PI.tab_SolicitudesDA", "RamaDAId", "PI.cat_RamaDA", "RamaDAId", cascadeDelete: true);
            AddForeignKey("PI.tab_AutoresIntPIPatrimonio", "RequisicionesPIId", "PI.tab_RequisicionesPI", "RequisicionesPIId", cascadeDelete: true);
            AddForeignKey("PI.tab_AutoresIntDAPatrimonio", "TipoEmpleadoId", "PI.cat_TipoEmpleado", "TipoEmpleadoId", cascadeDelete: true);
            AddForeignKey("PI.tab_AutoresIntDAPatrimonio", "TipoBecaId", "CH.cat_TipoBecas", "TipoBecaId", cascadeDelete: true);
            AddForeignKey("PI.tab_AutoresIntDAPatrimonio", "CategoriaId", "GEN.cat_Categoria", "CategoriaId");
            AddForeignKey("PI.tab_AutoresIntDA", "DAExternoId", "PI.tab_DAExterno", "DAExternoId", cascadeDelete: true);
            AddForeignKey("PI.tab_AutoresIndustrialInt", "PIExternoId", "PI.tab_PIExterno", "PIExternoId", cascadeDelete: true);
            AddForeignKey("PI.tab_AutoresIndustrialExt", "PIExternoId", "PI.tab_PIExterno", "PIExternoId", cascadeDelete: true);
            AddForeignKey("PI.tab_PIExterno", "TipoPIId", "PI.cat_TipoPI", "TipoPIId", cascadeDelete: true);
            AddForeignKey("PI.tab_PIExterno", "EstadoFlujoId", "GEN.cat_EstadoFlujo", "EstadoFlujoId", cascadeDelete: true);
            AddForeignKey("PI.tab_PIExterno", "AdjuntoId", "GEN.Adjunto", "AdjuntoId");
            AddForeignKey("PI.tab_AutoresExtPIPatrimonio", "RequisicionesPIId", "PI.tab_RequisicionesPI", "RequisicionesPIId", cascadeDelete: true);
            AddForeignKey("PI.tab_RequisicionesPI", new[] { "ClaveUnidad", "FechaEfectiva" }, "GEN.cat_UnidadOrganizacional", new[] { "ClaveUnidad", "FechaEfectiva" });
            //AddForeignKey("GEN.cat_UnidadOrganizacional", "tipoO", "GEN.cat_TipoUnidad", "TipoUnidadID", cascadeDelete: true);
            AddForeignKey("PI.tab_RequisicionesPI", "TipoPIId", "PI.cat_TipoPI", "TipoPIId", cascadeDelete: true);
            AddForeignKey("PI.tab_AutoresExtDA", "DAExternoId", "PI.tab_DAExterno", "DAExternoId", cascadeDelete: true);
            AddForeignKey("PI.tab_DAExterno", "RamaDAId", "PI.cat_RamaDA", "RamaDAId", cascadeDelete: true);
            AddForeignKey("PI.tab_DAExterno", "EstadoFlujoId", "GEN.cat_EstadoFlujo", "EstadoFlujoId", cascadeDelete: true);
            AddForeignKey("PI.tab_DAExterno", "AdjuntoId", "GEN.Adjunto", "AdjuntoId");
            //AddForeignKey("GEN.Adjunto", "ModuloId", "GEN.cat_Modulo", "ModuloId");
            //AddForeignKey("GEN.cat_Funciones", "IdModulo", "GEN.cat_Modulo", "ModuloId", cascadeDelete: true);
            //AddForeignKey("GEN.cat_Funciones", "IdPadre", "GEN.cat_Funciones", "FuncionesId");
        }
    }
}
