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
    [Table("CH.tab_Asociaciones")]
    public class Asociaciones
    {
        [Key]
        [DatabaseGenerated(DatabaseGeneratedOption.Identity)]
        public int AsociacionesId { get; set; }

        public string ClavePersona { get; set; }

        public DateTime? FechaValidacion { get; set; }

        [Required]
        public int EstadoFlujoId { get; set; }
          public EstadoFlujo EstadoFlujo { get; set; }

        [Required]
        public int AsociacionId { get; set; }
        public Asociacion Asociacion { get; set; }

        [Required]
        [StringLength(250)]
        public string Participacion { get; set; }

        [Required]
        public DateTime FechaInicio { get; set; }

        [Required]
        public DateTime FechaTermino { get; set; }

        public long? AdjuntoId { get; set; }
        public Adjunto Adjunto { get; set; }
    }
}
