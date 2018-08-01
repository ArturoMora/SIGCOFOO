using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using System.Linq;
using System.Text;
using System.Threading.Tasks;



namespace INEEL.DataAccess.GEN.Models.GEN
{
    [Table("GEN.cat_Categoria")]
    public class Categoria
    {
        [Key]
        public string CategoriaId { get; set; }

        [StringLength(100)]
        public string Descripcion { get; set; }

        [StringLength(5)]
        public string NivelInvestigador { get; set; }

        public int Estado { get; set; }
        
    }
}
