using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations.Schema;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace INEEL.DataAccess.GEN.Models.GI
{
    [Table("GI.tab_ProductoGIEvaluadores")]
    public class ProductoGIEvaluadores
    {
        public int Id { get; set; }
        [ForeignKey("ProductoGI")]
        public int ProductoGIId { get; set; }
        public ProductoGI ProductoGI { get; set; }

        public int MiembrosGIId { get; set; }
        public MiembrosGI MiembrosGI { get; set; }

        public String Comentarios { get; set; }

        public String ClavePersona { get; set; }
    }
}
