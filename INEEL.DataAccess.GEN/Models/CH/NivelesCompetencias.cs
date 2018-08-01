using System;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace INEEL.DataAccess.GEN.Models.CH
{

    [Table("CH.cat_NivelesCompetencias")]
    public class NivelesCompetencias
    {
                                    
        [Key]
        [DatabaseGenerated(DatabaseGeneratedOption.Identity)]
        public int NivelCompetenciaId { get; set; }

        [StringLength(10)]
        public string Descripcion { get; set; }

         public int Estado { get; set; }

    }
}
