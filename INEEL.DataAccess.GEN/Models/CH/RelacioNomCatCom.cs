using System;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace INEEL.DataAccess.GEN.Models.CH
{

    [Table("CH.cat_RelacionCategorias")]
    public  class RelacioNomCatCom
    {
        [Key]
        public int RelacionCategoriaId { get; set; }

        [StringLength(10)]
        public string CategoriaNomina{ get; set; }

        [StringLength(4)]
        public string Periodo { get; set; }

        public int Estado { get; set; }

        public int? TipoAcompetenciaID { get; set; }
        public TipoCompetencia TipoCompetencias { get; set; }

        public int? CategoriaCompetenciaID { get; set; }
        public CategoriasPorFamilia CategoriasCompetencias { get; set; }


    }
}
