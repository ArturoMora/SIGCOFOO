using INEEL.DataAccess.GEN.Models.GEN;
using INEEL.DataAccess.MT.Models;
using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations.Schema;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace INEEL.DataAccess.MT.Models
{
    [Table("MT.AdjuntoCapitulos")]
    public class AdjuntoCapitulo
    {
        public int AdjuntoCapituloId { get; set; }

        [ForeignKey("Adjunto")]
        public long? AdjuntoId { get; set; }
        public Adjunto Adjunto { get; set; }

        [ForeignKey("Capitulos")]
        public int CapitulosId { get; set; }
        public Capitulos Capitulos { get; set; }
    }
}

