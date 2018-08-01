using INEEL.DataAccess.CR.Models;
using INEEL.DataAccess.GEN.Models.CR;
using System;
using System.Collections.Generic;
using System.Data.Entity;
using System.Data.Entity.ModelConfiguration.Conventions;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace INEEL.DataAccess.GEN.Contexts
{
    public class CR_Context : DbContext
    {
        public CR_Context()
            : base("name=CR_Context")
        {
            this.Configuration.LazyLoadingEnabled = false;
        }

        public DbSet<Contacto> Contacto { get; set; }
        public DbSet<ContactoPerfil> ContactoPerfil { get; set; }
        public DbSet<ContactoPuestoHistorico> ContactoPuestoHistorico { get; set; }
        public DbSet<RedSocial> RedSocial { get; set; }
        public DbSet<Producto> Producto { get; set; }
        public DbSet<Servicio> Servicio { get; set; }
        public DbSet<TamanoEmpresa> TamanoEmpresa { get; set; }
        public DbSet<TipoConvenio> TipoConvenio { get; set; }
        public DbSet<TipoFuenteFinanciamiento> TipoFuenteFinanciamiento { get; set; }
        public DbSet<Tematica> Tematica { get; set; }
        public DbSet<NaturalezaInteraccion> NaturalezaInteracion { get; set; }
        public DbSet<AreaInvestigacion> AreaInvestigacion { get; set; }
        public DbSet<TipoProductoServicio> TipoProductoServicio { get; set; }
        public DbSet<LineaDesarrolloTecnologico> LineaDesarrolloTecnologico { get; set; }
        public DbSet<SegmentoMercado> SegmentoMercado { get; set; }
        public DbSet<TipoRelacion> TipoRelacion { get; set; }
        public DbSet<FuenteFinanciamiento> FuenteFinanciamiento { get; set; }
        public DbSet<SitioWebFondoPrograma> SitioWebFondoPrograma { get; set; }
        public DbSet<FondoPrograma> FondoPrograma { get; set; }
        public DbSet<TematicaPorFondoPrograma> TematicaPorFondoPrograma { get; set; }
        public DbSet<Alumno> Alumno { get; set; }
        public DbSet<Menu> Menu { get; set; }
        public DbSet<MenuItem> MenuItem { get; set; }
        public DbSet<RelacionPorEmpresa> RelacionPorEmpresa { get; set; }
        public DbSet<UnidadOrganizacionalEmpresas> UnidadOrganizacionalEmpresas { get; set; }
        public DbSet<OportunidadNegocio> OportunidadNegocio { get; set; }
        public DbSet<BitacoraOportunidadNegocio> BitacoraOportunidadNegocio { get; set; }
        public DbSet<Eventos> Eventos { get; set; }
        public DbSet<TipoEventoON> TiposEventos { get; set; }
        public DbSet<Especialista> Especialistas { get; set; }
        public DbSet<AmbitoConv> AmbitoConv { get; set; }
        public DbSet<TipoOrganizacion> TipoOrganizacion { get; set; }
        public DbSet<EstadoFlujoON> EstadoFlujoON { get; set; }
        public DbSet<Experto> Expertos { get; set; }
        public DbSet<AdjuntoPorOportunidad> AdjuntoPorOportunidad { get; set; }
        public DbSet<EstudiosMercado> EstudiosMercado { get; set; }
        public DbSet<AutoresEstudioMercado> AutoresEstudioMercado { get; set; }
        public DbSet<ClaveEmpresas> ClaveEmpresas { get; set; }
        public DbSet<SeguimientoOportunidad> SeguimientoOportunidad { get; set; }
        public DbSet<EstadoON> EstadoON { get; set; }
        public DbSet<TituloPersona> TituloPersona { get; set; }
        public DbSet<PropuestaPorFondo> PropuestaPorFondo { get; set; }
        public DbSet<ProyectoPorFondo> ProyectoPorFondo { get; set; }
        public DbSet<InvestigadorPorExperto> InvestigadorPorExperto { get; set; }
        public DbSet<AdjuntosEstudiosMercado> AdjuntosEstudiosMercado { get; set; }
        public DbSet<ContactosPorAliados> ContactorPorAliados { get; set; }
        public DbSet<HistorialUnidadesOrganizacionalesEmpresas> HistorialUnidadesOrganizacionalesEmpresas { get; set; }
        // Tablas Para convocatoria 
        #region 
        public DbSet<SitioWebPorConvocatoria> SitioWebPorConvocatoria { get; set; }
        public DbSet<ContactoPorConvocatoria> ContactoPorConvocatoria { get; set; }
        public DbSet<Convocatoria> Convocatoria { get; set; }
        public DbSet<PropuestaPorConvocatoria> PropuestaPorConvocatoria { get; set; }
        public DbSet<ProyectoPorConvocatoria> ProyectoPorConvocatoria { get; set; }
        public DbSet<AdjuntoPorConvocatoria> AdjuntoPorConvocatoria { get; set; }
        public  DbSet<PaisesPorConvocatoria> PaisesPorConvocatoria { get; set; }
        #endregion

        // Tablas Para empresa
        #region 
        public DbSet<Empresa> Empresa { get; set; }
        #endregion

        // Tablas Para Competidores
        #region 
        public DbSet<Competidor> Competidor { get; set; }
        public DbSet<AdjuntoPorCompetidor> AdjuntoPorCompetidor { get; set; }
        public DbSet<ServicioPorCompetidor> ServicioPorCompetidor { get; set; }
        public DbSet<ProductoPorCompetidor> ProductoPorCompetidor { get; set; }
        #endregion

        // Tablas Para PartesInteresadas
        #region 
        public DbSet<PersonaPartInt> PersonaPartInt { get; set; }
        public DbSet<GrupoColegiadoPartInt> GrupoColegiadoPartInt { get; set; }
        public DbSet<IntegranteGrupoColegiadoExterno> IntegranteGrupoColegiadoExterno { get; set; }
        public DbSet<RelacionPorContacto> RelacionPorContacto { get; set; }
        public DbSet<IntegranteGrupoColegiadoInterno> IntegranteGrupoColegiadoInterno { get; set; }

        #endregion

        // Tablas Para Proveedores
        #region 
        public DbSet<Proveedor> Proveedor { get; set; }
        public DbSet<ProductoPorProveedor> ProductoPorProveedor { get; set; }
        public DbSet<ServicioPorProveedor> ServicioPorProveedor { get; set; }

        #endregion

        // Tablas Para Aliados
        #region 
        public DbSet<ActividadAdicional> ActividadAdicional { get; set; }
        public DbSet<AdjuntoPorConvenio> AdjuntoPorConvenio { get; set; }
        public DbSet<Aliado> Aliado { get; set; }
        public DbSet<Convenio> Convenio { get; set; }
        public DbSet<AreaConvenio> AreaConvenio { get; set; }
        public DbSet<AreaActividadAdicional> AreaActividadAdicional { get; set; }
        public DbSet<PersonalActividadAdicional> PersonalActividadAdicional { get; set; }

        #endregion


        //Tablas para el curso
       // public DbSet<CatalogoProveedores> dbSetCatalogoProveedores { get; set; }

        protected override void OnModelCreating(DbModelBuilder modelBuilder)
        {
            modelBuilder.Conventions.Remove<PluralizingTableNameConvention>();
        }
    }
}