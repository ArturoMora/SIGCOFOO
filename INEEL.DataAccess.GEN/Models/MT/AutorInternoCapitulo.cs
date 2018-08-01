using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using INEEL.DataAccess.GEN.Models.GEN;

namespace INEEL.DataAccess.MT.Models
{
    [Table("MT.AutorInternoCapitulo")]
    public class AutorInternoCapitulo
    {
        [Key]
        public int AutorInternoCapituloId { get; set; }

        [ForeignKey("Capitulos")]
        public int CapitulosId { get; set; }
        public Capitulos Capitulos { get; set; }

        public string ClavePersona { get; set; }

        public int Contribucion { get; set; }

        public int Estado { get; set; }

        public string NombreCompleto { get; set; }
    }
}
