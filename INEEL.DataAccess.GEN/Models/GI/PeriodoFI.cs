using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace INEEL.DataAccess.GEN.Models.GI
{
    [Table("GI.tab_PeriodoFI")]
    public class PeriodoFI
    {
        public int PeriodoFIId { get; set; }
        [Index(IsUnique = true)]
        [MaxLength(150)]
        [Required]
        public String Nombre { get; set; }
        //[Required]
        public String Descripcion { get; set; }
        [Required]
        public DateTime FechaInicioPlaneada { get; set; }
        public DateTime FechaInicioReal { get; set; }
        [Required]
        public DateTime FechaTerminoPlaneada { get; set; }
        public DateTime FechaTerminoReal { get; set; }
        public Boolean Estado { get; set; } /* true? abierto : cerrado*/
    }
}
