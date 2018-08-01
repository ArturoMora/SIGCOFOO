using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace INEEL.DataAccess.CR.Models
{
    [Table("CR.cat_Alumnos")]
    public class Alumno
    {

        public Alumno() { }

        [Key]
        public int AlumnoId { get; set; }
        
        [StringLength(200)]
        [Required]
        public string Nombre { get; set; }

        [StringLength(200)]
        public string ApellidoPaterno { get; set; }

        [StringLength(200)]
        public string ApellidoMaterno { get; set; }

        public string Edad { get; set; }

        public string Sexo { get; set; }

    }
}