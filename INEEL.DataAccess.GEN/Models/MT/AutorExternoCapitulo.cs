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
    [Table("MT.AutorExternoCapitulo")]
    public class AutorExternoCapitulo
    {
        [Key]
        public int AutorExternoCapituloId { get; set; }

        [ForeignKey("Capitulos")]
        public int CapitulosId { get; set; }
        public Capitulos Capitulos { get; set; }

        public string Nombre { get; set; }

        public string Institucion { get; set; }

        public int Contribucion { get; set; }
    }
}
