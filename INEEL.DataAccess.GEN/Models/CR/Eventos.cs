using INEEL.DataAccess.GEN.Models.CR;
using INEEL.DataAccess.GEN.Models.GEN;
using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace INEEL.DataAccess.CR.Models
{
    [Table("CR.tab_Eventos")]
    public class Eventos
    {
        public Eventos() { }

        [Key]
        public int EventoId { get; set; }

        [StringLength(250)]
        public string NombreEvento { get; set; }

        [Required]
        [ForeignKey("TipoEvento")]
        public int? TipoEventoONId { get; set; }
        public TipoEventoON TipoEvento { get; set; }

        [StringLength(250)]
        public string Ciudad { get; set; }

        [Required]
        public DateTime FechaEvento { get; set; }

        public Boolean Estado { get; set; }

        [StringLength(250)]
        public string ClaveEmpleado { get; set; }

        [StringLength(250)]
        public string RegistroEmpleado { get; set; }
    }
}