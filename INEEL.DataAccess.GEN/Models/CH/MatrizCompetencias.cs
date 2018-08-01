using System;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace INEEL.DataAccess.GEN.Models.CH
{

    [Table("CH.tab_MtrizCompetencias")]
    public  class MatrizCompetencias
    {
        [Key]
        public int matrizId { get; set; }

        [ForeignKey("competencia")]
        public int competenciaId { get; set; }
        public Competencias competencia { get; set; }

        [ForeignKey("categoria")]
        public int categoriaId { get; set; }
        public CategoriasPorFamilia categoria  {get; set;}

        [ForeignKey("descnivel")]
        public int nivelId { get; set; }
        public DescripcionNivelCompetencias descnivel { get; set; }

        [StringLength(4)]
        public string periodo { get; set; }

        public int estado { get; set; }

        public int claveMatriz { get; set; }


    }
}
