using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace INEEL.DataAccess.GEN.Models.GI
{
    [Table("GI.cat_ComiteGI")]
    public class ComiteGI
    {
        [Key]
        public int comiteId { get; set; }
        //public int Id { get; set; }
        [Required]
        public string Nombre { get; set; }
    }
}
