using INEEL.DataAccess.MT.Models;
using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations.Schema;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace INEEL.DataAccess.MT.Models
{
    [Table("MT.EditoresCapitulo")]
    public class EditoresCapitulo
    {
        public int EditoresCapituloId { get; set; }

        public string Editor_Nombre { get; set; }

        [ForeignKey("Capitulos")]
        public int CapitulosId { get; set; }
        public Capitulos Capitulos { get; set; }
    }
}
