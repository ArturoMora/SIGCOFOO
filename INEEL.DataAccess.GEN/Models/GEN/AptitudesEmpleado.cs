using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace INEEL.DataAccess.GEN.Models.GEN
{
    [Table("GEN.tab_AptitudesEmpleado")]
    public class AptitudesEmpleado
    {
        public long Id { get; set; }
        [Required]
        [ForeignKey("AptitudesCat")]
        public int AptitudesCatId { get; set; }
        public AptitudesCat AptitudesCat { get; set; }
        [Required]
        public string ClaveEmpleado { get; set; }
        [Required]
        public Boolean Estado { get; set; }
    }
}
