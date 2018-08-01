using System;
using System.ComponentModel.DataAnnotations.Schema;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using System.ComponentModel.DataAnnotations;

namespace INEEL.DataAccess.GEN.Models.GI
{
    [Table("GI.tab_TecnologiaLicenciadaPagos")]
    public class TecnologiaLicenciadaPagos
    {
        public int Id { get; set; }
        [Required]
        public DateTime Fecha { get; set; }
        public int TipoPagosId { get; set; }
        public TipoPagos TipoPagos { get; set; }
        public String Descripcion { get; set; }
        public float Monto { get; set; }

        public int TecnologiaLicenciadaId { get; set; }
        public TecnologiaLicenciada TecnologiaLicenciada { get; set; }
        public string ClavePersona { get; set; }
    }
}
