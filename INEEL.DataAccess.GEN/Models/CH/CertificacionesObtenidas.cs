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
    [Table("CH.tab_CertificacionesObtenidas")]
    public class CertificacionesObtenidas
    {
        public int CertificacionesObtenidasId { get; set; }

        public string ClavePersona { get; set; }

        public DateTime? FechaValidacion { get; set; }

        [Required]
        public int EstadoFlujoId { get; set; }
        public EstadoFlujo EstadoFlujo { get; set; }

        [ForeignKey("Adjunto")]
        public long? AdjuntoId { get; set; }
        public Adjunto Adjunto { get; set; }

        public string NombreCertificacion { get; set; }

        public string AutoridadEmisora { get; set; }

        public int NumeroLicencia { get; set; }

        public DateTime FechaInicio { get; set; }

        public DateTime? FechaTermino { get; set; }

        public string Url { get; set; }
    }
}
