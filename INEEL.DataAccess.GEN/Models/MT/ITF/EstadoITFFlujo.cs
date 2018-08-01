using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace INEEL.DataAccess.MT.Models.ITF
{
    [Table("MT.cat_EstadoITFFlujo")]
    public class EstadoITFFlujo
    {
        [KeyAttribute()]
        [DatabaseGenerated(DatabaseGeneratedOption.None)]
        public int EstadoITFFlujoId { get; set; }
        [MaxLength(20)]
        public String Nombre { get; set; }
    }
}
