using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace INEEL.DataAccess.GEN.Models.GEN
{
    [Table("GEN.tab_LikesLinked")]
    public class LikesLinked
    {
        [Key]
        public long Id { get; set; }
        [Required]
        public string Aprobador { get; set; }
        [Required]
        public string Empleado { get; set; }

        [Required]
        [ForeignKey("LikesTipo")]
        public int Tipo { get; set; }
        public LikesTipo LikesTipo { get; set; }

        [Required]
        public string IdExteno { get; set; }
        [Required]
        public Boolean Estado { get; set; }

    }
}
