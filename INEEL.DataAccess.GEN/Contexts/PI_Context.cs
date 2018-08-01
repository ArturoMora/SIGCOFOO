using System.Data.Entity;
using INEEL.DataAccess.GEN.Models.PI;
using INEEL.DataAccess.PI.Models;
using INEEL.DataAccess.GEN.Models.GEN;

namespace INEEL.DataAccess.GEN.Contexts
{
    using System.Data.Entity;


    public class PI_Context : DbContext
    {

        public PI_Context()
            : base("name=PI_Context")
        {
            this.Configuration.LazyLoadingEnabled = false;
        }

        //tablas relacionadas 
        public virtual DbSet<UnidadOrganizacional> UnidadOrganizacional { get; set; }
        public virtual DbSet<EstadoFlujo> EstadoFlujo { get; set; }
        public virtual DbSet<Adjunto> Adjunto { get; set; }

        public virtual DbSet<DerechosAutor> DerechosAutor { get; set; }
        public virtual DbSet<Rama> Rama { get; set; }
        public virtual DbSet<AutoresDA> AutoresDA { get; set; }

        public virtual DbSet<PropiedadIndustrial> PropiedadIndustrial { get; set; }
        public virtual DbSet<AutoresPI> AutoresPI { get; set; }
        public virtual DbSet<HistorialPI> Historial { get; set; }

        public virtual DbSet<EstadoDelProceso> EstadoDelProceso { get; set; }
        public virtual DbSet<TipoPropiedadIndustrial> TipoPropiedadIndustrial { get; set; }

        protected override void OnModelCreating(DbModelBuilder modelBuilder)
        {
        }
    }
}