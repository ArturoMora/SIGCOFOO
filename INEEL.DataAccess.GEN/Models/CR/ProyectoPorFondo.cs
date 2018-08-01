using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using System.ComponentModel.DataAnnotations.Schema;
using System.ComponentModel.DataAnnotations;
using INEEL.DataAccess.GEN.Models.GEN;
using INEEL.DataAccess.CR.Models;

namespace INEEL.DataAccess.CR.Models
{
    [Table("CR.tab_ProyectoPorFondo")]
    public class ProyectoPorFondo
    {
        [Key]
        public int ProyectoPorFondoId { get; set; }

        [Required]
        public DateTime FechaRegistro { get; set; }

        [StringLength(250)]
        [Required]
        public string Autor { get; set; }

        public Boolean Estado { get; set; }

        [StringLength(30)]
        public string EdoProyecto { get; set; }

        [ForeignKey("FondoPrograma")]
        public int FondoId { get; set; }
        public virtual FondoPrograma FondoPrograma { get; set; }

        
        [ForeignKey("Proyecto")]
        public string ProyectoId { get; set; }
        public virtual Proyecto Proyecto { get; set; }

        [NotMapped]
        public string[] proyectosE { get; set; }
    }
}
