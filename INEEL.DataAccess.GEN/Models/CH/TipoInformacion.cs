using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace INEEL.DataAccess.CH.Models
{
    [Table("CH.cat_TipoInformacion")]
    public class TipoInformacion
    {
        [Key]
        public int TipoInformacionId { get; set; }

        [MaxLength(150)]
        public string Descripcion { get; set; }
    }
}
