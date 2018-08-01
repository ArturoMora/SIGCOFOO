using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace INEEL.DataAccess.GEN.Models.GEN
{
    public class ValidacionExist
    {
        public string dato { get; set; }
        public string origen { get; set; }
        public string excepcion { get; set; }

        /***/
        public string datoNuevo { get; set; }
        public string datoViejo { get; set; }
        public string campoTabla { get; set; }
        public string tabla { get; set; }
    }
}
