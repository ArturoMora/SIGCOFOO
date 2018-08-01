using System;
using System.Collections.Generic;
using System.ComponentModel;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace INEEL.DataAccess.GEN.Models.GEN
{

    [Table("GEN.cat_TipoContrato")]
    public class TipoContrato
    {
                          

        [Key]
        [StringLength(5)]
        public string ContratoId { get; set; }
        public string Descripcion { get; set; }
        public int Estado { get; set; }

    }
}
