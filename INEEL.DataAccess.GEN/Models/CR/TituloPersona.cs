using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace INEEL.DataAccess.CR.Models
{
    [Table("CR.cat_TituloPersona")]
    public class TituloPersona
    {
        public TituloPersona() { }

        [Key]
        public int TituloId { get; set; }
        [Required]
        [StringLength(250)]
        public string Nombre { get; set; }
        [StringLength(300)]
        public string Descripcion { get; set; }
        [Required]
        public string FechaRegistro { get; set; }
        [Required]
        public string Autor { get; set; }
        public Boolean Estado { get; set; }
    }

}
