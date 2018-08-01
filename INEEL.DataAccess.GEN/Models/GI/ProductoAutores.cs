using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace INEEL.DataAccess.GEN.Models.GI
{
    [Table("GI.tab_ProductoAutores")]
    public class ProductoAutores
    {
        [Key]
        public int Id { get; set; }

        [StringLength(10)]
        public string ClavePersona { get; set; }
        public string Nombre { get; set; }
        [ForeignKey("ContribucionAutor")]
        public int ContribucionId { get; set; }
        public ContribucionAutor ContribucionAutor { get; set; }
        public int ProductoId { get; set; }
        public ProductoGI Producto { get; set; }
    }
}
