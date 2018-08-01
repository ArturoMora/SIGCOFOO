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
    [Table("CR.tab_ServicioPorCompetidor")]
    public class ServicioPorCompetidor
    {
        public ServicioPorCompetidor() { }

        [Key]
        public int ServicioPorCompetidorId { get; set; }

        [ForeignKey("Servicio")]
        public int ServicioId { get; set; }
        public Servicio Servicio { get; set; }

        [ForeignKey("Competidor")]
        public int CompetidorId { get; set; }
        public Competidor Competidor { get; set; }

        [Required]
        public DateTime FechaRegistro { get; set; }

        [StringLength(250)]
        [Required]
        public string Autor { get; set; }

        public Boolean Estado { get; set; }
    }
}
