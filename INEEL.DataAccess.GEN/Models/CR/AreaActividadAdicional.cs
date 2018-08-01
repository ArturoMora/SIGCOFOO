using INEEL.DataAccess.GEN.Models.GEN;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using System.ComponentModel.DataAnnotations.Schema;
using System.ComponentModel.DataAnnotations;

namespace INEEL.DataAccess.CR.Models
{
    [Table("CR.tab_AreaActividadAdicional")]
    public class AreaActividadAdicional
    {
        public AreaActividadAdicional() { }

        [Key]
        public int AreaActividadAdicionalId { get; set; }

        //Llave compuesta de unidad organizacional
        //[ForeignKey("UnidadOrganizacional"), Column(Order = 0)]
        //[StringLength(10)]
        public string ClaveUnidad { get; set; }
        //[ForeignKey("UnidadOrganizacional"), Column(Order = 1)]
        //public DateTime FechaEfectiva { get; set; }
        [NotMapped]
        public UnidadOrganizacional UnidadOrganizacional { get; set; }

        [ForeignKey("ActividadAdicional")]
        public int ActividadAdicionalId { get; set; }
        public ActividadAdicional ActividadAdicional { get; set; }

        [Required]
        public DateTime FechaRegistro { get; set; }

        [StringLength(250)]
        [Required]
        public string Autor { get; set; }

        public Boolean Estado { get; set; }
    }
}
