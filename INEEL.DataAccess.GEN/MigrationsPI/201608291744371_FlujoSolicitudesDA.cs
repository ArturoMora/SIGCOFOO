namespace INEEL.DataAccess.GEN.MigrationsPI
{
    using System;
    using System.Data.Entity.Migrations;
    
    public partial class FlujoSolicitudesDA : DbMigration
    {
        public override void Up()
        {
            CreateTable(
                "PI.tab_AutoresIntDAPatrimonio",
                c => new
                    {
                        ClaveUnidad = c.String(maxLength: 10),
                        FechaEfectiva = c.DateTime(nullable: false),
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
                        TipoBecaId = c.Int(nullable: false),
                        NumeroBecario = c.String(),
                        CategoriaId = c.String(maxLength: 128),
                        ClavePersona = c.String(),
                    })
                .PrimaryKey(t => t.AutoresIntDAPatrimonioId)
                .ForeignKey("GEN.cat_Categoria", t => t.CategoriaId)
                .ForeignKey("CH.cat_TipoBecas", t => t.TipoBecaId, cascadeDelete: true)
                .ForeignKey("PI.cat_TipoEmpleado", t => t.TipoEmpleadoId, cascadeDelete: true)
                .ForeignKey("GEN.cat_UnidadOrganizacional", t => new { t.ClaveUnidad, t.FechaEfectiva })
                .Index(t => new { t.ClaveUnidad, t.FechaEfectiva })
                .Index(t => t.TipoEmpleadoId)
                .Index(t => t.TipoBecaId)
                .Index(t => t.CategoriaId);
            
            //CreateTable(
            //    "GEN.cat_Categoria",
            //    c => new
            //        {
            //            CategoriaId = c.String(nullable: false, maxLength: 128),
            //            Descripcion = c.String(maxLength: 100),
            //            Estado = c.Int(nullable: false),
            //        })
            //    .PrimaryKey(t => t.CategoriaId);
            
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
            
            CreateTable(
                "PI.cat_TipoEmpleado",
                c => new
                    {
                        TipoEmpleadoId = c.Int(nullable: false, identity: true),
                        Clave = c.String(),
                        Descripcion = c.String(),
                    })
                .PrimaryKey(t => t.TipoEmpleadoId);
            
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
                .PrimaryKey(t => t.SolicitudesDAId)
                .ForeignKey("PI.cat_RamaDA", t => t.RamaDAId, cascadeDelete: true)
                .ForeignKey("PI.cat_TipoDerivadaDA", t => t.TipoDerivadaDAId, cascadeDelete: true)
                .Index(t => t.RamaDAId)
                .Index(t => t.TipoDerivadaDAId);
            
            CreateTable(
                "PI.cat_TipoDerivadaDA",
                c => new
                    {
                        TipoDerivadaDAId = c.Int(nullable: false, identity: true),
                        Descripcion = c.String(),
                    })
                .PrimaryKey(t => t.TipoDerivadaDAId);
            
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
                .PrimaryKey(t => t.SolicitudParticiantesDAId)
                .ForeignKey("PI.tab_AutoresIntDAPatrimonio", t => t.AutoresIntDAPatrimonioId, cascadeDelete: true)
                .ForeignKey("PI.tab_SolicitudesDA", t => t.SolicitudesDAId, cascadeDelete: true)
                .ForeignKey("PI.tab_TipoParticipacionDA", t => t.TipoParticipacionDAId, cascadeDelete: true)
                .Index(t => t.SolicitudesDAId)
                .Index(t => t.AutoresIntDAPatrimonioId)
                .Index(t => t.TipoParticipacionDAId);
            
            CreateTable(
                "PI.tab_TipoParticipacionDA",
                c => new
                    {
                        TipoParticipacionDAId = c.Int(nullable: false, identity: true),
                        Nombre = c.String(),
                    })
                .PrimaryKey(t => t.TipoParticipacionDAId);
            
        }
        
        public override void Down()
        {
            DropForeignKey("PI.tab_SolicitudParticiantesDA", "TipoParticipacionDAId", "PI.tab_TipoParticipacionDA");
            DropForeignKey("PI.tab_SolicitudParticiantesDA", "SolicitudesDAId", "PI.tab_SolicitudesDA");
            DropForeignKey("PI.tab_SolicitudParticiantesDA", "AutoresIntDAPatrimonioId", "PI.tab_AutoresIntDAPatrimonio");
            DropForeignKey("PI.tab_SolicitudesDA", "TipoDerivadaDAId", "PI.cat_TipoDerivadaDA");
            DropForeignKey("PI.tab_SolicitudesDA", "RamaDAId", "PI.cat_RamaDA");
            //DropForeignKey("PI.tab_AutoresIntDAPatrimonio", new[] { "ClaveUnidad", "FechaEfectiva" }, "GEN.cat_UnidadOrganizacional");
            DropForeignKey("PI.tab_AutoresIntDAPatrimonio", "TipoEmpleadoId", "PI.cat_TipoEmpleado");
            //DropForeignKey("PI.tab_AutoresIntDAPatrimonio", "TipoBecaId", "CH.cat_TipoBecas");
            //DropForeignKey("PI.tab_AutoresIntDAPatrimonio", "CategoriaId", "GEN.cat_Categoria");
            DropIndex("PI.tab_SolicitudParticiantesDA", new[] { "TipoParticipacionDAId" });
            DropIndex("PI.tab_SolicitudParticiantesDA", new[] { "AutoresIntDAPatrimonioId" });
            DropIndex("PI.tab_SolicitudParticiantesDA", new[] { "SolicitudesDAId" });
            DropIndex("PI.tab_SolicitudesDA", new[] { "TipoDerivadaDAId" });
            DropIndex("PI.tab_SolicitudesDA", new[] { "RamaDAId" });
            DropIndex("PI.tab_AutoresIntDAPatrimonio", new[] { "CategoriaId" });
            DropIndex("PI.tab_AutoresIntDAPatrimonio", new[] { "TipoBecaId" });
            DropIndex("PI.tab_AutoresIntDAPatrimonio", new[] { "TipoEmpleadoId" });
            DropIndex("PI.tab_AutoresIntDAPatrimonio", new[] { "ClaveUnidad", "FechaEfectiva" });
            DropTable("PI.tab_TipoParticipacionDA");
            DropTable("PI.tab_SolicitudParticiantesDA");
            DropTable("PI.cat_TipoDerivadaDA");
            DropTable("PI.tab_SolicitudesDA");
            DropTable("PI.cat_TipoEmpleado");
            //DropTable("CH.cat_TipoBecas");
            //DropTable("GEN.cat_Categoria");
            DropTable("PI.tab_AutoresIntDAPatrimonio");
        }
    }
}
