using System;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace INEEL.DataAccess.GEN.Models.CH
{
    [Table("CH.cat_TipoCompetencia")]
    public class TipoCompetencia
    {

        [Key]
        public int TipoCompetenciaId { get; set; }
         
        [StringLength(50)]
        public string NombreCompetencia { get; set; }

        [StringLength(200)]
        public string Descripcion { get; set; }

        public int estado { get; set; }


    }
}
