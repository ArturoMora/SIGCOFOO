using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations.Schema;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace INEEL.DataAccess.GEN.Models.MT.ITF
{
        [Table("MT.TipoInsumo")]
        public class TipoInsumo
        {
         public int TipoInsumoId { get; set; }
         public String DescripcionInsumo { get; set; }
         public Boolean EstadoDisponible { get; set; }
        }
}
