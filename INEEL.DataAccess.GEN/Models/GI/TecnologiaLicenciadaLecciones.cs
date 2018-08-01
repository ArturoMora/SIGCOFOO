using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace INEEL.DataAccess.GEN.Models.GI
{
    [Table("GI.tab_TecnologiaLicenciadaLecciones")]
    public class TecnologiaLicenciadaLecciones
    {
        [Key]
        public int Id { get; set; }
        [Required]
        public string Comentario { get; set; }
        public DateTime Fecha { get; set; }

        [Required]
        public int Tipo { get; set; } /*1 GCyDN, 2 GAJ, 3 Gerencia tecnica*/
        public Boolean Estado { get; set; }

        public int TecnologiaLicenciadaId { get; set; }
        public TecnologiaLicenciada TecnologiaLicenciada { get; set; }
        public string ClavePersona { get; set; }
    }
}
