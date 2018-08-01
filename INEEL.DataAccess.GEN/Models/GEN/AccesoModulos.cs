using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace INEEL.DataAccess.GEN.Models.GEN
{
    [Table("GEN.tab_acceso_modulos")]
    public class AccesoModulos
    {

        [Key]
        public long id { get; set; }

        [StringLength(5)]
        public string claveEmpleado { get; set; }

       
        public DateTime fecha { get; set; }

        [StringLength(10)]
        public string modulo { get; set; }





    }
}
