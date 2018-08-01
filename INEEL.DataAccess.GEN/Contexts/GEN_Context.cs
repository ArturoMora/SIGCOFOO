using INEEL.DataAccess.CH.Models;
using INEEL.DataAccess.GEN.Models;
using INEEL.DataAccess.GEN.Models.GEN;
using System.Data.Entity;
using System.Data.Entity.ModelConfiguration.Conventions;

namespace INEEL.DataAccess.GEN.Contexts
{
    public class GEN_Context : DbContext
    {
        public GEN_Context()
            : base("name=GEN_Context")
        {
            this.Configuration.LazyLoadingEnabled = false;
        }

        public virtual DbSet<Catalogo> Catalogo { get; set; }
        public virtual DbSet<Configuracion> Configuracion { get; set; }
        public virtual DbSet<Opcion> Opcion { get; set; }

        public virtual DbSet<PersonalProyecto> dbSetPersonalProyectos { get; set; }
        public virtual DbSet<Proyecto> dbSetProyectoGEN { get; set; }
        public virtual DbSet<Adjunto> dbSetAdjuntos { get; set; }
        public virtual DbSet<Modulo> dbSetModulos { get; set; }


        public virtual DbSet<FuncionesRol> dbSetFuncionesRol { get; set; }
        public virtual DbSet<Funcion> dbSetFuncion { get; set; }

        public virtual DbSet<Personas> dbSetPersonas { get; set; }
        public virtual DbSet<Roles> dbSetRoles { get; set; }
        public virtual DbSet<RolPersona> dbSetRolPersona { get; set; }
        public virtual DbSet<TipoUnidad> dbSetTipoUnidad { get; set; }
        public virtual DbSet<UnidadOrganizacional> dbSetUnidadOrganizacional { get; set; }
        public virtual DbSet<AccesoSistema> dbSetAcceso { get; set; }
        public virtual DbSet<UbicacionAreas> dbSetUbicacion { get; set; }


        public virtual DbSet<Categoria> dbSetCategoria { get; set; }
        public virtual DbSet<TipoPersonal> dbSetTipoPersona { get; set; }
        public virtual DbSet<Plaza> dbSetPlaza { get; set; }
        public virtual DbSet<TipoContrato> dbTipoContrato { get; set; }
        
        public virtual DbSet<Vocabulario> dbSetVocabulario { get; set; }
        public virtual DbSet<VocabularioDocumento> dbSetVocabularioDocumento { get; set; }
        
        public virtual DbSet<Paises> dbSetPais { get; set; }
        public virtual DbSet<Estados> dbSetEstado { get; set; }
        public virtual DbSet<Municipios> dbSetMunicipio { get; set; }

        public virtual DbSet<Iniciativas> dbSetIniciativa { get; set; }
        public virtual DbSet<Propuestas> dbSetPropuesta { get; set; }

        public virtual DbSet<EstadoFlujo> EstadoFlujo { get; set; }

        public virtual DbSet<BitacoraSolicitudes> BitacoraSolicitudes { get; set; }
        public virtual DbSet<NuevoOC> dbSetNuevoOC { get; set; }
        public virtual DbSet<Ocs> dbSetOcs { get; set; }
        public virtual DbSet<OCsRolesBlackList> dbSetOCsRolesBlackList { get; set; }
        public virtual DbSet<OCSuscripciones> dbSetOCSuscripciones { get; set; }
        public virtual DbSet<EdadPromedioHistorico> EdadPromedioHistorico { get; set; }
        public virtual DbSet<SolicitudAcceso> dbSetSolicitudAcceso { get; set; }
        public virtual DbSet<TipoInformacion> dbSetTipoInformacion { get; set; }
        public virtual DbSet<BitacoraSolicitudesAcceso> dbSetBitacoraSolicitudesAcceso { get; set; }
        public virtual DbSet<DetallePersona> DetallePersonas { get; set; }
        public virtual DbSet<RecuperaPassword> RecuperaPassword { get; set; }

        public virtual DbSet<Log> bdSetLog { get; set; }
        public virtual DbSet<LogBitacora> bdSetLogBitacora { get; set; }

        public virtual DbSet<MovimientoCategoria> bdSetMovimientoCategoria { get; set; }
        public virtual DbSet<MovimientoPuesto> bdSetMovimientoPuesto { get; set; }
        public virtual DbSet<MovimientoUnidadOrg> bdSetMovimientoUnidadOrg { get; set; }

        public virtual DbSet<LikesLinked> bdSetLikesLinked { get; set; }
        public virtual DbSet<LikesTipo> bdSetLikesTipo { get; set; }
        public virtual DbSet<AptitudesEmpleado> bdSetAptitudesEmpleado { get; set; }
        public virtual DbSet<AptitudesCat> bdSetAptitudesCat { get; set; }
        public virtual DbSet<CorreoTemplate> bdSetCorreoTemplate { get; set; }
        public virtual DbSet<SubProgramaProyecto> bdSetSubProgramaProyecto { get; set; }

        public virtual DbSet<AccesoModulos> bdSetAccesoModulos { get; set; }
        public virtual DbSet<AccesoOcModulos> bdSetAccesoOcModulos { get; set; }




        protected override void OnModelCreating(DbModelBuilder modelBuilder)
        {
            modelBuilder.Conventions.Remove<PluralizingTableNameConvention>();
        }
    }
}
