using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace INEEL.DataAccess.GEN.Models.GI
{
    [Table("GI.tab_TecnologiaLicenciadaGerencia")]
    public class TecnologiaLicenciadaGerencia
    {
        [Key]
        public int Id { get; set; }

        [Required]
        [StringLength(10)]
        public string ClaveUnidad { get; set; }
        public Boolean? Principal { get; set; } /*true:es gerencia principal */
        public int TecnologiaLicenciadaId { get; set; }
        public TecnologiaLicenciada TecnologiaLicenciada { get; set; }

        [NotMapped]
        public string NombreUnidad { get; set; }
    }
}
