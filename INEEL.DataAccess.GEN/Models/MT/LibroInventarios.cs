using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace INEEL.DataAccess.GEN.Models.MT
{
    [Table("MT.LibroInventarios")]
    public class LibroInventarios
    {
        [Key]
        public string NoInventario { get; set; }
        public ICollection<Libros> Libros { get; set; }

    }
}