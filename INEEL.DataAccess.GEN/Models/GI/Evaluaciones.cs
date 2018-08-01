using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace INEEL.DataAccess.GEN.Models.GI
{
    [Table("GI.tab_Evaluaciones")]
    public class Evaluaciones
    {
        [Key]
        [DatabaseGenerated(DatabaseGeneratedOption.Identity)]
        public int EvaluacionesId { get; set; }

        //Relacion con ideainovadora

        //Relacion con evaluadores

        //Relacion con EstadoFlujo
    }
}
