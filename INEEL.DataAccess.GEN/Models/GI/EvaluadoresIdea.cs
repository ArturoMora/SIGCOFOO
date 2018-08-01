using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations.Schema;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace INEEL.DataAccess.GEN.Models.GI
{
    [Table("GI.tab_EvaluadoresIdea")]
    public class EvaluadoresIdea
    {
        public int Id { get; set; }

        public int IdeaInnovadoraId { get; set; }
        public IdeaInnovadora IdeaInnovadora { get; set; }

        public int MiembrosGIId { get; set; }
        public MiembrosGI MiembrosGI { get; set; }

        public String Comentarios { get; set; }

        public String ClavePersona { get; set; }

        [NotMapped]

        public string nombrePersona {get;set;}
    }
}
