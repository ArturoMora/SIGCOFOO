using System;
using System.Collections.Generic;
using System.Data.Entity;
using System.Data.Entity.ModelConfiguration.Conventions;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using INEEL.DataAccess.GEN.Models.CP;

namespace INEEL.DataAccess.GEN.Contexts
{
    public class CP_Context:DbContext
    {
        public CP_Context(): base("name=CP_Context")
        {
            this.Configuration.LazyLoadingEnabled = false;
        }

        //DBSets
        public DbSet<Autores> DbSetAutores { get; set; }
        public DbSet<Avance> DbSetAvance { get; set; }
        public DbSet<AvanceMiembros> DbSetAvanceMiembros { get; set; }
        public DbSet<CategoriaCP> DbSetCategorias { get; set; }
        public DbSet<CategoriaSitio> DbSetCategoriaSitios { get; set; }
        public DbSet<Comentarios> DbSetComentarios { get; set; }
        public DbSet<ComentariosLCP> DbSetComentariosLCP { get; set; }
        public DbSet<Comunidad> DbSetComunidades { get; set; }
        public DbSet<Documento> DbSetDocumentos { get; set; }
        public DbSet<EstadoArte> DbSetEstadoArte { get; set; }
        public DbSet<EstudiosEspecializados> DbSetEstudios { get; set; }
        public DbSet<InformeAnual> DbSetInformeAnual { get; set; }
        public DbSet<Lineamientos> DbSetLineamientos { get; set; }
        public DbSet<ListaOC> DbSetListaOC { get; set; }
        public DbSet<MapasRuta> DbSetMapasRutas { get; set; }
        public DbSet<Metas> DbSetMetas { get; set; }
        public DbSet<Miembros> DbSetMiembros { get; set; }
        public DbSet<Noticia> DbSetNoticias { get; set; }
        public DbSet<PlanAnual> DbSetPlanAnual { get; set; }
        public DbSet<Post> DbSetPost { get; set; }
        public DbSet<Preguntas> DbSetPreguntas { get; set; }
        public DbSet<RolesCP> DbSetRoles { get; set; }
        public DbSet<Resultado> DbSetResultados { get; set; }
        public DbSet<SitioInteres> DbSetSitioInteres { get; set; }
        public DbSet<TemasInnovacion> DbSetTemasInnovacion { get; set; }
        public DbSet<TipoDocumento> DbSetTipoDocumentos { get; set; }
        public DbSet<TipoLineamiento> DbSetTipoLineamientos { get; set; }
        public DbSet<Agenda> DbSetAgenda { get; set; }


        protected override void OnModelCreating(DbModelBuilder modelBuilder)
        {
            modelBuilder.Conventions.Remove<PluralizingTableNameConvention>();
        }
    }
}
