using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace INEEL.DataAccess.GEN.Models.GI
{
    [Table("GI.tab_CompendioResultadosEvaluacionAnualFactorInnovacion")]
    public class CompendioResultadosEvaluacionAnualFactorInnovacion
    {
        [Key]
        [DatabaseGenerated(DatabaseGeneratedOption.Identity)]
        public int CompendioResultadosEvaluacionAnualFactorInnovacionId { get; set; }
    }
}
