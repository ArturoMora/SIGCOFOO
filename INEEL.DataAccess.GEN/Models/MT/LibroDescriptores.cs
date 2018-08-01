using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace INEEL.DataAccess.GEN.Models.MT
{
    [Table("MT.LibroDescriptores")]
    public class LibroDescriptores
    {
        [Key]
        public string Descriptor { get; set; }
        public ICollection<Libros> Libros { get; set; }

    }
}
