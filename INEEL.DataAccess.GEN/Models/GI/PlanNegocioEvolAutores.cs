using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace INEEL.DataAccess.GEN.Models.GI
{
    [Table("GI.tab_PlanNegocioEvolAutores")]
    public class PlanNegocioEvolAutores
    {
        [Key]
        public int Id { get; set; }

        [StringLength(10)]
        public string ClavePersona { get; set; }
        public string Nombre { get; set; }

        public int PlanNegocioEvolutivoId { get; set; }
        public PlanNegocioEvolutivo PlanNegocioEvolutivo { get; set; }
    }
}
