using System;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace INEEL.DataAccess.GEN.Models.CH
{
    [Table("CH.tab_EvaluacionConductuales")]
    public class EvaluacionEmpleadosCompetenciasConductuales
    {

        [Key]
        public int EvaluacionId { get; set; }

        [StringLength(5)]
        public string ClaveEmpleado { get; set; }

        [StringLength(200)]
        public string NombreEmpleado { get; set; }

        [StringLength(5)]
        public string claveArea { get; set; }

        [StringLength(4)]
        public string Periodo { get; set; }
             
        [StringLength(100)]          
        public string CategoriaNomina { get; set; }

        [ForeignKey("categoria")]
        public int CategoriaCompetenciasId { get; set; }
        public CategoriasPorFamilia categoria { get; set; }

        [ForeignKey("calificacion")]
        public int CalificacionId { get; set; }
        public CalificacionCompetencias calificacion { get; set; }
              
        public int EstadoEvaluacionId { get; set; }
      

      
        public string Fortalezas { get; set; }

        public string Debilidades { get; set; }

       
        public string AreasMejora { get; set; }

        public int visible { get; set; }

        public int claveEvaluacion { get; set; }


    }
}
