using System;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using INEEL.DataAccess.GEN.Models.GEN;

namespace INEEL.DataAccess.CH.Models
{
    [Table("CH.cat_Asistentes")]
    public class Asistente
    {
        [Key]
        public int AsistenteId { get; set; }

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
