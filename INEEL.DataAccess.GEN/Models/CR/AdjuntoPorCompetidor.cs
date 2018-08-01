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
    [Table("CR.tab_AdjuntoPorCompetidor")]
    public class AdjuntoPorCompetidor
    {
        public AdjuntoPorCompetidor() { }

        [Key]
        public int AdjuntoPorCompetidorId { get; set; }

        [ForeignKey("Adjunto")]
        public long AdjuntoId { get; set; }
        public Adjunto Adjunto { get; set; }

        [ForeignKey("Competidor")]
        public int CompetidorId { get; set; }
        public Competidor Competidor { get; set; }

        [Required]
        public DateTime FechaRegistro { get; set; }

        [StringLength(250)]
        [Required]
        public string Autor { get; set; }

        public Boolean Estado { get; set; }

        public Boolean Tarifa { get; set; }

        public Boolean VTC { get; set; }
        
        [NotMapped]
        public string tipo{get;set;}
    }
}
