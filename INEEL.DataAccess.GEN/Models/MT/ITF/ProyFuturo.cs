using INEEL.DataAccess.CH.Models;
using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace INEEL.DataAccess.MT.Models.ITF
{
    [Table("MT.ITFProyFuturo")]
    public class ProyFuturo
    {
        [Required]
        public int ProyFuturoId { get; set; }

        [Required]
        [StringLength(1000)]
        public string Descripcion { get; set; }

    }
}
