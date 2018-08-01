using INEEL.DataAccess.GEN.Models.CR;
using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace INEEL.DataAccess.CR.Models
{
    [Table("CR.tab_ContactorPorAliados")]
    public class ContactosPorAliados
    {
        [Key]
        public int id { get; set; }

        public int aliadoId { get; set; }

        [ForeignKey("Contacto")]
        public int? ContactoId { get; set; }
        public Contacto Contacto { get; set; }

        public DateTime fechaRegistro { get; set; }
    }
}
