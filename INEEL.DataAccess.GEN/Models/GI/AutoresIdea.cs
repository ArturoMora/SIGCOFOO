using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations.Schema;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using INEEL.DataAccess.GEN.Models.GEN;

namespace INEEL.DataAccess.GEN.Models.GI
{
    [Table("GI.tab_AutoresIdea")]
    public class AutoresIdea
    {
        public int Id { get; set; }
        public String ClavePersona { get; set; }
        [NotMapped]
        public String Persona { get; set; }
        public int IdeaInnovadoraId { get; set; }
        public int ContribucionProponenteId { get; set; }
        public ContribucionProponente ContribucionProponente { get; set; }
    }
}
