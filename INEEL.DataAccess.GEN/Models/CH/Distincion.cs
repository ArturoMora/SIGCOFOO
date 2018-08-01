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
    [Table("CH.tab_Distincion")]
    public class Distincion
    {
        [Key]
        public int DistincionId { get; set; }

        public string ClavePersona { get; set; }

        public DateTime? FechaValidacion { get; set; }

        public int EstadoFlujoId { get; set; }
          public EstadoFlujo EstadoFlujo { get; set; }

        public string Reconocimiento { get; set; }

        public string Aprobado { get; set; }

        public DateTime FechaDistincion { get; set; }

        public long? AdjuntoId { get; set; }
        public Adjunto Adjunto { get; set; }
    }
}
