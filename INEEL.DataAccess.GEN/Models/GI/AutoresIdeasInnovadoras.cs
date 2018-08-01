using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace INEEL.DataAccess.GEN.Models.GI
{
    [Table("GI.tab_AutoresIdeasInnovadoras")]
    public class AutoresIdeasInnovadoras
    {
        [Key]
        [DatabaseGenerated(DatabaseGeneratedOption.Identity)]
        public int AutoresIdeasInnovadorasId { get; set; }
    }
}
