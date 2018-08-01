using System;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace INEEL.DataAccess.GEN.Models.CH
{
    [Table("CH.cat_CompetenciasTecnicas")]
    public class CompetenciasTecnicas
    {

        [Key]
        [DatabaseGenerated(DatabaseGeneratedOption.Identity)]
        public int CompetenciaId { get; set; }

        [StringLength(200)]
        public string Competencia { get; set; }

        [StringLength(200)]
        public string Descripcion { get; set; }

        [ForeignKey("periodo")]
        public int? periodoId { get; set; }
        public PeriodoEvaluacion periodo { get; set; }

        [ForeignKey("area")]
        public int areaId { get; set; }
        public TipoArea area { get; set; }


        [ForeignKey("niveltecnica")]
        public int nivelId { get; set; }
        public NivelCompetenciaTecnica niveltecnica { get; set; }


        public int Estado { get; set; }
    }
}
