using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using INEEL.DataAccess.CR.Models;
using INEEL.DataAccess.GEN.Models.GEN;

namespace INEEL.DataAccess.GEN.Models.CR
{
    [Table("CR.tab_InvestigadorPorExperto")]
    public class InvestigadorPorExperto
    {
        [Key]
        public int InvestigadorExpertoId { get; set; }

        [Required]
        public int ContactoId { get; set; }

        [NotMapped]
        public Contacto Contacto { get; set; }

        [Required]
        [StringLength(10)]
        public string ClavePersona { get; set; }

        [NotMapped]
        public Personas Investigador { get; set; }

        public DateTime FechaRegistro { get; set; }
    }
}
