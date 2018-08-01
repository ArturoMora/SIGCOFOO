using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace INEEL.DataAccess.GEN.Models.GI
{
    [Table("GI.cat_TipoPagos")]
    public class TipoPagos
    {
        
        [Key]
        public int TipoPagosId { get; set; }
        [Required]
        public string Descripcion { get; set; }
        [Required]
        public Boolean Estado { get; set; } /*true activo */
    }
}
