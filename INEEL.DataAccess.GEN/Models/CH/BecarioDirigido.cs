using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using INEEL.DataAccess.GEN.Models.GEN;

namespace INEEL.DataAccess.CH.Models
{
    [Table("CH.tab_BecarioDirigido")]
    public class BecarioDirigido
    {
        [Key]
        public int BecarioDirigidoId { get; set; }

        public string ClavePersona { get; set; }
        public DateTime? FechaValidacion { get; set; }

        public int EstadoFlujoId { get; set; }
          public EstadoFlujo EstadoFlujo { get; set; }

        [MaxLength(10)]
        public string NumeroBecario { get; set; }

        [MaxLength(150)]
        public string NombreBecario { get; set; }

        public int TipoBecaId { get; set; }
        public TipoBeca TipoBeca { get; set; }

        public string OtorganteBeca { get; set; }

        public string NombreEstancia { get; set; }

        public string ProyectoId { get; set; }
        public Proyecto Proyecto { get; set; }


        //[ForeignKey("UnidadOrganizacional"), Column(Order = 0)]
        //[StringLength(10)]
        public string ClaveUnidad { get; set; }
        //[ForeignKey("UnidadOrganizacional"), Column(Order = 1)]
        //public DateTime? FechaEfectiva { get; set; }
        [NotMapped]
        public UnidadOrganizacional UnidadOrganizacional { get; set; }


        public DateTime FechaInicio { get; set; }

        public DateTime? FechaTermino { get; set; }

        public long? AdjuntoId { get; set; }
        public Adjunto Adjunto { get; set; }

        public int? TesisDirigidaId { get; set; }
    }
}
