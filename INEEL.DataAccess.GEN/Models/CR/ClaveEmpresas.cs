using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace INEEL.DataAccess.GEN.Models.CR
{
    [Table("CR.cat_ClavesEmpresas")]
    public class ClaveEmpresas
    {
        public ClaveEmpresas() { }

        [Key]
        public int ClaveEmpresasId { get; set; }

        [StringLength(100)]
        public string ClaveEmpresa { get; set; }

        [StringLength(250)]
        [Required]
        public string Autor { get; set; }

        [Required]
        public DateTime FechaRegistro { get; set; }

        public Boolean Estado { get; set; }

    }
}
