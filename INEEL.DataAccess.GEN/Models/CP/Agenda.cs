using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace INEEL.DataAccess.GEN.Models.CP
{
    [Table("CP.tab_AgendaCP")]
    public class Agenda
    {

        public Agenda() { }

        [Key]
        public int AgendaId { get; set; }
        public string Asunto { get; set; }
        public string Lugar { get; set; }


        [ForeignKey("Comunidad")]
        public int idComunidad { get; set; }
        public virtual Comunidad Comunidad { get; set; }




        public DateTime FechaReunion { get; set; }

        public DateTime HoraReunion { get; set; }

        public DateTime FechaRegistro { get; set; }
        public Boolean Estado { get; set; }
        public Boolean NotificacionEnviada { get; set; }
        public string Autor { get; set; }

    }
}
