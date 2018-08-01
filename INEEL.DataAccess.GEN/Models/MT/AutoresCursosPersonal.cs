using INEEL.DataAccess.MT.Models;
using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations.Schema;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace INEEL.DataAccess.MT.Models
{
    [Table("MT.AutoresCursosPersonal")]
    public class AutoresCursosPersonal
    {
        public int AutoresCursosPersonalId { get; set; }

        public string Autor_ClavePersona { get; set; }
        public string Autor_Nombre { get; set; }

        [ForeignKey("CursosPersonal")]
        public int CursosPersonalId { get; set; }
        public CursosPersonal CursosPersonal { get; set; }
    }
}
