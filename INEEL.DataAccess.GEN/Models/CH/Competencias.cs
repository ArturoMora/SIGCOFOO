using System;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace INEEL.DataAccess.GEN.Models.CH
{

    [Table("CH.tab_Competencias")]
    public class Competencias
    {

        [Key]
        public int CompetenciaId { get; set; }

        [StringLength(100)]
        public string Competencia { get; set; }

        [StringLength(600)]
        public string Descripcion { get; set; }

        [ForeignKey("periodo")]
        public int periodoId { get; set; }
        public PeriodoEvaluacion periodo { get; set; }

        public int Estado { get; set; }

    }
}
