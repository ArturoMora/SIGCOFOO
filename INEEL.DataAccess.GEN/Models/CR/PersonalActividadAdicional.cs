using INEEL.DataAccess.GEN.Models.GEN;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using System.ComponentModel.DataAnnotations.Schema;
using System.ComponentModel.DataAnnotations;

namespace INEEL.DataAccess.CR.Models
{
    [Table("CR.tab_PersonalActividadAdicional")]
    public class PersonalActividadAdicional
    {
        public PersonalActividadAdicional() { }

        [Key]
        public int PersonalActividadAdicionalId { get; set; }

        public string ClavePersona { get; set; }

        /// <summary>
        /// NotMapped, se setea bajo demanda
        /// </summary>
        [NotMapped]
        public Personas Personas { get; set; }

        [ForeignKey("ActividadAdicional")]
        public int ActividadAdicionalId { get; set; }
        public ActividadAdicional ActividadAdicional { get; set; }

        [Required]
        public DateTime FechaRegistro { get; set; }

        [StringLength(250)]
        [Required]
        public string Autor { get; set; }

        public Boolean Estado { get; set; }
    }
}
