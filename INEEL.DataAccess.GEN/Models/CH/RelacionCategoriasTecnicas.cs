using System;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace INEEL.DataAccess.GEN.Models.CH
{

    [Table("CH.cat_RelacionCategoriasTecnicas")]
    public class RelacionCategoriasTecnicas
    {

        [Key]
        public int Id { get; set; }

        [StringLength(10)]
        public string ClaveCategoria { get; set; }

        [StringLength(180)]
        public string categoriaEmpleado { get; set; }

        [ForeignKey("periodo")]
        public int? periodoId { get; set; }
        public PeriodoEvaluacion periodo { get; set; }
             
        [ForeignKey("niveltecnica")]
        public int nivelId { get; set; }
        public NivelCompetenciaTecnica niveltecnica { get; set; }
        
        [ForeignKey("area")]
        public int areaId { get; set; }
        public TipoArea area { get; set; }

        public int Estado { get; set; }

    }
}
