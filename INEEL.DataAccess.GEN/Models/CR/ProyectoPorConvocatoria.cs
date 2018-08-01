using INEEL.DataAccess.GEN.Models.GEN;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using System.ComponentModel.DataAnnotations.Schema;
using System.ComponentModel.DataAnnotations;

namespace INEEL.DataAccess.CR.Models
{
    [Table("CR.tab_ProyectoPorConvocatoria")]
    public class ProyectoPorConvocatoria
    {
        public int ProyectoPorConvocatoriaId { get; set; }

        [Required]
        public DateTime FechaRegistro { get; set; }

        [StringLength(250)]
        [Required]
        public string Autor { get; set; }

        public Boolean Estado { get; set; }

        [StringLength(30)]
        public string EdoProyecto { get; set; }

        [Required]
        [ForeignKey("Convocatoria")]
        public int ConvocatoriaId { get; set; }
        public Convocatoria Convocatoria { get; set; }

        [Required]
        [ForeignKey("Proyecto")]
        public string ProyectoId { get; set; }
        public Proyecto Proyecto { get; set; }

        [NotMapped]
        public string[] proyectosE { get; set; }
    }
}
