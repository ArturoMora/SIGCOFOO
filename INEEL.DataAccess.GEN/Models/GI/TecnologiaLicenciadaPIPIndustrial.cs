using INEEL.DataAccess.GEN.Models.PI;
using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations.Schema;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace INEEL.DataAccess.GEN.Models.GI
{
    [Table("GI.tab_TecnologiaLicenciadaPIPIndustrial")]
    public class TecnologiaLicenciadaPIPIndustrial
    {
        public int Id { get; set; }

        public int TecnologiaLicenciadaId { get; set; }
        public TecnologiaLicenciada TecnologiaLicenciada { get; set; }
        public int PropiedadIndustrialId { get; set; }
        public PropiedadIndustrial PropiedadIndustrial { get; set; }
    }
}
