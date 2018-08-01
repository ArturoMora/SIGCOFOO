using System;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace INEEL.DataAccess.CH.Models
{
    [Table("CH.cat_Revistas")]
    public class Revista
    {
        [Key]
        public int RevistaId { get; set; }

        public DateTime FechaEfectiva { get; set; }
        public int Estado { get; set; }
        public string RevistaNombre { get; set; }
        [StringLength(30)]
        public string Volumen { get; set; }
        [StringLength(30)]
        public string Numero { get; set; }
        [StringLength(40)]
        public string ISSN { get; set; }
    }
}
