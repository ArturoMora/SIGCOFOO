using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations.Schema;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace INEEL.DataAccess.GEN.Models.CP
{
    public class ObjetoCP
    {
        [NotMapped]
        public int idObjeto { get; set; }
        [NotMapped]
        public string nombreObjeto { get; set; }
        [NotMapped]
        public string descripcionObjeto { get; set; }
    }
}
