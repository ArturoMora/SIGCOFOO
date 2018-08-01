using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace INEEL.DataAccess.GEN.Models.CP
{
    [Table("CP.cat_RolesCP")]
    public class RolesCP
    {
        public RolesCP() { }

        [Key]
        public int RolId { get; set; }
        public string Nombre { get; set; }
        public string Descripcion { get; set; }
        public string Autor { get; set; }

        public DateTime FechaRegistro { get; set; }
    }
}
