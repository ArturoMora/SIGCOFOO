using System;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace INEEL.DataAccess.GEN.Models.CH
{
    [Table("CH.cat_ClasificacionAreas")]
    public  class ClasificacionAreas
    {

        [Key]
        public int id { get; set; }

        public int area { get; set; }

        [StringLength(250)]
        public string nombreArea { get; set; }

        [ForeignKey("periodo")]
        public int? periodoId { get; set; }
        public PeriodoEvaluacion periodo { get; set; }

        [ForeignKey("tipoarea")]
        public int? TipoAreaId { get; set; }
        public TipoArea tipoarea { get; set; }

        public int Estado { get; set; }

    }
}
