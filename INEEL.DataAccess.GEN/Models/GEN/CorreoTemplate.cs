using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace INEEL.DataAccess.GEN.Models.GEN
{
    [Table("GEN.cat_CorreoTemplate")]
    public class CorreoTemplate
    {
        [Key]
        [MaxLength(150)]
        public String Id { get; set; }
        public string Header { get; set; }
        [Required]
        public string Body { get; set; }
        public string Footer { get; set; }
        public string Claves { get; set; }
        public string Asunto { get; set; }
    }
}
