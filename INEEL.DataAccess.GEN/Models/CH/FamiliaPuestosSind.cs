using System;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace INEEL.DataAccess.GEN.Models.CH
{
    [Table("CH.cat_FamiliaPuestosSind")]
    public class FamiliaPuestosSind
    {

        [Key]
        public int FamiliaId { get; set; }

        [StringLength(100)]
        public string NombreFamilia { get; set; }

        [StringLength(200)]
        public string Descripcion { get; set; }

        [ForeignKey("periodo")]
        public int periodoId { get; set; }
        public PeriodoEvaluacion periodo { get; set; }

        public int estado { get; set; }
    }
}
