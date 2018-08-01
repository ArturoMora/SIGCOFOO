using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace INEEL.DataAccess.GEN.Models.CR
{
    [Table("CR.tab_AutoresEstudioMercado")]
    public class AutoresEstudioMercado
    {
        [Key]
        public int AutoresEstudioMercadoId { get; set; }

        public int EstudiosMercadoId { get; set; }

        public string ClavePersona { get; set; }

        public string NombrePersona { get; set; }
    }
}
