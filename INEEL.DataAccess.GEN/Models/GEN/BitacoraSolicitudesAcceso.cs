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
    [Table("GEN.tab_BitacoraSolicitudesAcceso")]
    public class BitacoraSolicitudesAcceso
    {
        [Key]
        public long BitacoraSolicitudesAccesoId { get; set; }

        public int SolicitudAccesoId { get; set; }

        public DateTime FechaMovimiento { get; set; }

        public string ClavePersona { get; set; }

        public string Descripcion { get; set; }

        public int EstadoFlujoId { get; set; }        
        public EstadoFlujo EstadoFlujo { get; set; }

        public int RolAutorizador { get; set; }
        public string UnidadOrganizacionalId { get; set; }

        public string justificacion { get; set; }

        [NotMapped]
        public string NombreCompleto { get; set; }

    }
}
