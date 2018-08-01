using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace INEEL.DataAccess.GEN.Models.GEN
{
    [Table("GEN.cat_Likes")]
    public class LikesTipo
    {
        public int Id { get; set; }
        [Required]
        public string Nombre { get; set; }
    }
}
