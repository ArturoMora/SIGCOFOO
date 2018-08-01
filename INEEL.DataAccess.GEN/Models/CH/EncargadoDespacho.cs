using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using INEEL.DataAccess.GEN.Models.GEN;

namespace INEEL.DataAccess.GEN.Models.CH
{
    [Table("CH.cat_EncargadoDespacho")]
    public class EncargadoDespacho
    {
        [Key]
        public int EncargadoDespachoId { get; set; }

        public string ClavePersona { get; set; }

        public DateTime FechaEfectivaNombramiento { get; set; }
        public DateTime? FechaFinNombramiento { get; set; }

        [NotMapped]
        public string NombrePersona { get; set; }

        //[ForeignKey("UnidadOrganizacional"), Column(Order = 0)]
        [StringLength(10)]
        public string ClaveUnidad { get; set; }
        //[ForeignKey("UnidadOrganizacional"), Column(Order = 1)]
        public DateTime FechaEfectiva { get; set; }
        [NotMapped]
        public UnidadOrganizacional UnidadOrganizacional { get; set; }
    }
}
