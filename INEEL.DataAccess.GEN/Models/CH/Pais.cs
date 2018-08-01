using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace INEEL.DataAccess.CH.Models
{
    [Table("CH.cat_Pais")]
    public class Pais
    {
        

        [Key]
        public int PaisID { get; set; }
        public DateTime FechaEfectiva { get; set; }
        [StringLength(200)]
        public string Descripcion { get; set; }
        [StringLength(50)]
        public string DescripcionCorta { get; set; }
        public string Estado { get; set; }

        
    }
}
