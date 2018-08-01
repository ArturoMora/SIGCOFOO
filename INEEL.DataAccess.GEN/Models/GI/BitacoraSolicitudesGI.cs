using INEEL.DataAccess.GEN.Models.GEN;
using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace INEEL.DataAccess.GEN.Models.GI
{
    [Table("GI.tab_BitacoraSolicitudesGI")]
    public class BitacoraSolicitudesGI
    {
        [Key]
        public long BitacoraSolicitudesId { get; set; }

        public int SolicitudId { get; set; }

        public DateTime FechaMovimiento { get; set; }

        public string ClavePersona { get; set; }

        public string Descripcion { get; set; }

        public int EstadoFlujoId { get; set; }
        public EstadoFlujo EstadoFlujo { get; set; }

        public int? IdRol { get; set; }
        public String Justificacion { get; set; }

        [NotMapped]
        public string NombreCompleto { get; set; }

        [NotMapped]
        public string informacionId { get; set; }

        [NotMapped]
        public string estadoOC { get; set; }

        [NotMapped]
        public string nombreOC { get; set; }

        [NotMapped]
        public int tipoInformacionOC { get; set; }


    }
}
