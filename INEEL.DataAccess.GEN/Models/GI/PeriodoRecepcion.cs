using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace INEEL.DataAccess.GEN.Models.GI
{
    [Table("GI.tab_PeriodoRecepcion")]
    public class PeriodoRecepcion
    {
        public int PeriodoRecepcionId { get; set; }

        public int PeriodoFIId { get; set; }
        public PeriodoFI PeriodoFI { get; set; }
        public DateTime FechaInicioPlaneada { get; set; }
        public DateTime FechaInicioReal { get; set; }
        [Required]
        public DateTime FechaTerminoPlaneada { get; set; }
        public DateTime FechaTerminoReal { get; set; }
    }
}
