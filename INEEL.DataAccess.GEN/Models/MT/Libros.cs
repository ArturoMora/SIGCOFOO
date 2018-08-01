using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations.Schema;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace INEEL.DataAccess.GEN.Models.MT
{
    [Table("MT.Libros")]
    public class Libros
    {
        public String LibrosId { get; set; }
        public String Clasificacion { get; set; }
        public String Titulo { get; set; }

        [NotMapped]
        public ICollection<LibrosAutores> AutoresINEEL { get; set; }
       
        public String PieImprenta { get; set; }

        [NotMapped]
        public ICollection<LibroDescriptores> Descriptores { get; set; }

        [NotMapped]
        public ICollection<LibroInventarios> NosInventario { get; set; }
        //public String NoInventario { get; set; }
        public String TipoMaterial { get; set; }
        public String ISBN { get; set; }
        public String Serie { get; set; }
    }
}
