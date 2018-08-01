using INEEL.DataAccess.GEN.Models.GEN;
using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations.Schema;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace INEEL.DataAccess.CH.Models
{
    [Table("CH.AdjuntoBecarioExterno")]
    public class AdjuntoBecarioExterno
    {
        public int AdjuntoBecarioExternoId { get; set; }

        [ForeignKey("Adjunto")]
        public long AdjuntoId { get; set; }
        public Adjunto Adjunto { get; set; }

        [ForeignKey("BecarioExterno")]
        public int BecarioExternoId { get; set; }
        public BecarioExterno BecarioExterno { get; set; }
    }
}
