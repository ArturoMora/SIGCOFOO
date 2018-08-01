using INEEL.DataAccess.CR.Models;
using INEEL.DataAccess.GEN.Models.GEN;
using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace INEEL.DataAccess.GEN.Models.GI
{
    [Table("GI.tab_ProductoGIFactorInnovacion")]
    public class ProductoGIFactorInnovacion
    {
        [Key]
        public int Id { get; set; }
        public int ProductoId { get; set; }
        public ProductoGI ProductoGI { get; set; }
        public String Actor { get; set; } /*JP, GER, EV, ADM*/
        [ForeignKey("FactorInnovacion")]
        public int FactorInnovacionId { get; set; }
        public FactorInnovacion FactorInnovacion { get; set; }
        public DateTime Fecha { get; set; }
    }
}
