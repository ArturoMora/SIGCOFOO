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
    [Table("CH.tab_AutorIIEPublicacion")]
    public class AutorIIEPublicacion
    {
        [Key]
        public int AutorIIEPublicacionId { get; set; }

        public int PublicacionId { get; set; }
        public Publicacion Publicacion { get; set; }

        public string ClavePersona { get; set; }

        public int Contribucion { get; set; }

        public int Estado { get; set; }

        [NotMapped]
        public string NombreCompleto { get; set; }
    }
}
