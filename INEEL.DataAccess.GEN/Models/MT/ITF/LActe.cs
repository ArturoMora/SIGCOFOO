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
    [Table("MT.ITFLeccionesAprendidasCliente")]
    public class LActe
    {
        [Required]
        public int LActeId { get; set; }

        [Required]
        [StringLength(500)]
        public string Negociacion { get; set; }

        [Required]
        [StringLength(500)]
        public string Desarrollo { get; set; }

        [Required]
        [StringLength(500)]
        public string Cierre { get; set; }

    }
}
