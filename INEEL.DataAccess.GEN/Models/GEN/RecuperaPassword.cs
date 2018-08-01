using INEEL.DataAccess.CR.Models;
using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
namespace INEEL.DataAccess.GEN.Models.GEN
{
    [Table("GEN.RecuperaPassword")]
    public class RecuperaPassword
    {

        public int RecuperaPasswordId { get; set; }

        [StringLength(10)]
        public string ClavePersona { get; set; }

        public DateTime FechaRegistro { get; set; }

        public int ValidezenMinnnutos { get; set; }

        public int Activo { get; set; }

        [NotMapped]
        public string codigo { get; set; }

        [NotMapped]
        public string password { get; set; }

    }
}
