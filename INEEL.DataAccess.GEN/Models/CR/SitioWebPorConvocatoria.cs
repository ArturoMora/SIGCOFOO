using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using System.ComponentModel.DataAnnotations.Schema;
using System.ComponentModel.DataAnnotations;

namespace INEEL.DataAccess.CR.Models
{
    [Table("CR.tab_SitioWebPorConvocatoria")]
    public class SitioWebPorConvocatoria
    {
        [Key]
        public int SitioWebPorConvocatoriaId { get; set; }

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

        [ForeignKey("Convocatoria")]
        public int ConvocatoriaId { get; set; }
        public Convocatoria Convocatoria { get; set; }
    }
}