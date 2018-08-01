using System;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;


namespace INEEL.DataAccess.GEN.Models.CH
{
    [Table("CH.cat_NivelCompetenciaTecnica")]
    public  class NivelCompetenciaTecnica
    {
        [Key]
        [DatabaseGenerated(DatabaseGeneratedOption.Identity)]
        public int NivelCompetenciaId { get; set; }

        [StringLength(100)]
        public string Descripcion { get; set; }

        public int? categoriaMin { get; set; }
        public int? categoraMax { get; set; }
        public int? nivelMin { get; set; }
        public int? nivelMax { get; set; }

        [ForeignKey("periodo")]
        public int? periodoId { get; set; }
        public PeriodoEvaluacion periodo { get; set; }

        [ForeignKey("area")]
        public int? areaId { get; set; }
        public TipoArea area { get; set; }


        public int Estado { get; set; }

    }
}
