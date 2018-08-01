using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using System.ComponentModel.DataAnnotations.Schema;
using System.ComponentModel.DataAnnotations;

namespace INEEL.DataAccess.CR.Models
{
    [Table("CR.tab_TematicaPorFondoPrograma")]
    public class TematicaPorFondoPrograma
    {
        public TematicaPorFondoPrograma() { }

        [Key]
        public int TematicaPorFondoProgramaId { get; set; }

        [Required]
        public DateTime FechaRegistro { get; set; }

        [StringLength(250)]
        [Required]
        public string Autor { get; set; }

        public Boolean Estado { get; set; }

        [ForeignKey("Tematica")]
        public int? TematicaId { get; set; }
        public Tematica Tematica { get; set; }

        [ForeignKey("FondoPrograma")]
        public int? FondoProgramaId { get; set; }
        public FondoPrograma FondoPrograma { get; set; }


    }
}
