using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using System.ComponentModel.DataAnnotations.Schema;
using System.ComponentModel.DataAnnotations;

namespace INEEL.DataAccess.CR.Models
{
    [Table("CR.tab_SitioWebFondoPrograma")]
    public class SitioWebFondoPrograma
    {
        public SitioWebFondoPrograma() { }

        [Key]
        public int SitioWebFondoProgramaId { get; set; }

        [Required]
        public string Url { get; set; }

        [StringLength(300)]
        public string Descripcion { get; set; }

        [Required]
        public DateTime FechaRegistro { get; set; }

        [StringLength(250)]
        [Required]
        public string Autor { get; set; }

        public Boolean Estado { get; set; }

        [ForeignKey("FondoPrograma")]
        public int FondoProgramaId { get; set; }
        public FondoPrograma FondoPrograma { get; set; }
    }
}