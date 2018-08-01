using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using System.ComponentModel.DataAnnotations.Schema;
using System.ComponentModel.DataAnnotations;

namespace INEEL.DataAccess.CR.Models
{
    [Table("CR.tab_RelacionPorEmpresa")]
    public class RelacionPorEmpresa
    {
        [Key]
        public int RelacionPorEmpresaId { get; set; }

        [Required]
        [ForeignKey("TipoRelacion")]
        public int TipoRelacionId { get; set; }
        public TipoRelacion TipoRelacion { get; set; }

        [Required]
        [ForeignKey("Empresa")]
        public int EmpresaId { get; set; }
        public Empresa Empresa { get; set; }

        [Required]
        public DateTime FechaRegistro { get; set; }

        [StringLength(250)]
        [Required]
        public string Autor { get; set; }

        public Boolean Estado { get; set; }
    }
}
