using INEEL.DataAccess.PI.Models;
using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations.Schema;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace INEEL.DataAccess.GEN.Models.GI
{
    [Table("GI.tab_TecnologiaLicenciadaPIDA")]
    public class TecnologiaLicenciadaPIDA
    {
        public int Id { get; set; }

        public int TecnologiaLicenciadaId { get; set; }
        public TecnologiaLicenciada TecnologiaLicenciada { get; set; }
        public int DerechosAutorId { get; set; }
        public DerechosAutor DerechosAutor { get; set; }
        
    }
}
