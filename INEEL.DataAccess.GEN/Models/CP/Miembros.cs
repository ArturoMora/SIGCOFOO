using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using INEEL.DataAccess.GEN.Models.GEN;

namespace INEEL.DataAccess.GEN.Models.CP
{
    [Table("CP.tab_Miembros")]
    public class Miembros
    {
        public Miembros() { }

        [Key]
        public int MiembroId { get; set; }

        [ForeignKey("Comunidad")]
        public int idCP { get; set; }
        public virtual Comunidad Comunidad { get; set; }

        //[ForeignKey("Personas")]
        [StringLength(10)]
        public string idPersonas { get; set; }
        //public virtual Personas Personas { get; set; }

        [StringLength(200)]
        public string nombrePersona { get; set; }

        [ForeignKey("RolesCP")]
        public int rolId { get; set; }
        public virtual RolesCP RolesCP { get; set; }

        public DateTime FechaAlta { get; set; }
        public DateTime? FechaBaja { get; set; }
        public Boolean Aceptacion { get; set; }
        public DateTime? FechaAceptacion { get; set; }

        public Boolean estado { get; set; }

        [NotMapped]
        public string foto { get; set; }

        [NotMapped]
        public string correo { get; set; }

        public virtual ICollection<SitioInteres> SitiosInteres { get; set; }
        public virtual ICollection<AvanceMiembros> AvanceMiembros { get; set; }
    }
}
