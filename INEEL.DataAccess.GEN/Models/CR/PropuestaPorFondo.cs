using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.ComponentModel.DataAnnotations.Schema;
using System.ComponentModel.DataAnnotations;
using INEEL.DataAccess.GEN.Models.GEN;
using INEEL.DataAccess.CR.Models;
using System.Threading.Tasks;

namespace INEEL.DataAccess.CR.Models
{
    [Table("CR.tab_PropuestaPorFondo")]
    public class PropuestaPorFondo
    {
        [Key]
        public int PropuestaPorFondoId { get; set; }

        [Required]
        public DateTime FechaRegistro { get; set; }

        [StringLength(250)]
        [Required]
        public string Autor { get; set; }

        public Boolean Estado { get; set; }

        [StringLength(30)]
        public string EdoProp { get; set; }

        [ForeignKey("FondoPrograma")]
        public int FondoId { get; set; }
        public virtual FondoPrograma FondoPrograma { get; set; }

        [StringLength(25)]
        [ForeignKey("Propuestas")]
        public string PropuestaId { get; set; }
        public virtual Propuestas Propuestas { get; set; }

        [NotMapped]
        public string[] propuestasE { get; set; }
    }
}
