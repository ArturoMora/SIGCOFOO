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
    [Table("CH.tab_SNI")]
    public class SNI
    {
        public SNI()
        {

        }

        [Key]
        public int SNIId { get; set; }

        public string ClavePersona { get; set; }

        public DateTime? fechaValidacion { get; set; }

        public int EstadoFlujoId { get; set; }
          public EstadoFlujo EstadoFlujo { get; set; }

        public DateTime? fechaIngreso { get; set; }

        [StringLength(30)]
        public string numeroCVU { get; set; }

        public DateTime fechaInicioNombramiento { get; set; }
        public DateTime fechaTerminoNombramiento { get; set; }

        public long? AdjuntoId { get; set; }
        public Adjunto Adjunto { get; set; }

        public int NivelSNIId { get; set; }
        public NivelSNI NivelSNI { get; set; }


        public int AreaSNIId { get; set; }
        public AreaSNI AreaSNI { get; set; }

        [StringLength(30)]
        public string numeroExpediente { get; set; }

    }
}
