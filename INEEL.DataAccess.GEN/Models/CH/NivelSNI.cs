using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace INEEL.DataAccess.CH.Models
{
    [Table("CH.cat_NivelSNI")]
    public class NivelSNI
    {
        [Key]
        [DatabaseGenerated(DatabaseGeneratedOption.Identity)]
        public int NivelSNIId { get; set; }

        public DateTime fechaEfectiva { get; set; }
        [StringLength(200)]
        public string descripcion { get; set; }
        [StringLength(50)]
        public string descripcionCorta { get; set; }
        public string Estado { get; set; }

        
    }
}
