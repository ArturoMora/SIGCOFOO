using System;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace INEEL.DataAccess.CH.Models
{

    [Table("CH.cat_BecasInternas")]
    public class BecaInterna
    {
        [Key]
        public int BecaInternaId { get; set; }

        public DateTime FechaEfectiva { get; set; }
        [StringLength(200)]
        public string Descripcion { get; set; }
        [StringLength(50)]
        public string DescripcionCorta { get; set; }
        public int Estado { get; set; }
    }

}
