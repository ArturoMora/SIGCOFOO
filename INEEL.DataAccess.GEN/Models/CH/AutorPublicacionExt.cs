using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using INEEL.DataAccess.GEN.Models.GEN;

namespace INEEL.DataAccess.CH.Models
{
    [Table("CH.tab_AutorPublicacionExt")]
    public class AutorPublicacionExt
    {
        [Key]
        public int AutorPublicacionExtId { get; set; }

        public int PublicacionId { get; set; }
        public Publicacion Publicacion { get; set; }

        public string Nombre { get; set; }

        public string Institucion { get; set; }

        public int Contribucion { get; set; }
    }
}
