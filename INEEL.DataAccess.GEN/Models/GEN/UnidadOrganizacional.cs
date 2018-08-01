using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace INEEL.DataAccess.GEN.Models.GEN
{
    [Table("GEN.cat_UnidadOrganizacional")]
    public class UnidadOrganizacional
    {
        public UnidadOrganizacional()
        {
            this.Children = new List<UnidadOrganizacional>();
        }
        // ID - Indice de la tabla de unidad organizacional
        [Key, Column(Order = 0)]
        [StringLength(10)]
        public string ClaveUnidad { get; set; }

        [StringLength(200)]
        public string NombreUnidad { get; set; }

        [Key, Column(Order = 1)]
        public DateTime FechaEfectiva { get; set; }


        [ForeignKey("TipoUnidadO")]
        public int tipoO { get; set; }
        public TipoUnidad TipoUnidadO { get; set; }


        //[ForeignKey("ClaveUnidadPadre")]
        public string padre { get; set; }
        [NotMapped]
        public UnidadOrganizacional ClaveUnidadPadre { get; set; }
        [NotMapped]
        public virtual List<UnidadOrganizacional> Children { get; set; }

        //[ForeignKey("Ubicacion")]
        //public int? IdUbicacion { get; set; }
        //public virtual UbicacionAreas Ubicacion { get; set; }

        public string ClaveResponsable { get; set; }

        [StringLength(100)]
        public string Localizacion { get; set; }
                       
        public int Estado { get; set; }

        //public virtual ICollection<Personas> Personal { get; set; }

        [NotMapped]
        public virtual ICollection<UnidadOrganizacional> nodes
        {
            get { return this.Children; }

        }
        [NotMapped]
        public string id
        {
            get { return this.ClaveUnidad; }

        }
        [NotMapped]
        public string title
        {
            get { return this.NombreUnidad; }

        }
        [NotMapped]
        public Personas Responsable { get; set; }

    }

    public class ComparerUnidadOrganizacionalByClaveUnidad : IEqualityComparer<UnidadOrganizacional>
    {
        #region IEqualityComparer<UnidadOrganizacional> Members
        public bool Equals(UnidadOrganizacional x, UnidadOrganizacional y)
        {
            return x.ClaveUnidad.Equals(y.ClaveUnidad);
        }

        public int GetHashCode(UnidadOrganizacional obj)
        {
            return obj.ClaveUnidad.GetHashCode();
        }
        #endregion

    }
    public class ComparerUnidadOrganizacionalByNombre : IEqualityComparer<UnidadOrganizacional>
    {
        #region IEqualityComparer<UnidadOrganizacional> Members
        public bool Equals(UnidadOrganizacional x, UnidadOrganizacional y)
        {
            return x.NombreUnidad.Equals(y.NombreUnidad);
        }

        public int GetHashCode(UnidadOrganizacional obj)
        {
            return obj.NombreUnidad.GetHashCode();
        }
        #endregion

    }
}
