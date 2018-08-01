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
    [Table("CH.tab_Idioma")]
    public class Idiomas
    {
        [Key]
        [DatabaseGenerated(DatabaseGeneratedOption.Identity)]
        public int IdiomasId { get; set; }

        public string ClavePersona { get; set; }

        public DateTime? FechaValidacion { get; set; }

        public int EstadoFlujoId { get; set; }
          public EstadoFlujo EstadoFlujo { get; set; }

        public int IdiomaId { get; set; }
        public Idioma Idioma { get; set; }

        public int PorcentajeGradoDominio { get; set; }

        public int PorcentajeConversacion { get; set; }

        public int PorcentajeEscritura { get; set; }

        public int PorcentajeLectura { get; set; }

        public DateTime FechaAcreditacion { get; set; }

        public float Puntuacion { get; set; }

        public int CertificacionId { get; set; }
        public Certificacion Certificacion { get; set; }

        public long? AdjuntoId { get; set; }
        public Adjunto Adjunto { get; set; }
    }
}
