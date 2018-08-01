using System.Data.Entity;
using System.Data.Entity.ModelConfiguration.Conventions;
using INEEL.DataAccess.GEN.Models.GI;
using INEEL.DataAccess.GEN.Models.GEN;
using INEEL.DataAccess.CH.Models;
using INEEL.DataAccess.GEN.Repositories.GI;
using INEEL.DataAccess.CR.Models;
using INEEL.DataAccess.GEN.Models.CP;
using INEEL.DataAccess.PI.Models;
using INEEL.DataAccess.GEN.Models.PI;

namespace INEEL.DataAccess.GEN.Contexts
{
    public class GI_Context:DbContext
    {
        public GI_Context(): base("name=GI_Context")
        {
            this.Configuration.LazyLoadingEnabled = false;
        }
        #region Relación con otras tablas:
        public DbSet<Modulo> DbSetModulo { get; set; }
        public DbSet<Adjunto> DbSetAdjunto { get; set; }
        public DbSet<Funcion> DbSetFuncion { get; set; }
        public DbSet<EstadoFlujo> DbSetEstadoFlujo { get; set; }
        public DbSet<Personas> DbSetPersonas { get; set; }
        public DbSet<TipoInformacion> DbSetTipoInformacion { get; set; }
        public DbSet<Propuestas> DbSetPropuestas { get; set; } //GEN lo ocupa CR
        public DbSet<UnidadOrganizacional> DbSetUnidadOrganizacional { get; set; }
        public DbSet<Empresa> DbSetEmpresa { get; set; }
        public DbSet<Comunidad> DbSetComunidad { get; set; }
        public DbSet<CategoriaCP> DbSetCategoriaCP { get; set; }
        public DbSet<SegmentoMercado> DbSetSegmentoMercado { get; set; }
        public DbSet<Proyecto> DbSetProyecto { get; set; }
        public DbSet<UnidadOrganizacionalEmpresas> DbSetUnidadOrganizacionalEmpresas { get; set; }
        public DbSet<Contacto> DbSetContacto { get; set; }
        public DbSet<Convenio> DbSetConvenio { get; set; }
        public DbSet<ActividadAdicional> DbSetActividadAdicional { get; set; }
        public DbSet<TipoConvenio> DbSetTipoConvenio { get; set; }
        public DbSet<AmbitoConv> DbSetAmbitoConv { get; set; }
        public DbSet<Aliado> DbSetAliado { get; set; }

        public DbSet<Rama> DbSetRama { get; set; }
        public DbSet<DerechosAutor> DbSetDerechosAutor { get; set; }
        public DbSet<TipoPropiedadIndustrial> DbSetTipoPropiedadIndustrial { get; set; }
        public DbSet<PropiedadIndustrial> DbSetPropiedadIndustrial { get; set; }
        #endregion

        public DbSet<ProductoHistorialFI> DbSetProductoHistorialFI { get; set; }
        public DbSet<ContribucionProponente> DbSetContribucionProponente { get; set; }
        public DbSet<TipoAccesoGI> DbSetTipoAccesoGI { get; set; }
        public DbSet<IdeaInnovadora> DbSetIdeaInnovadora { get; set; }
        public DbSet<AutoresIdea> DbSetAutoresIdea { get; set; }



        public DbSet<ComiteGI> DbSetComiteGI { get; set; }        
        public DbSet<MiembrosGI> DbSetMiembrosGI { get; set; }        
        public DbSet<EvaluadoresIdea> DbSetEvaluadoresIdea { get; set; }        
        public DbSet<SolicitudGI> DbSetSolicitudGI { get; set; }
        public DbSet<BitacoraSolicitudesGI> DbSetBitacoraSolicitudesGI { get; set; }
        ////public DbSet<EstadoPropuesta> DbSetEstadoPropuesta { get; set; }        
        ///public DbSet<PropuestaConIdea> DbSetPropuestaConIdea { get; set; }
        ////public DbSet<PropuestaEnEstado> DbSetPropuestaEnEstado { get; set; }        
        public DbSet<Propuesta> DbSetPropuesta { get; set; }
        public DbSet<PlanNegocioEvolutivo> DbSetPlanNegocioEvolutivo { get; set; }
        public DbSet<PlanNegocioEvolGerencias> DbSetPlanNegocioEvolGerencias { get; set; }
        public DbSet<PlanNegocioEvolAutores> DbSetPlanNegocioEvolAutores { get; set; }
        public DbSet<PlanNegocioEvolArchivos> DbSetPlanNegocioEvolArchivos { get; set; }
        public DbSet<BitacoraMovimientosGI> DbSetBitacoraMovimientosGI { get; set; }

        public DbSet<FactorInnovacion> DbSetFactorInnovacion { get; set; }
        public DbSet<ProductoAutores> DbSetProductoAutores { get; set; }
        public DbSet<ProductoGI> DbSetProductoGI { get; set; }
        public DbSet<ContribucionAutor> DbSetContribucionAutor { get; set; }

        public DbSet<TecnologiaLicenciada> DbSetTecnologiaLicenciada { get; set; }
        public DbSet<EstadoLicenciamiento> DbSetEstadoLicenciamiento { get; set; }
        public DbSet<TecnologiaLicenciadaGerencia> DbSetTecnologiaLicenciadaGerencia { get; set; }

        public DbSet<TipoPagos> DbSetTipoPagos { get; set; }
        public DbSet<TecnologiaLicenciadaPagos> DbSetTecnologiaLicenciadaPagos { get; set; }
        public DbSet<TecnologiaLicenciadaLecciones> DbSetTecnologiaLicenciadaLecciones { get; set; }
        public DbSet<PeriodoFI> DbSetPeriodoFI { get; set; }
        public DbSet<PeriodoRecepcion> DbSetPeriodoRecepcion { get; set; }
        public DbSet<ProductoGIEvaluadores> DbSetProductoGIEvaluadores { get; set; }
        public DbSet<ProductoGISolicitud> DbSetProductoGISolicitud { get; set; }
        public DbSet<ProductoGISolicitudArchivosInnovacion> DbSetProductoGISolicitudArchivosInnovacion { get; set; }
        public DbSet<ProductoGISolicitudArchivosSuperior> DbSetProductoGISolicitudArchivosSuperior { get; set; }
        public DbSet<ProductoGISolicitudArchivosFase> DbSetProductoGISolicitudArchivosFase { get; set; }
        public DbSet<PeriodoReplica> DbSetPeriodoReplica { get; set; }
        
        public DbSet<ProductoGIFactorInnovacion> DbSetProductoGIFactorInnovacion { get; set; }

        public DbSet<TecnologiaLicenciadaPIPIndustrial> DbSetTecnologiaLicenciadaPIPIndustrial { get; set; }
        public DbSet<TecnologiaLicenciadaPIDA> DbSetTecnologiaLicenciadaPIDA { get; set; }
        //public DbSet<x> DbSetx { get; set; }
        //public DbSet<x> DbSetx { get; set; }

        protected override void OnModelCreating(DbModelBuilder modelBuilder)
        {
            modelBuilder.Conventions.Remove<PluralizingTableNameConvention>();
        }
    }
}
