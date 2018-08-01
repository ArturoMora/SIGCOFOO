using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace INEEL.DataAccess.CR.Models
{
    [Table("CR.tab_Proveedor")]
    public class Proveedor
    {
        public Proveedor() { }

        [Key]
        public int ProveedorId { get; set; }

        public int Clave { get; set; }

        [StringLength(250)]
        [Required]
        //[Index(IsUnique = true)]
        public string Nombre { get; set; }

        [StringLength(300)]
        public string Descripcion { get; set; }

        [Required]
        public DateTime FechaRegistro { get; set; }

        [Required]
        [StringLength(250)]
        public string Autor { get; set; }

        public Boolean Estado { get; set; }

        [Required]
        [ForeignKey("Empresa")]
        public int EmpresaId { get; set; }
        public Empresa Empresa { get; set; }

        //public ICollection<ServicioPorProveedor> ServicioPorProveedor { get; set; }
        //public ICollection<ServicioPorProveedor> ProductoPorProveedor { get; set; }


    }
}