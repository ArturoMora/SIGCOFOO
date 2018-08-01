using System;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace INEEL.DataAccess.CH.Models
{
    [Table("CH.cat_ExperienciaPrevia")]
    public class ExperienciaPrevia
    {
        [Key]
        public string ClaveEmpleado { get; set; }

        public DateTime? Fecha { get; set; }
        public float DuracionPuesto { get; set; }
    }
}
