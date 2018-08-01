using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace INEEL.DataAccess.GEN.Models.GI
{
    [Table("GI.tab_BitacoraMovimientosGI")]
    public class BitacoraMovimientosGI
    {
        [Key]
        public int Id { get; set; }
        [Required]
        [StringLength(10)]
        public string ClavePersona { get; set; }
        [Required]
        public DateTime Fecha { get; set; }
        [Required]
        public String Movimiento { get; set; } 

        [Required]
        [MaxLength(100)]
        public String OcsId { get; set; } //relación implicita con GEN.cat_Ocs
        public int RegistroId { get; set; }
    }
}
