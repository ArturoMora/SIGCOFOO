using INEEL.DataAccess.GEN.Models.GEN;
using INEEL.DataAccess.MT.Models.ITF;
using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations.Schema;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace INEEL.DataAccess.MT.Models
{
    [Table("MT.AdjuntoITFInsumo")]
    public class AdjuntoITFInsumo
    {
        public int AdjuntoITFInsumoId { get; set; }

        [ForeignKey("Adjunto")]
        public long AdjuntoId { get; set; }
        public Adjunto Adjunto { get; set; }

        [ForeignKey("Insumos")]
        public int InsumosId { get; set; }
        public Insumos Insumos { get; set; }
    }
}
