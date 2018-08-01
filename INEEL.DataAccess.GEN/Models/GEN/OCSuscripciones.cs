using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace INEEL.DataAccess.GEN.Models.GEN
{
    [Table("GEN.OCSuscripciones")]
    public class OCSuscripciones
    {
        [Key, Column(Order = 0)]
        [StringLength(10)]
        public String ClaveEmpleado { get; set; }       

        [Key, Column(Order = 1)]
        [ForeignKey("Ocs")]
        public String OcsId { get; set; }
        public Ocs Ocs { get; set; }

        [Required]
        public Boolean suscrito { get; set; }
        
    }
}
