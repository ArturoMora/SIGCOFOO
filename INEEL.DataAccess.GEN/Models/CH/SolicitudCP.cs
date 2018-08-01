using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using INEEL.DataAccess.CH.Models;
using INEEL.DataAccess.GEN.Models.GEN;

namespace INEEL.DataAccess.GEN.Models.CH
{
    [Table("CH.tab_SolicitudCP")]
    public class SolicitudCP
    {
        [Key]
        public int SolicitudCPId { get; set; }

        public string ClavePersona { get; set; }

        [NotMapped]
        public string NombreCompleto { get; set; }

        [NotMapped]
        public int SolicitudId { get; set; }

        public int TipoInformacionId { get; set; }
        public TipoInformacion TipoInformacion { get; set; }

        public int InformacionId { get; set; }

        public DateTime FechaSolicitud { get; set; }

        public int EstadoFlujoId { get; set; }
          public EstadoFlujo EstadoFlujo { get; set; }
    }
}
