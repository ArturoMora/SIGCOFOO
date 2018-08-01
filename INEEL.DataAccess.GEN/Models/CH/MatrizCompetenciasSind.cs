using System;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace INEEL.DataAccess.GEN.Models.CH
{
    [Table("CH.cat_MatrizCompetenciasSind")]
    public class MatrizCompetenciasSind
    {
        [Key]
        public int id { get; set; }

        [ForeignKey("categorias")]
        public int idCategoria { get; set; }
        public CategoriasCompetenciasSind categorias { get; set; }
      
        [ForeignKey ("relaciones")]
        public int idRelacionCompetencias { get; set; }
        public RelacionCompetenciasNivelesSind relaciones { get; set; }

        public int estado { get; set; }
    }
}
