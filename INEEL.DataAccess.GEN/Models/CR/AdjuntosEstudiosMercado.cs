using INEEL.DataAccess.GEN.Models.GEN;
using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace INEEL.DataAccess.GEN.Models.CR
{
    [Table("CR.tab_AdjuntosEstudiosMercado")]
    public class AdjuntosEstudiosMercado
    {
        public AdjuntosEstudiosMercado() { }

        [Key]
        public int id { get; set; }

        [ForeignKey("Adjunto")]
        public long? AdjuntoId { get; set; }
        public virtual Adjunto Adjunto { get; set; }

        public int EstudiosMercadoId { get; set; }

        public string campoAdicional { get; set; }

        [NotMapped]
        public string nombre { get; set; }
    }
}
