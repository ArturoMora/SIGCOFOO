using INEEL.DataAccess.GEN.Models.GEN;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using System.ComponentModel.DataAnnotations.Schema;
using System.ComponentModel.DataAnnotations;

namespace INEEL.DataAccess.CR.Models
{
    [Table("CR.tab_AdjuntoPorConvenio")]
    public class AdjuntoPorConvenio
    {
        public AdjuntoPorConvenio() { }

        [Key]
        public int AdjuntoPorConvenioId { get; set; }

        [ForeignKey("Adjunto")]
        public long AdjuntoId { get; set; }
        public Adjunto Adjunto { get; set; }

        [ForeignKey("Convenio")]
        public int ConvenioId { get; set; }
        public Convenio Convenio { get; set; }

        [Required]
        public DateTime FechaRegistro { get; set; }

        [StringLength(250)]
        [Required]
        public string Autor { get; set; }

        public Boolean Estado { get; set; }
    }
}
