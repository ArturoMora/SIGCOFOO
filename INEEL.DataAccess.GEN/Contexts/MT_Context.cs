using INEEL.DataAccess.MT.Models;
using System;
using System.Collections.Generic;
using System.Data.Entity;
using System.Data.Entity.ModelConfiguration.Conventions;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using INEEL.DataAccess.MT.Models.ITF;
using INEEL.DataAccess.MT.Models.ITF.catalogos;
using INEEL.DataAccess.GEN.Models.MT.ITF;
using INEEL.DataAccess.GEN.Models.MT;
using INEEL.DataAccess.GEN.Models.GEN;
using INEEL.DataAccess.GEN.Repositories.MT;

namespace INEEL.DataAccess.GEN.Contexts
{
    public class MT_Context : DbContext
    {
        public MT_Context()
            : base("name=MT_Context")
        {
            this.Configuration.LazyLoadingEnabled = false;
        }
        
        public virtual DbSet<EstadoITFFlujo> dbSetEstadoITFFlujo { get; set; }
        public virtual DbSet<InformeTecnicoFinal> dbSetInformeTFs { get; set; }
        public virtual DbSet<ResultadosE> dbSetResultadosE { get; set; }
        public virtual DbSet<SatisCte> dbSetSatisCtes { get; set; }
        public virtual DbSet<Resultados> dbSetResultados { get; set; }
        public virtual DbSet<ProyFuturo> dbSetProyFuturos { get; set; }
        public virtual DbSet<Evaluaciones> dbSetEvaluaciones { get; set; }

        public virtual DbSet<LAcap> dbSetLAcaps { get; set; }
        public virtual DbSet<LActe> dbSetLActes { get; set; }
        public virtual DbSet<LAproy> dbSetLAproys { get; set; }
        public virtual DbSet<Insumos> dbSetInsumos { get; set; }

        public virtual DbSet<SoftwarePersonal> dbSetSoftwarePersonal { get; set; }
        public virtual DbSet<InformeBecario> dbSetInformeBecario { get; set; }
        public virtual DbSet<CursosPersonal> dbSetCursosPersonal { get; set; }
        public virtual DbSet<SolicitudInsumo> dbSetSolicitudInsumo { get; set; }
        public virtual DbSet<Capitulos> dbSetCapitulos { get; set; }

        //public virtual DbSet<Proyecto> Proyecto { get; set; }
        //public virtual DbSet<Proyecto> Proyecto { get; set; }
        public DbSet<TipoAcceso> dbSetCAT_TipoAcceso { get; set; }
        public DbSet<CalificacionCliente> dbSetCAT_CalificacionCliente { get; set; }
        public DbSet<CalificacionPersonal> dbSetCAT_CalificacionPersonal { get; set; }
        public DbSet<CalifResultadosFinancieros> dbSetCAT_CalifResultadosFinancieros { get; set; }

        public DbSet<TipoSoftware> dbSetCAT_TipoSoftware { get; set; }
        public DbSet<AutorSoftware> dbSetAutorSoftware { get; set; }
        
        public DbSet<TipoCurso> dbSetCAT_TipoCurso { get; set; }
        public DbSet<AdjuntoITF> dbSetAdjuntosITF { get; set; }
        public DbSet<AdjuntoITFInsumo> dbSetAdjuntoITFInsumos { get; set; }
        public DbSet<ITFgeneral> dbSetITFgeneral { get; set; }
        public DbSet<AdjuntoCursosPersonal> dbSetAdjuntoCursosPersonal { get; set; }
        public DbSet<AutoresCursosPersonal> dbSetAutoresCursosPersonal { get; set; }
        public DbSet<EstadoSolicitud> dbSetCAT_EstadoSolicitud { get; set; }
        public DbSet<AdjuntoCapitulo> dbSetAdjuntoCapitulo { get; set; }
        public DbSet<AutorInternoCapitulo> dbSetAutorInternoCapitulo { get; set; }
        public DbSet<AutorExternoCapitulo> dbSetAutorExternoCapitulo { get; set; }
        public DbSet<EditoresCapitulo> dbSetEditoresCapitulo { get; set; }
        public DbSet<EstadoCapitulo> dbSetCAT_EstadoCapitulo { get; set; }
        public DbSet<SolicitudRevisionITF> dbSetSolicitudRevisionITF { get; set; }
        public DbSet<SolicitudAccesoITF> dbSetSolicitudAccesoITF { get; set; }

        public DbSet<BitacoraITFDescarga> dbSetBitacoraITFDescarga { get; set; }
        public DbSet<BitacoraITFConsulta> dbSetBitacoraITFConsulta { get; set; }
        public DbSet<BitacoraITFSolicitudDescarga> dbSetBitacoraITFSolicitudDescarga { get; set; }



        //public DbSet<LibroDescriptores> dbSetLibroDescriptores { get; set; }        
        //public DbSet<LibrosAutores> dbSetLibrosAutores { get; set; }
        //public DbSet<LibroConDescriptor> dbSetLibroConDescriptor { get; set; }
        //public DbSet<LibroConAutor> dbSetLibroConAutor { get; set; }
        public DbSet<Libros> dbSetLibros { get; set; }
        public DbSet<TipoInsumo> dbSetTipoInsumo { get; set; }
        public DbSet<AutorITF> dbSetAutorITF { get; set; }
        public DbSet<Adjunto> dbSetAdjuntoOfMT { get; set; }


        





        protected override void OnModelCreating(DbModelBuilder modelBuilder)
        {
            modelBuilder.Conventions.Remove<PluralizingTableNameConvention>();
        }
    }
}