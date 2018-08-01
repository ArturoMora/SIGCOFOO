using System;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace INEEL.DataAccess.GEN.Models.CH
{
    [Table("CH.cat_PeriodoEvaluacion")]
    public  class PeriodoEvaluacion
    {
        [Key]
        [DatabaseGenerated(DatabaseGeneratedOption.Identity)]
        public int PeriodoEvaluaionId { get; set; }

        [StringLength(100)]
        public string Periodo { get; set; }

        public int Estado { get; set; }

        public int? PersonalMigrado { get; set; }

        public int? EvaluacionFinalizada { get; set; }


    }
}
