using System;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace INEEL.DataAccess.GEN.Models.CH
{
    [Table("CH.cat_NominaCompetencias")]
    public class RelacionCategoriaNominaCompetencias
    {
        [Key]
        public int RelacionId { get; set; }
                
        [StringLength(10)]
        public string ClaveCategoria { get; set; }

        [StringLength(180)]
        public string categoriaEmpleado{ get; set; }
        
        [ForeignKey("periodo")]
        public int? periodoId { get; set; }
        public PeriodoEvaluacion periodo { get; set; }

        [ForeignKey("categoria")]
        public int categoriaCompetencia { get; set; }
        public CategoriasPorFamilia categoria { get; set; }
        
        public int? categoriaServicio { get; set; }
        public string nombreCategoriaServicio { get; set; }

        public int? FamiliaId { get; set; }
        public FamiliasPuestos FamiliaPuestos { get; set; }

        public int Estado { get; set; }
    }
}
