using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace INEEL.DataAccess.GEN.Models.CH
{
    [Table("CH.tab_ExtractoProfesional")]
    public class ExtractoProfesional
    {
        [Key]
        public String ClaveEmpleado { get; set; }
        [Required]
        public string Extracto { get; set; }
    }
}
