using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using System.ComponentModel.DataAnnotations.Schema;
using System.ComponentModel.DataAnnotations;

namespace INEEL.DataAccess.CR.Models
{
    [Table("CR.tab_RelacionPorContacto")]
    public class RelacionPorContacto
    {
        public RelacionPorContacto() { }

        [Key]
        public int RelacionPorContactoId { get; set; }

        [Required]
        [ForeignKey("TipoRelacion")]
        public int TipoRelacionId { get; set; }
        public TipoRelacion TipoRelacion { get; set; }

        [Required]
        [ForeignKey("Contacto")]
        public int ContactoId { get; set; }
        public Contacto Contacto { get; set; }

        [StringLength(50)]
        public string Descripcion { get; set; }

        [Required]
        public DateTime FechaRegistro { get; set; }

        [StringLength(250)]
        [Required]
        public string Autor { get; set; }

        public Boolean Estado { get; set; }
    }
}
