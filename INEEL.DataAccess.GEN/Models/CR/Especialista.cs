using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace INEEL.DataAccess.GEN.Models.CR
{
    public class Especialista
    {
        public Especialista() { }

        [Key]
        public int EspecialistaId { get; set; }

        [StringLength(250)]
        public string Nombre{ get; set; }

        [StringLength(250)]
        public string ApellidoPaterno { get; set; }

        [StringLength(250)]
        public string ApellidoMaterno { get; set; }

        [StringLength(20)]
        public string Telefono { get; set; }

        [StringLength(10)]
        public string Extension { get; set; }

        [StringLength(30)]
        public string Celular { get; set; }

        [StringLength(100)]
        public string Correo { get; set; }

        [StringLength(250)]
        [Required]
        public string Autor { get; set; }

        public DateTime FechaRegistro { get; set; }

        public Boolean Estado { get; set; }

    }
}
