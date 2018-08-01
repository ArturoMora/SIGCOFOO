using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace INEEL.DataAccess.GEN.Models.GI
{
    [Table("GI.tab_AutoresCarteraProductosInnovadores")]
    public class AutoresCarteraProductosInnovadores
    {
        [Key]
        [DatabaseGenerated(DatabaseGeneratedOption.Identity)]
        public int AutoresCarteraProductosInnovadoresId { get; set; }
    }
}
