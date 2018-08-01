using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using System.ComponentModel.DataAnnotations.Schema;
using System.ComponentModel.DataAnnotations;

namespace INEEL.DataAccess.CR.Models
{
    [Table("CR.tab_ContactoPorConvocatoria")]
    public class ContactoPorConvocatoria
    {
        [Key]
        public int ContactoPorConvocatoriaId { get; set; }

        public DateTime FechaRegistro { get; set; }

        [StringLength(250)]
        public string Autor { get; set; }

        public Boolean Estado { get; set; }

        [ForeignKey("Convocatoria")]
        public int ConvocatoriaId { get; set; }
        public Convocatoria Convocatoria { get; set; }

        [ForeignKey("Contacto")]
        public int ContactoId { get; set; }
        public Contacto Contacto { get; set; }
    }
}