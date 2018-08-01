using System.ComponentModel.DataAnnotations.Schema;
using System.Data.Entity;
using INEEL.DataAccess.CH.Models;
using INEEL.DataAccess.GEN.Models.CH;

namespace INEEL.DataAccess.GEN.Contexts
{

    public partial class SIGCOCHContext : DbContext
    {
        public SIGCOCHContext()
            : base("name=CH_Context")
        {
            this.Configuration.LazyLoadingEnabled = false;
        }

        public virtual DbSet<Institucion> Instituciones { get; set; }
        public virtual DbSet<Pais> Paises { get; set; }
        public virtual DbSet<Usuario> Usuarios { get; set; }
        public virtual DbSet<SNI> SNI { get; set; }
        public virtual DbSet<Distincion> Distincion { get; set; }
        public virtual DbSet<NivelSNI> NivelSNI { get; set; }
        public virtual DbSet<AreaSNI> AreaSNi { get; set; }
        public virtual DbSet<Campo> Campo { get; set; }
        public virtual DbSet<Carrera> Carrera { get; set; }
        public virtual DbSet<Disciplina> Disciplina { get; set; }
        //public virtual DbSet<Proyecto> Proyecto { get; set; }
        //public virtual DbSet<EstadoFlujo> EstadoFlujo { get; set; }
        public virtual DbSet<GradoAcademico> GradoAcademico { get; set; }
        public virtual DbSet<EstadoAcademico> EstadoAcademico { get; set; }
        public virtual DbSet<FormacionAcademica> FormacionAcademica { get; set; }
        public virtual DbSet<Idioma> Idioma { get; set; }
        public virtual DbSet<Certificacion> Certificacion { get; set; }
        public virtual DbSet<Idiomas> Idiomas { get; set; }
        public virtual DbSet<Asociacion> Asociacion { get; set; }
        public virtual DbSet<Asociaciones> Asociaciones { get; set; }
        public virtual DbSet<Ambito> Ambito { get; set; }
        public virtual DbSet<Asistente> Asistente { get; set; }
        public virtual DbSet<BecaInterna> BecaInterna { get; set; }
        public virtual DbSet<Congreso> Congreso { get; set; }
        public virtual DbSet<EstadoPublicacion> EstadoPublicacion { get; set; }
        public virtual DbSet<Evento> Evento { get; set; }
        public virtual DbSet<ExperienciaPrevia> ExperienciaPrevia { get; set; }
        public virtual DbSet<NivelCurso> NivelCurso { get; set; }
        public virtual DbSet<NivelPublicacion> NivelPublicacion { get; set; }
        public virtual DbSet<Revista> Revista { get; set; }
        public virtual DbSet<TipoBeca> TipoBeca { get; set; }
        public virtual DbSet<TipoInformacion> TipoInformacion { get; set; }
        public virtual DbSet <Solicitud> Solicitud { get; set; }
        public virtual DbSet<BecarioExterno> BecarioExterno { get; set; }
        public virtual DbSet<AdjuntoBecarioExterno> AdjuntoBecarioExterno { get; set; }
        public virtual DbSet<BecarioInterno> BecarioInterno { get; set; }
        public virtual DbSet<TesisDirigida> TesisDirigida { get; set; }
        public virtual DbSet<BecarioDirigido> BecarioDirigido { get; set; }
        public virtual DbSet<ExperienciaDocente> ExperienciaDocente { get; set; }
        public virtual DbSet<ExperienciaExterna> ExperienciaExterna { get; set; }
        public virtual DbSet<Publicacion> Publicacion { get; set; }
        public virtual DbSet<AutorIIEPublicacion> AutorIIEPublicacion { get; set; }
        public virtual DbSet<AutorPublicacionExt> AutorPublicacionExt { get; set; }
        public virtual DbSet<EstadoPonencia> EstadoPonencia { get; set; }
        public virtual DbSet<Ponencia> Ponencia { get; set; }
        public virtual DbSet<AutorIIEPonencia> AutorIIEPonencia { get; set; }
        public virtual DbSet<AutorPonenciaExt> AutorPonenciaExt { get; set; }
        public virtual DbSet<CursoInterno> CursoInterno { get; set; }
        public virtual DbSet<AutorInternoCursoInterno> AutorInternoCursoInterno { get; set; }
        public virtual DbSet<SolicitudCP> SolicitudCP { get; set; }
        public virtual DbSet<AdjuntoCursos> AdjuntoCursos { get; set; }
        public virtual DbSet<SitioWebCurso> SitioWebCurso { get; set; }
        public virtual DbSet<EncargadoDespacho> EncargadoDespacho { get; set; }
        public virtual DbSet<ManualCompetenciaTecnica> ManualCompetenciaTecnica { get; set; }
        public virtual DbSet<ManualCompetenciaConductual> ManualCompetenciaConductual { get; set; }
        public virtual DbSet<AutorExternoCursoInterno> AutorExternoCursoInterno { get; set; }


        public virtual DbSet<TipoArea> tipoArea { get; set; }
        public virtual DbSet<TipoCompetencia> tipoCompetencia { get; set; }
        public virtual DbSet<NivelesCompetencias> nivelCompetencias { get; set; }
        public virtual DbSet<FamiliasPuestos> familiaPuestos { get; set; }
        public virtual DbSet<DescripcionNivelCompetencias> descripcionNivel { get; set; }
        public virtual DbSet<DescripcionNivelComportamiento> descripcionComportamiento { get; set; }
        public virtual DbSet<CategoriasPorFamilia> categoriasFamilia { get; set; }

        public virtual DbSet<FamiliaUnidad> familiaUnidad { get; set; }

        public virtual DbSet<Competencias> competencias { get; set; }

        public virtual DbSet<CompetenciasTecnicas> comptenciasTecnicas { get; set; }
        public virtual DbSet<NivelCompetenciaTecnica> nivelCompetenciaTecnica { get; set; }
        public virtual DbSet<EstadoEvaluacion> estadoEvaluacion { get; set; }
        public virtual DbSet<PeriodoEvaluacion> periodoEvaluacion { get; set; }

        public virtual DbSet<MatrizCompetencias> matrizcompetencias { get; set; }

        public virtual DbSet<CalificacionCompetencias> calificacion { get; set; }

        public virtual DbSet<RelacionCategoriaNominaCompetencias> relacionCategoria { get; set; }

        public virtual DbSet<EvaluacionEmpleadosCompetenciasTecnicas> evaluacionesTecnicas { get; set; }

        public virtual DbSet<DetalleEvaluacionCompetenciasTecnicas> detalleTecnicas { get; set; }

        public virtual DbSet<DetalleEvaluacionCompetenciasConductuales> detalleConductuales { get; set; }
        public virtual DbSet<EvaluacionEmpleadosCompetenciasConductuales> evaluacionesConductuales { get; set; }
        public virtual DbSet<PlanAccion> planAccion { get; set; }
        public virtual DbSet<AreasMejora> areaMejora { get; set; }
        public virtual DbSet<Fortalezas> fortalezas { get; set; }

        public virtual DbSet<RelacionCategoriasTecnicas> categoriasTecnicas { get; set; }
        public virtual DbSet<ClasificacionAreas> clasificacionAreas { get; set; }


        public virtual DbSet<EvolucionPlantillaHistorico> EvolucionPlantillaHistorico { get; set; }
        public virtual DbSet<InvestigadoresHome> dbSetInvestigadoresHome { get; set; }
        public virtual DbSet<CapacitacionYcertificacion> dbSetCapacitacionYcertificacion { get; set; }
        public virtual DbSet<ExtractoProfesional> dbSetExtractoProfesional { get; set; }
        public virtual DbSet<LogrosReconocimientos> dbSetLogrosReconocimientos { get; set; }

        public virtual DbSet<CertificacionesObtenidas> CertificacionesObtenidas { get; set; }

        public virtual DbSet<FamiliaPuestosSind> familiasPuestosSind { get; set; }
        public virtual DbSet<CategoriasCompetenciasSind> categoriasCompetenciasSin { get; set; }
        public virtual DbSet<CompetenciasSind> competenciasSind { get; set; }
        public virtual DbSet<ComportamientosSind> comportamientosSind { get; set; }

        public virtual DbSet<ListadoEmpleadosSind> listadoEmpleadosSind { get; set; }
        public virtual DbSet<MatrizCompetenciasSind> matrizCompetenciasSin { get; set; }
        public virtual DbSet<RegistroEvaluacionesSind> registroEvaluacionSind { get; set; }

        public virtual DbSet<RelacionCompetenciasNivelesSind> relacionCompetenciasSind { get; set; }

        public virtual DbSet<RelacionNivelesComportamientoSind> relacionComportamientoSind { get; set; }
        public virtual DbSet<EvaluacionEmpleadosSind> evaluacionesEmpleadosSind { get; set; }

        public virtual DbSet<CalificacionSind> calificacionSind { get; set; }
        public virtual DbSet<EstadoEvaluacionSind> estadoSind { get; set; }

        public virtual DbSet<BecarioExternoINEEL> BecarioExternoINEEL { get; set; }

        protected override void OnModelCreating(DbModelBuilder modelBuilder)
        {
        }
    }
}
