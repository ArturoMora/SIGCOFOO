using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace INEEL.DataAccess.CR.Models
{
    [Table("CR.cat_TamanoEmpresa")]
    public class TamanoEmpresa
    {
        public TamanoEmpresa() { }

        [Key]
        public int TamanoEmpresaId { get; set; }

        [StringLength(250)]
        [Required]
        //[Index(IsUnique = true)]
        public string NomTamEmp { get; set; }

        [StringLength(300)]
        public string DesTamEmp { get; set; }

        [Required]
        public DateTime FechaRegistro { get; set; }

        [Required]
        [StringLength(250)]
        public string Autor { get; set; }

        [Required]
        public Boolean Estado { get; set; }

    }
}

