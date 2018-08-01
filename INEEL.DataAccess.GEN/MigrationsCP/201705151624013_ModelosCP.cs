namespace INEEL.DataAccess.GEN.MigrationsCP
{
    using System;
    using System.Data.Entity.Migrations;
    
    public partial class ModelosCP : DbMigration
    {
        public override void Up()
        {
            CreateTable(
                "CP.tab_Autores",
                c => new
                    {
                        AutorId = c.Int(nullable: false, identity: true),
                        idOC = c.Int(nullable: false),
                        idMiembroCP = c.Int(nullable: false),
                        ContenidoId = c.Int(nullable: false),
                    })
                .PrimaryKey(t => t.AutorId)
                .ForeignKey("CP.cat_ListaOC", t => t.idOC, cascadeDelete: true)
                .ForeignKey("CP.tab_Miembros", t => t.idMiembroCP, cascadeDelete: true)
                .Index(t => t.idOC)
                .Index(t => t.idMiembroCP);
            
            CreateTable(
                "CP.cat_ListaOC",
                c => new
                    {
                        ListaId = c.Int(nullable: false, identity: true),
                        Nombre = c.String(),
                        Descripcion = c.String(),
                    })
                .PrimaryKey(t => t.ListaId);
            
            CreateTable(
                "CP.tab_Miembros",
                c => new
                    {
                        MiembroId = c.Int(nullable: false, identity: true),
                        idCP = c.Int(nullable: false),
                        NumEmp = c.String(),
                        rolId = c.Int(nullable: false),
                        FechaAlta = c.DateTime(nullable: false),
                        FechaBaja = c.DateTime(nullable: false),
                        Aceptacion = c.Boolean(nullable: false),
                        FechaAceptacion = c.DateTime(nullable: false),
                    })
                .PrimaryKey(t => t.MiembroId)
                .ForeignKey("CP.tab_Comunidades", t => t.idCP, cascadeDelete: true)
                .ForeignKey("CP.cat_RolesCP", t => t.rolId, cascadeDelete: true)
                .Index(t => t.idCP)
                .Index(t => t.rolId);
            
            CreateTable(
                "CP.tab_AvanceMiembros",
                c => new
                    {
                        AvanceMiembroId = c.Int(nullable: false, identity: true),
                        AvanceId = c.Int(nullable: false),
                        idMiembro = c.Int(nullable: false),
                        Participacion = c.String(),
                        FechaRegistro = c.DateTime(nullable: false),
                    })
                .PrimaryKey(t => t.AvanceMiembroId)
                .ForeignKey("CP.tab_Avance", t => t.AvanceId, cascadeDelete: true)
                .ForeignKey("CP.tab_Miembros", t => t.idMiembro, cascadeDelete: true)
                .Index(t => t.AvanceId)
                .Index(t => t.idMiembro);
            
            CreateTable(
                "CP.tab_Avance",
                c => new
                    {
                        AvanceId = c.Int(nullable: false, identity: true),
                        idResultado = c.Int(nullable: false),
                        Descripcion = c.String(),
                        AdjuntoId = c.Long(nullable: false),
                        Comentario = c.String(),
                        FechaRegistro = c.DateTime(nullable: false),
                    })
                .PrimaryKey(t => t.AvanceId)
                .ForeignKey("GEN.Adjunto", t => t.AdjuntoId, cascadeDelete: true)
                .ForeignKey("CP.tab_Resultados", t => t.idResultado, cascadeDelete: true)
                .Index(t => t.idResultado)
                .Index(t => t.AdjuntoId);
            
            
            
            
            
            
            
            CreateTable(
                "CP.tab_Resultados",
                c => new
                    {
                        ResultadoId = c.Int(nullable: false, identity: true),
                        idMeta = c.Int(nullable: false),
                        ResultadoEsperado = c.String(),
                        FechaEsperada = c.DateTime(nullable: false),
                    })
                .PrimaryKey(t => t.ResultadoId)
                .ForeignKey("CP.tab_Metas", t => t.idMeta, cascadeDelete: true)
                .Index(t => t.idMeta);
            
            CreateTable(
                "CP.tab_Metas",
                c => new
                    {
                        Metaid = c.Int(nullable: false, identity: true),
                        idCP = c.Int(nullable: false),
                        Meta = c.String(),
                        FechaRegistro = c.DateTime(nullable: false),
                        Estado = c.String(),
                        Resultado_ResultadoId = c.Int(),
                    })
                .PrimaryKey(t => t.Metaid)
                .ForeignKey("CP.tab_Comunidades", t => t.idCP, cascadeDelete: false)
                .ForeignKey("CP.tab_Resultados", t => t.Resultado_ResultadoId)
                .Index(t => t.idCP)
                .Index(t => t.Resultado_ResultadoId);
            
            CreateTable(
                "CP.tab_Comunidades",
                c => new
                    {
                        ComunidadId = c.Int(nullable: false, identity: true),
                        Descripcion = c.String(),
                        Mision = c.String(),
                        Imagen = c.Binary(),
                        FechaAlta = c.DateTime(nullable: false),
                        FechaRegistro = c.DateTime(nullable: false),
                        Estado = c.Boolean(nullable: false),
                        idCategoria = c.Int(nullable: false),
                    })
                .PrimaryKey(t => t.ComunidadId)
                .ForeignKey("CP.cat_CategoriaCP", t => t.idCategoria, cascadeDelete: true)
                .Index(t => t.idCategoria);
            
            CreateTable(
                "CP.cat_CategoriaCP",
                c => new
                    {
                        CatCPId = c.Int(nullable: false, identity: true),
                        Nombre = c.String(),
                        Descripcion = c.String(),
                        FechaRegistro = c.DateTime(nullable: false),
                        Estado = c.Boolean(nullable: false),
                        Autor = c.String(),
                    })
                .PrimaryKey(t => t.CatCPId);
            
            CreateTable(
                "CP.tab_Lineamientos",
                c => new
                    {
                        LineamientoId = c.Int(nullable: false, identity: true),
                        Nombre = c.String(),
                        FechaRegistro = c.DateTime(nullable: false),
                        AdjuntoId = c.Long(nullable: false),
                        NombreAdjunto = c.String(),
                        IdTipoLineamiento = c.Int(nullable: false),
                        idCP = c.Int(nullable: false),
                        AutorId = c.Int(nullable: false),
                    })
                .PrimaryKey(t => t.LineamientoId)
                .ForeignKey("GEN.Adjunto", t => t.AdjuntoId, cascadeDelete: true)
                .ForeignKey("CP.tab_Autores", t => t.AutorId, cascadeDelete: false)
                .ForeignKey("CP.tab_Comunidades", t => t.idCP, cascadeDelete: false)
                .ForeignKey("CP.cat_TipoLineamiento", t => t.IdTipoLineamiento, cascadeDelete: true)
                .Index(t => t.AdjuntoId)
                .Index(t => t.IdTipoLineamiento)
                .Index(t => t.idCP)
                .Index(t => t.AutorId);
            
            CreateTable(
                "CP.cat_TipoLineamiento",
                c => new
                    {
                        TipoLineamientoId = c.Int(nullable: false, identity: true),
                        Nombre = c.String(),
                        Descripcion = c.String(),
                        FechaRegistro = c.DateTime(nullable: false),
                        Autor = c.String(),
                        Estado = c.Boolean(nullable: false),
                    })
                .PrimaryKey(t => t.TipoLineamientoId);
            
            CreateTable(
                "CP.tab_Noticia",
                c => new
                    {
                        NoticiaId = c.Int(nullable: false, identity: true),
                        Nombre = c.String(),
                        Descripcion = c.String(),
                        FechaRegistro = c.DateTime(nullable: false),
                        Estado = c.Boolean(nullable: false),
                        idComunidad = c.Int(nullable: false),
                    })
                .PrimaryKey(t => t.NoticiaId)
                .ForeignKey("CP.tab_Comunidades", t => t.idComunidad, cascadeDelete: true)
                .Index(t => t.idComunidad);
            
            CreateTable(
                "CP.cat_RolesCP",
                c => new
                    {
                        RolId = c.Int(nullable: false, identity: true),
                        Nombre = c.String(),
                        Descripcion = c.String(),
                        Autor = c.String(),
                        FechaRegistro = c.DateTime(nullable: false),
                    })
                .PrimaryKey(t => t.RolId);
            
            CreateTable(
                "CP.tab_SitioInteres",
                c => new
                    {
                        SitioId = c.Int(nullable: false, identity: true),
                        Titulo = c.String(maxLength: 250),
                        Descripcion = c.String(maxLength: 300),
                        Liga = c.String(maxLength: 300),
                        FechaRegistro = c.DateTime(nullable: false),
                        idMiembroCP = c.Int(nullable: false),
                        idCategoria = c.Int(nullable: false),
                    })
                .PrimaryKey(t => t.SitioId)
                .ForeignKey("CP.cat_CategoriaSitio", t => t.idCategoria, cascadeDelete: true)
                .ForeignKey("CP.tab_Miembros", t => t.idMiembroCP, cascadeDelete: true)
                .Index(t => t.idMiembroCP)
                .Index(t => t.idCategoria);
            
            CreateTable(
                "CP.cat_CategoriaSitio",
                c => new
                    {
                        CatSitioId = c.Int(nullable: false, identity: true),
                        NombreCategoria = c.String(),
                        Descripcion = c.String(),
                        FechaRegistro = c.DateTime(nullable: false),
                        Autor = c.String(),
                        Estado = c.Boolean(nullable: false),
                    })
                .PrimaryKey(t => t.CatSitioId);
            
            CreateTable(
                "CP.tab_Comentarios",
                c => new
                    {
                        ComentarioId = c.Int(nullable: false, identity: true),
                        Comentario = c.String(),
                        idMiembroCP = c.Int(nullable: false),
                        FechaRegistro = c.DateTime(nullable: false),
                    })
                .PrimaryKey(t => t.ComentarioId)
                .ForeignKey("CP.tab_Miembros", t => t.idMiembroCP, cascadeDelete: true)
                .Index(t => t.idMiembroCP);
            
            CreateTable(
                "CP.tab_ComentariosLCP",
                c => new
                    {
                        ComentarioId = c.Int(nullable: false, identity: true),
                        idLineamiento = c.Int(nullable: false),
                        Comentario = c.String(),
                        idMiembro = c.Int(nullable: false),
                        FechaRegistro = c.DateTime(nullable: false),
                    })
                .PrimaryKey(t => t.ComentarioId)
                .ForeignKey("CP.tab_Lineamientos", t => t.idLineamiento, cascadeDelete: true)
                .ForeignKey("CP.tab_Miembros", t => t.idMiembro, cascadeDelete: true)
                .Index(t => t.idLineamiento)
                .Index(t => t.idMiembro);
            
            CreateTable(
                "CP.tab_Documento",
                c => new
                    {
                        DocumentoId = c.Int(nullable: false, identity: true),
                        idMiembroCP = c.Int(nullable: false),
                        idTipoDocumento = c.Int(nullable: false),
                        idAdjunto = c.Long(nullable: false),
                        PalabraClave = c.String(),
                        TipoAcceso = c.String(),
                        FechaRegistro = c.DateTime(nullable: false),
                        Estado = c.Boolean(nullable: false),
                    })
                .PrimaryKey(t => t.DocumentoId)
                .ForeignKey("GEN.Adjunto", t => t.idAdjunto, cascadeDelete: true)
                .ForeignKey("CP.tab_Miembros", t => t.idMiembroCP, cascadeDelete: true)
                .ForeignKey("CP.cat_TipoDocumento", t => t.idTipoDocumento, cascadeDelete: true)
                .Index(t => t.idMiembroCP)
                .Index(t => t.idTipoDocumento)
                .Index(t => t.idAdjunto);
            
            CreateTable(
                "CP.cat_TipoDocumento",
                c => new
                    {
                        TipoDocumentoId = c.Int(nullable: false, identity: true),
                        Nombre = c.String(),
                        Descripcion = c.String(),
                        FechaRegistro = c.DateTime(nullable: false),
                        Autor = c.String(),
                        Estado = c.Boolean(nullable: false),
                    })
                .PrimaryKey(t => t.TipoDocumentoId);
            
            CreateTable(
                "CP.tab_Especialistas",
                c => new
                    {
                        EspecialistaId = c.Int(nullable: false, identity: true),
                        Nombre = c.String(),
                        IdComunidad = c.Int(nullable: false),
                        TipoEspecialista = c.String(),
                        IdAdjunto = c.Long(nullable: false),
                        NumEmpleado = c.String(),
                        Especialidad = c.String(),
                        Correo = c.String(),
                        Empresa = c.String(),
                        FechaRegistro = c.DateTime(nullable: false),
                    })
                .PrimaryKey(t => t.EspecialistaId)
                .ForeignKey("GEN.Adjunto", t => t.IdAdjunto, cascadeDelete: true)
                .ForeignKey("CP.tab_Comunidades", t => t.IdComunidad, cascadeDelete: true)
                .Index(t => t.IdComunidad)
                .Index(t => t.IdAdjunto);
            
            CreateTable(
                "CP.tab_EstadoArte",
                c => new
                    {
                        EstadoArteId = c.Int(nullable: false, identity: true),
                        Nombre = c.String(),
                        Descripcion = c.String(),
                        FechaRegistro = c.DateTime(nullable: false),
                        PersonaAutoriza = c.String(),
                        PalabrasClave = c.String(),
                        adjuntoId = c.Long(nullable: false),
                        TipoAcceso = c.String(),
                        Estado = c.Boolean(nullable: false),
                        idCP = c.Int(nullable: false),
                        AutorId = c.Int(nullable: false),
                    })
                .PrimaryKey(t => t.EstadoArteId)
                .ForeignKey("GEN.Adjunto", t => t.adjuntoId, cascadeDelete: true)
                .ForeignKey("CP.tab_Autores", t => t.AutorId, cascadeDelete: true)
                .ForeignKey("CP.tab_Comunidades", t => t.idCP, cascadeDelete: false)
                .Index(t => t.adjuntoId)
                .Index(t => t.idCP)
                .Index(t => t.AutorId);
            
            CreateTable(
                "CP.tab_EstudiosEspecializados",
                c => new
                    {
                        EstudiosId = c.Int(nullable: false, identity: true),
                        Nombre = c.String(),
                        Descripcion = c.String(),
                        FechaRegistro = c.DateTime(nullable: false),
                        PersonaAutoriza = c.String(),
                        PalabrasClave = c.String(),
                        adjuntoId = c.Long(nullable: false),
                        TipoAcceso = c.String(),
                        Estado = c.Boolean(nullable: false),
                        idCP = c.Int(nullable: false),
                        AutorId = c.Int(nullable: false),
                    })
                .PrimaryKey(t => t.EstudiosId)
                .ForeignKey("GEN.Adjunto", t => t.adjuntoId, cascadeDelete: true)
                .ForeignKey("CP.tab_Autores", t => t.AutorId, cascadeDelete: true)
                .ForeignKey("CP.tab_Comunidades", t => t.idCP, cascadeDelete: false)
                .Index(t => t.adjuntoId)
                .Index(t => t.idCP)
                .Index(t => t.AutorId);
            
            CreateTable(
                "CP.tab_InformeAnual",
                c => new
                    {
                        InformeId = c.Int(nullable: false, identity: true),
                        Nombre = c.String(),
                        AnioCorrespondiente = c.Int(nullable: false),
                        idLineaInv = c.Int(nullable: false),
                        FechaRegistro = c.DateTime(nullable: false),
                        PalabrasClave = c.String(),
                        AdjuntoId = c.Long(nullable: false),
                        TipoAcceso = c.String(),
                        Estado = c.Boolean(nullable: false),
                        idCP = c.Int(nullable: false),
                        AutorId = c.Int(nullable: false),
                    })
                .PrimaryKey(t => t.InformeId)
                .ForeignKey("GEN.Adjunto", t => t.AdjuntoId, cascadeDelete: true)
                .ForeignKey("CP.tab_Autores", t => t.AutorId, cascadeDelete: true)
                .ForeignKey("CP.tab_Comunidades", t => t.idCP, cascadeDelete: false)
                .ForeignKey("CR.cat_LineaDesarrolloTecnologico", t => t.idLineaInv, cascadeDelete: true)
                .Index(t => t.idLineaInv)
                .Index(t => t.AdjuntoId)
                .Index(t => t.idCP)
                .Index(t => t.AutorId);
            
           
            
            CreateTable(
                "CP.tab_MapasRuta",
                c => new
                    {
                        MapaId = c.Int(nullable: false, identity: true),
                        Nombre = c.String(),
                        Descripcion = c.String(),
                        FechaRegistro = c.DateTime(nullable: false),
                        PalabrasClave = c.String(),
                        PersonaAutoriza = c.String(),
                        AdjuntoId = c.Long(nullable: false),
                        TipoAcceso = c.String(),
                        Estado = c.String(),
                        idCP = c.Int(nullable: false),
                        AutorId = c.Int(nullable: false),
                    })
                .PrimaryKey(t => t.MapaId)
                .ForeignKey("GEN.Adjunto", t => t.AdjuntoId, cascadeDelete: true)
                .ForeignKey("CP.tab_Autores", t => t.AutorId, cascadeDelete: true)
                .ForeignKey("CP.tab_Comunidades", t => t.idCP, cascadeDelete: false)
                .Index(t => t.AdjuntoId)
                .Index(t => t.idCP)
                .Index(t => t.AutorId);
            
            CreateTable(
                "CP.tab_PlanAnual",
                c => new
                    {
                        PlanId = c.Int(nullable: false, identity: true),
                        Nombre = c.String(),
                        AnioCorrespondiente = c.Int(nullable: false),
                        idLineaInv = c.Int(nullable: false),
                        FechaRegistro = c.DateTime(nullable: false),
                        PalabrasClave = c.String(),
                        AdjuntoId = c.Long(nullable: false),
                        TipoAcceso = c.String(),
                        Estado = c.String(),
                        idCP = c.Int(nullable: false),
                        AutorId = c.Int(nullable: false),
                    })
                .PrimaryKey(t => t.PlanId)
                .ForeignKey("GEN.Adjunto", t => t.AdjuntoId, cascadeDelete: true)
                .ForeignKey("CP.tab_Autores", t => t.AutorId, cascadeDelete: true)
                .ForeignKey("CP.tab_Comunidades", t => t.idCP, cascadeDelete: false)
                .ForeignKey("CR.cat_LineaDesarrolloTecnologico", t => t.idLineaInv, cascadeDelete: true)
                .Index(t => t.idLineaInv)
                .Index(t => t.AdjuntoId)
                .Index(t => t.idCP)
                .Index(t => t.AutorId);
            
            CreateTable(
                "CP.tab_Post",
                c => new
                    {
                        PostId = c.Int(nullable: false, identity: true),
                        Tema = c.String(),
                        Descripcion = c.String(),
                        FechaRegistro = c.DateTime(nullable: false),
                        idMiembroCP = c.Int(nullable: false),
                        adjuntoId = c.Long(nullable: false),
                    })
                .PrimaryKey(t => t.PostId)
                .ForeignKey("GEN.Adjunto", t => t.adjuntoId, cascadeDelete: true)
                .ForeignKey("CP.tab_Miembros", t => t.idMiembroCP, cascadeDelete: true)
                .Index(t => t.idMiembroCP)
                .Index(t => t.adjuntoId);
            
            CreateTable(
                "CP.tab_Preguntas",
                c => new
                    {
                        PreguntaId = c.Int(nullable: false, identity: true),
                        idMiembroCP = c.Int(nullable: false),
                        Pregunta = c.String(),
                        Respuesta = c.String(),
                        FechaRegistro = c.DateTime(nullable: false),
                    })
                .PrimaryKey(t => t.PreguntaId)
                .ForeignKey("CP.tab_Miembros", t => t.idMiembroCP, cascadeDelete: true)
                .Index(t => t.idMiembroCP);
            
            CreateTable(
                "CP.tab_TemasInnovacion",
                c => new
                    {
                        TemaId = c.Int(nullable: false, identity: true),
                        Nombre = c.String(),
                        Descripcion = c.String(),
                        FechaRegistro = c.DateTime(nullable: false),
                        PalabrasClave = c.String(),
                        PersonaAutoriza = c.String(),
                        AdjuntoId = c.Long(nullable: false),
                        TipoAcceso = c.String(),
                        Estado = c.Boolean(nullable: false),
                        idCP = c.Int(nullable: false),
                        AutorId = c.Int(nullable: false),
                    })
                .PrimaryKey(t => t.TemaId)
                .ForeignKey("GEN.Adjunto", t => t.AdjuntoId, cascadeDelete: true)
                .ForeignKey("CP.tab_Autores", t => t.AutorId, cascadeDelete: true)
                .ForeignKey("CP.tab_Comunidades", t => t.idCP, cascadeDelete: false)
                .Index(t => t.AdjuntoId)
                .Index(t => t.idCP)
                .Index(t => t.AutorId);
            
        }
        
        public override void Down()
        {
            DropForeignKey("CP.tab_TemasInnovacion", "idCP", "CP.tab_Comunidades");
            DropForeignKey("CP.tab_TemasInnovacion", "AutorId", "CP.tab_Autores");
            DropForeignKey("CP.tab_TemasInnovacion", "AdjuntoId", "GEN.Adjunto");
            DropForeignKey("CP.tab_Preguntas", "idMiembroCP", "CP.tab_Miembros");
            DropForeignKey("CP.tab_Post", "idMiembroCP", "CP.tab_Miembros");
            DropForeignKey("CP.tab_Post", "adjuntoId", "GEN.Adjunto");
            DropForeignKey("CP.tab_PlanAnual", "idLineaInv", "CR.cat_LineaDesarrolloTecnologico");
            DropForeignKey("CP.tab_PlanAnual", "idCP", "CP.tab_Comunidades");
            DropForeignKey("CP.tab_PlanAnual", "AutorId", "CP.tab_Autores");
            DropForeignKey("CP.tab_PlanAnual", "AdjuntoId", "GEN.Adjunto");
            DropForeignKey("CP.tab_MapasRuta", "idCP", "CP.tab_Comunidades");
            DropForeignKey("CP.tab_MapasRuta", "AutorId", "CP.tab_Autores");
            DropForeignKey("CP.tab_MapasRuta", "AdjuntoId", "GEN.Adjunto");
            DropForeignKey("CP.tab_InformeAnual", "idLineaInv", "CR.cat_LineaDesarrolloTecnologico");
            DropForeignKey("CP.tab_InformeAnual", "idCP", "CP.tab_Comunidades");
            DropForeignKey("CP.tab_InformeAnual", "AutorId", "CP.tab_Autores");
            DropForeignKey("CP.tab_InformeAnual", "AdjuntoId", "GEN.Adjunto");
            DropForeignKey("CP.tab_EstudiosEspecializados", "idCP", "CP.tab_Comunidades");
            DropForeignKey("CP.tab_EstudiosEspecializados", "AutorId", "CP.tab_Autores");
            DropForeignKey("CP.tab_EstudiosEspecializados", "adjuntoId", "GEN.Adjunto");
            DropForeignKey("CP.tab_EstadoArte", "idCP", "CP.tab_Comunidades");
            DropForeignKey("CP.tab_EstadoArte", "AutorId", "CP.tab_Autores");
            DropForeignKey("CP.tab_EstadoArte", "adjuntoId", "GEN.Adjunto");
            DropForeignKey("CP.tab_Especialistas", "IdComunidad", "CP.tab_Comunidades");
            DropForeignKey("CP.tab_Especialistas", "IdAdjunto", "GEN.Adjunto");
            DropForeignKey("CP.tab_Documento", "idTipoDocumento", "CP.cat_TipoDocumento");
            DropForeignKey("CP.tab_Documento", "idMiembroCP", "CP.tab_Miembros");
            DropForeignKey("CP.tab_Documento", "idAdjunto", "GEN.Adjunto");
            DropForeignKey("CP.tab_ComentariosLCP", "idMiembro", "CP.tab_Miembros");
            DropForeignKey("CP.tab_ComentariosLCP", "idLineamiento", "CP.tab_Lineamientos");
            DropForeignKey("CP.tab_Comentarios", "idMiembroCP", "CP.tab_Miembros");
            DropForeignKey("CP.tab_Autores", "idMiembroCP", "CP.tab_Miembros");
            DropForeignKey("CP.tab_SitioInteres", "idMiembroCP", "CP.tab_Miembros");
            DropForeignKey("CP.tab_SitioInteres", "idCategoria", "CP.cat_CategoriaSitio");
            DropForeignKey("CP.tab_Miembros", "rolId", "CP.cat_RolesCP");
            DropForeignKey("CP.tab_Miembros", "idCP", "CP.tab_Comunidades");
            DropForeignKey("CP.tab_AvanceMiembros", "idMiembro", "CP.tab_Miembros");
            DropForeignKey("CP.tab_AvanceMiembros", "AvanceId", "CP.tab_Avance");
            DropForeignKey("CP.tab_Avance", "idResultado", "CP.tab_Resultados");
            DropForeignKey("CP.tab_Resultados", "idMeta", "CP.tab_Metas");
            DropForeignKey("CP.tab_Metas", "Resultado_ResultadoId", "CP.tab_Resultados");
            DropForeignKey("CP.tab_Metas", "idCP", "CP.tab_Comunidades");
            DropForeignKey("CP.tab_Noticia", "idComunidad", "CP.tab_Comunidades");
            DropForeignKey("CP.tab_Lineamientos", "IdTipoLineamiento", "CP.cat_TipoLineamiento");
            DropForeignKey("CP.tab_Lineamientos", "idCP", "CP.tab_Comunidades");
            DropForeignKey("CP.tab_Lineamientos", "AutorId", "CP.tab_Autores");
            DropForeignKey("CP.tab_Lineamientos", "AdjuntoId", "GEN.Adjunto");
            DropForeignKey("CP.tab_Comunidades", "idCategoria", "CP.cat_CategoriaCP");
            DropForeignKey("CP.tab_Avance", "AdjuntoId", "GEN.Adjunto");
            DropForeignKey("GEN.Adjunto", "ModuloId", "GEN.cat_Modulo");
            DropForeignKey("GEN.cat_Funciones", "IdModulo", "GEN.cat_Modulo");
            DropForeignKey("GEN.cat_Funciones", "IdPadre", "GEN.cat_Funciones");
            DropForeignKey("CP.tab_Autores", "idOC", "CP.cat_ListaOC");
            DropIndex("CP.tab_TemasInnovacion", new[] { "AutorId" });
            DropIndex("CP.tab_TemasInnovacion", new[] { "idCP" });
            DropIndex("CP.tab_TemasInnovacion", new[] { "AdjuntoId" });
            DropIndex("CP.tab_Preguntas", new[] { "idMiembroCP" });
            DropIndex("CP.tab_Post", new[] { "adjuntoId" });
            DropIndex("CP.tab_Post", new[] { "idMiembroCP" });
            DropIndex("CP.tab_PlanAnual", new[] { "AutorId" });
            DropIndex("CP.tab_PlanAnual", new[] { "idCP" });
            DropIndex("CP.tab_PlanAnual", new[] { "AdjuntoId" });
            DropIndex("CP.tab_PlanAnual", new[] { "idLineaInv" });
            DropIndex("CP.tab_MapasRuta", new[] { "AutorId" });
            DropIndex("CP.tab_MapasRuta", new[] { "idCP" });
            DropIndex("CP.tab_MapasRuta", new[] { "AdjuntoId" });
            DropIndex("CP.tab_InformeAnual", new[] { "AutorId" });
            DropIndex("CP.tab_InformeAnual", new[] { "idCP" });
            DropIndex("CP.tab_InformeAnual", new[] { "AdjuntoId" });
            DropIndex("CP.tab_InformeAnual", new[] { "idLineaInv" });
            DropIndex("CP.tab_EstudiosEspecializados", new[] { "AutorId" });
            DropIndex("CP.tab_EstudiosEspecializados", new[] { "idCP" });
            DropIndex("CP.tab_EstudiosEspecializados", new[] { "adjuntoId" });
            DropIndex("CP.tab_EstadoArte", new[] { "AutorId" });
            DropIndex("CP.tab_EstadoArte", new[] { "idCP" });
            DropIndex("CP.tab_EstadoArte", new[] { "adjuntoId" });
            DropIndex("CP.tab_Especialistas", new[] { "IdAdjunto" });
            DropIndex("CP.tab_Especialistas", new[] { "IdComunidad" });
            DropIndex("CP.tab_Documento", new[] { "idAdjunto" });
            DropIndex("CP.tab_Documento", new[] { "idTipoDocumento" });
            DropIndex("CP.tab_Documento", new[] { "idMiembroCP" });
            DropIndex("CP.tab_ComentariosLCP", new[] { "idMiembro" });
            DropIndex("CP.tab_ComentariosLCP", new[] { "idLineamiento" });
            DropIndex("CP.tab_Comentarios", new[] { "idMiembroCP" });
            DropIndex("CP.tab_SitioInteres", new[] { "idCategoria" });
            DropIndex("CP.tab_SitioInteres", new[] { "idMiembroCP" });
            DropIndex("CP.tab_Noticia", new[] { "idComunidad" });
            DropIndex("CP.tab_Lineamientos", new[] { "AutorId" });
            DropIndex("CP.tab_Lineamientos", new[] { "idCP" });
            DropIndex("CP.tab_Lineamientos", new[] { "IdTipoLineamiento" });
            DropIndex("CP.tab_Lineamientos", new[] { "AdjuntoId" });
            DropIndex("CP.tab_Comunidades", new[] { "idCategoria" });
            DropIndex("CP.tab_Metas", new[] { "Resultado_ResultadoId" });
            DropIndex("CP.tab_Metas", new[] { "idCP" });
            DropIndex("CP.tab_Resultados", new[] { "idMeta" });
            DropIndex("GEN.cat_Funciones", new[] { "IdModulo" });
            DropIndex("GEN.cat_Funciones", new[] { "IdPadre" });
            DropIndex("GEN.Adjunto", new[] { "ModuloId" });
            DropIndex("CP.tab_Avance", new[] { "AdjuntoId" });
            DropIndex("CP.tab_Avance", new[] { "idResultado" });
            DropIndex("CP.tab_AvanceMiembros", new[] { "idMiembro" });
            DropIndex("CP.tab_AvanceMiembros", new[] { "AvanceId" });
            DropIndex("CP.tab_Miembros", new[] { "rolId" });
            DropIndex("CP.tab_Miembros", new[] { "idCP" });
            DropIndex("CP.tab_Autores", new[] { "idMiembroCP" });
            DropIndex("CP.tab_Autores", new[] { "idOC" });
            DropTable("CP.tab_TemasInnovacion");
            DropTable("CP.tab_Preguntas");
            DropTable("CP.tab_Post");
            DropTable("CP.tab_PlanAnual");
            DropTable("CP.tab_MapasRuta");
            DropTable("CP.tab_InformeAnual");
            DropTable("CP.tab_EstudiosEspecializados");
            DropTable("CP.tab_EstadoArte");
            DropTable("CP.tab_Especialistas");
            DropTable("CP.cat_TipoDocumento");
            DropTable("CP.tab_Documento");
            DropTable("CP.tab_ComentariosLCP");
            DropTable("CP.tab_Comentarios");
            DropTable("CP.cat_CategoriaSitio");
            DropTable("CP.tab_SitioInteres");
            DropTable("CP.cat_RolesCP");
            DropTable("CP.tab_Noticia");
            DropTable("CP.cat_TipoLineamiento");
            DropTable("CP.tab_Lineamientos");
            DropTable("CP.cat_CategoriaCP");
            DropTable("CP.tab_Comunidades");
            DropTable("CP.tab_Metas");
            DropTable("CP.tab_Resultados");
            DropTable("CP.tab_Avance");
            DropTable("CP.tab_AvanceMiembros");
            DropTable("CP.tab_Miembros");
            DropTable("CP.cat_ListaOC");
            DropTable("CP.tab_Autores");
        }
    }
}
