using System;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace INEEL.DataAccess.GEN.Models.CH
{

    [Table("CH.cat_DescripcionNiveles")]
    public class DescripcionNivelCompetencias
    {                                  
        [Key] 
        public int descNivelId { get; set; }

        public string Descripcion { get; set; }

        public string Comportamiento { get; set; }

        [StringLength(4)]
        public string Periodo { get; set; }

        public int Estado { get; set; }

        public int? CompetenciaID { get; set; }
        public Competencias Competencia { get; set; }

        [ForeignKey("nivel")]
        public int? NivelId { get; set; }
        public NivelesCompetencias nivel {get; set;}
    }
}
