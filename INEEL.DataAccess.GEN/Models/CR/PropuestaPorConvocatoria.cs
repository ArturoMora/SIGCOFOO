using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using System.ComponentModel.DataAnnotations.Schema;
using System.ComponentModel.DataAnnotations;
using INEEL.DataAccess.GEN.Models.GEN;
using INEEL.DataAccess.CR.Models;

namespace INEEL.DataAccess.GEN.Models.CR
{
    [Table("CR.tab_PropuestaPorConvocatoria")]
    public class PropuestaPorConvocatoria
    {
        [Key]
        public int PropuestaPorConvocatoriaId { get; set; }

        [Required]
        public DateTime FechaRegistro { get; set; }

        [StringLength(250)]
        [Required]
        public string Autor { get; set; }

        public Boolean Estado { get; set; }

        [StringLength(30)]
        public string EdoProp { get; set; }

        [Required]
        [ForeignKey("Convocatoria")]
        public int ConvocatoriaId { get; set; }
        public Convocatoria Convocatoria { get; set; }

        [Required]
        [StringLength(25)]
        [ForeignKey("Propuestas")]
        public string PropuestaId { get; set; }
        public Propuestas Propuestas { get; set; }

        [NotMapped]
        public string[] propuestasE { get; set; }
    }
}