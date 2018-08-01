using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace INEEL.DataAccess.GEN.Models.CP {

    [Table("CP.tab_Preguntas")]
    public class Preguntas
    {
        public Preguntas() { }

        [Key]
        public int PreguntaId { get; set; }

        [ForeignKey("Miembros")]
        public int? idMiembroCP { get; set; }
        public virtual Miembros Miembros { get; set; }
        public string Pregunta { get; set; }
        public string Respuesta { get; set; }
        public DateTime FechaRegistro { get; set; }
        public string idPersona { get; set; }

        [ForeignKey("Comunidad")]
        public int idCP { get; set; }
        public virtual Comunidad Comunidad { get; set; }
    }
}
