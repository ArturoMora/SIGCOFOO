using INEEL.DataAccess.GEN.Models.GEN;
using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace INEEL.DataAccess.GEN.Models.CH
{
    [Table("CH.tab_CapacitacionYcertificacion")]
    public class CapacitacionYcertificacion
    {
        public int CapacitacionYcertificacionId { get; set; }

        public string ClavePersona { get; set; }

        public DateTime? FechaValidacion { get; set; }

        public string Descripcion { get; set; }
        public DateTime FechaObtencion { get; set; }
        public string Impartio { get; set; }

        [Required]
        public int EstadoFlujoId { get; set; }
        public EstadoFlujo EstadoFlujo { get; set; }

        [ForeignKey("Adjunto")]
        public long? AdjuntoId { get; set; }
        public Adjunto Adjunto { get; set; }

        public string objetivo { get; set; }

        [StringLength(50)]
        public string tipoAccion { get; set; }

        [StringLength(50)]
        public string accionCapacitacion { get; set; }




    }
}
