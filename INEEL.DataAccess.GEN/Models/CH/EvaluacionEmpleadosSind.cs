using System;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
namespace INEEL.DataAccess.GEN.Models.CH
{
    [Table("CH.tab_EvaluacionEmpleadosSind")]
    public class EvaluacionEmpleadosSind
    {

        [Key]
        public int id { get; set; }
               
        public int EvaluacionId { get; set; }
                                     
        public int ListaEmpleadosId { get; set; }

        [StringLength(255)]
        public string CategoriaNomina { get; set; }

        [StringLength(5)]
        public string Periodo { get; set; }

        [ForeignKey("categoriaSind")]
        public int CategoriaCompetenciaId { get; set; }
        public CategoriasCompetenciasSind categoriaSind { get; set; }
               
        public int EstadoEvaluacionId { get; set; }
           
        public int CalificacionEvaluacionId { get; set; }
     
        public string Fortalezas { get; set; }
        public string AreasMejora { get; set; }
        public string PlanAccion { get; set; }
       
    }
}
