using INEEL.DataAccess.CH.Models;
using INEEL.DataAccess.MT.Models.ITF.catalogos;
using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace INEEL.DataAccess.MT.Models.ITF
{
    [Table("MT.ITFResultadosEconomicos")]
    public class ResultadosE
    {
        [Required]
        public int ResultadosEId { get; set; }        

        [Required]
        [ForeignKey("CalifResultadosFinancieros")]
        public int CalifResE { get; set; }
        public CalifResultadosFinancieros CalifResultadosFinancieros { get; set; }
    }
}
