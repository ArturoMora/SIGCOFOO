using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace INEEL.DataAccess.GEN.Models.GI
{
    [Table("GI.tab_PlanNegocioEvolGerencias")]
    public class PlanNegocioEvolGerencias
    {
        [Key]
        public int Id { get; set; }

        [StringLength(10)]
        public string ClaveUnidad { get; set; }

        public int PlanNegocioEvolutivoId { get; set; }
        public PlanNegocioEvolutivo PlanNegocioEvolutivo { get; set; }

        [NotMapped]
        public string NombreUnidad { get; set; }
    }
}
