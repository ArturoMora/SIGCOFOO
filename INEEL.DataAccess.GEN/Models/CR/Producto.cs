using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace INEEL.DataAccess.CR.Models
{
    [Table("CR.cat_Producto")]
    public class Producto
    {
        public Producto() { }

        [Key]
        public int ProductoId { get; set; }

        [StringLength(250)]
        [Required]
        //[Index(IsUnique = true)]
        public string NomProd { get; set; }

        [StringLength(300)]
        public string DescProd { get; set; }

        [Required]
        public DateTime FechaRegistro { get; set; }

        [Required]
        [StringLength(250)]
        public string Autor { get; set; }

        public Boolean Estado { get; set; }

    }
}