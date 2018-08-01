using INEEL.DataAccess.GEN.Models.GEN;
using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace INEEL.DataAccess.GEN.Models.GI
{
    [Table("GI.tab_PlanNegocioEvolArchivos")]
    public class PlanNegocioEvolArchivos
    {
        public PlanNegocioEvolArchivos()
        {
            this.Fecha = DateTime.Now;
        }
        [Key]
        public int Id { get; set; }
        public DateTime Fecha { get; set; }
        public long AdjuntoId { get; set; }
        public Adjunto Adjunto { get; set; }

        public int PlanNegocioEvolutivoId { get; set; }
        public PlanNegocioEvolutivo PlanNegocioEvolutivo { get; set; }
    }
}
