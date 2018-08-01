using System;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace INEEL.DataAccess.GEN.Models.CH
{
    [Table("CH.cat_RegistroEvaluacionesSind")]
    public class RegistroEvaluacionesSind
    {
        [Key]
        public int id { get; set; }

      
        public int idEvaluacionSin { get; set; }
     
       
        [ForeignKey("matrizSind")]
        public int idMatriz { get; set; }
        public MatrizCompetenciasSind matrizSind { get; set; }

        public int valorEsperado { get; set; }
        public int valorReal { get; set; }
                
        public string justificacion { get; set; }

    }
}
