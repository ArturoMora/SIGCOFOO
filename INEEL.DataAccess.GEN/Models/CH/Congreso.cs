using System;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace INEEL.DataAccess.CH.Models
{
    [Table("CH.cat_Congresos")]
    public class Congreso
    {
        [Key]
        public int CongresoId { get; set; }

        public DateTime FechaEfectiva { get; set; }
        public int Estado { get; set; }
        [StringLength(300)]
        public string NombreCongreso { get; set; }
        [StringLength(30)]
        public string numero { get; set; }

    }
}
