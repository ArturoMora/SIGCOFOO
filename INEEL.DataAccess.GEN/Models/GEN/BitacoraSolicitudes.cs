using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using INEEL.DataAccess.CH.Models;
using INEEL.DataAccess.GEN.Models.CH;

namespace INEEL.DataAccess.GEN.Models.GEN
{
    [Table("GEN.tab_BitacoraSolicitudes")]
    public class BitacoraSolicitudes
    {
        [Key]
        public long BitacoraSolicitudesId { get; set; }

        public int SolicitudId { get; set; }

        public DateTime FechaMovimiento { get; set; }

        public string ClavePersona { get; set; }

        public string Descripcion { get; set; }

        public int EstadoFlujoId { get; set; }        
        public EstadoFlujo EstadoFlujo { get; set; }

        public int? idRol { get; set; }

        [NotMapped]
        public string NombreCompleto { get; set; }

    }
}
