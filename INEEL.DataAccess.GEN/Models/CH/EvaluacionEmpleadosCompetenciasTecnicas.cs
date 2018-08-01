using System;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace INEEL.DataAccess.GEN.Models.CH
{
    [Table("CH.tab_EvaluacionTecnicas")]
    public class EvaluacionEmpleadosCompetenciasTecnicas
    {

        [Key]
        public int idEvaluacion { get; set; }

        [StringLength(5)]
        public string claveEmpleado { get; set; }

        [StringLength(150)]
        public string nombreEmpleado { get; set; }



        [StringLength(5)]
        public string claveArea { get; set; }

        [StringLength(20)]
        public string claveCategoria { get; set; }

        [StringLength(5)]
        public string idPeriodo { get; set; }
        
        [ForeignKey("estadoEvaluacion")]
        public int estadoEvaluacionId { get; set; }
        public EstadoEvaluacion estadoEvaluacion { get; set; }

        [ForeignKey("calificacion")]
        public int calificacionEvaluacionId { get; set; }
        public CalificacionCompetencias calificacion { get; set; }

        public string brecha { get; set; }

        public int visible { get; set; }

        [ForeignKey("area")]
        public int? tipoArea { get; set; }
        public TipoArea area { get; set; }


        [ForeignKey("nivel")]
        public int? nivelCompetencia { get; set; }
        public NivelCompetenciaTecnica nivel { get; set; }
        

    }
}
