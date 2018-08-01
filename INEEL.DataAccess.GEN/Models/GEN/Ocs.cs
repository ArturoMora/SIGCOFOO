using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace INEEL.DataAccess.GEN.Models.GEN
{
    [Table("GEN.cat_Ocs")]
    public class Ocs
    {
        [MaxLength(100)]
        public String OcsId { get; set; }
        public String Nombre { get; set; }

        [Required]
        [StringLength(3)]
        [ForeignKey("Modulo")]
        public string ModuloOrigenId { get; set; }
        public Modulo Modulo { get; set; }

        public ICollection<OCsRolesBlackList> OCsRolesBlackList { get; set; }

        [NotMapped]
        public Boolean IsSuscrito { get; set; }
    }
}
