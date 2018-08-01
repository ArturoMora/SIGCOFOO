using System;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace INEEL.DataAccess.GEN.Models.CH
{
    [Table("CH.cat_DescripcionComportamiento")]
    public class DescripcionNivelComportamiento
    {
                     
        [Key]                                          
        public int DescComportamientoId { get; set; }
              
        public string Descripcion { get; set; }

        [StringLength(4)]
        public string Periodo { get; set; }

        public int Estado { get; set; }

        public int? CompetenciaID { get; set; }
        public Competencias Competencia { get; set; }
        
        public int? NivelId { get; set; }
        public NivelesCompetencias nivel { get; set; }


    }
}
