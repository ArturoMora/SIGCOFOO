using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using INEEL.DataAccess.GEN.Models.GEN;

namespace INEEL.DataAccess.GEN.Models.CP
{
    [Table("CP.tab_Avance")]
    public class Avance
    {
        public Avance() { }

        [Key]
        public int AvanceId { get; set; }

        [ForeignKey("Resultado")]
        public int idResultado { get; set; }
        public virtual Resultado Resultado { get; set; }
        public string Descripcion { get; set; }

        [ForeignKey("Adjunto")]
        public long? AdjuntoId { get; set; }
        public virtual Adjunto Adjunto { get; set; }

        public string Comentario { get; set; }
        public DateTime FechaRegistro { get; set; }

        public virtual ICollection<AvanceMiembros> AvanceMiembros { get; set; }

        [NotMapped]
        public AvanceMiembros[] avances { get; set; }
    }
}
