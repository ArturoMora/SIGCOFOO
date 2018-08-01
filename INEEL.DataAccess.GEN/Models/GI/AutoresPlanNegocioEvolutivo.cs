using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace INEEL.DataAccess.GEN.Models.GI
{
    [Table("GI.tab_AutoresPlanNegocioEvolutivo")]
    public class AutoresPlanNegocioEvolutivo
    {
        [Key]
        [DatabaseGenerated(DatabaseGeneratedOption.Identity)]
        public int AutoresPlanNegocioEvolutivoId { get; set; }
    }
}
