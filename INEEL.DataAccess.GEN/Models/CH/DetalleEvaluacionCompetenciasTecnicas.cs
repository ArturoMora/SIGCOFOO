using System;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace INEEL.DataAccess.GEN.Models.CH
{

    [Table("CH.tab_DetalleEvaluacionTecnicas")]
    public class DetalleEvaluacionCompetenciasTecnicas
    {
        [Key]                
        public int detalleId { get; set;}

        [StringLength(5)]
        public string claveEmpleado { get; set; }

        [StringLength(5)]
        public string periodoId { get; set; }

        [ForeignKey("competencia")]
        public int idCompetenciaTecnica { get; set; }
        public CompetenciasTecnicas competencia { get; set; }
        
        [ForeignKey("calificacion")]
        public int calificacionEvaluacionId { get; set; }
        public CalificacionCompetencias calificacion { get; set; }
        
        public string observaciones { get; set; }

        public int idEvaluacion { get; set; }

    }
}
