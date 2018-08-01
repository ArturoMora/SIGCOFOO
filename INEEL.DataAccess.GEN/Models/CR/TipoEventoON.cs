using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace INEEL.DataAccess.GEN.Models.CR
{
    [Table("CR.tab_TiposEventos")]
    public class TipoEventoON
    {
        public TipoEventoON() { }

        [Key]
        public int TipoEventoONId { get; set; }

        [Required]
        [StringLength(200)]
        public string NombreEvento { get; set; }

        [Required]
        public DateTime FechaAlta { get; set; }

        public Boolean Estado { get; set; }
    }
}
