using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace INEEL.DataAccess.CH.Models
{
    [Table("CH.tab_Usuario")]
    public class Usuario
    {
        [Key]
        [StringLength(10)]
        public string numEmpleado { get; set; }

        [StringLength(80)]
        public string nombreEmpleado { get; set; }

        [StringLength(80)]
        public string apellidoPaterno { get; set; }

        [StringLength(80)]
        public string apellidoMaterno { get; set; }

        public DateTime fechaIngreso { get; set; }

        [StringLength(80)]
        public string gerencia { get; set; }

        [StringLength(80)]
        public string categoriaActual { get; set; }

        [StringLength(10)]
        public string antiguedad { get; set; }
    }
}
