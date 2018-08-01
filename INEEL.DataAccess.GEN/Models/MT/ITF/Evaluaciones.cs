using INEEL.DataAccess.CH.Models;
using INEEL.DataAccess.GEN.Models.GEN;
using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace INEEL.DataAccess.MT.Models.ITF
{
    [Table("MT.ITFEvaluaciones")]
    public class Evaluaciones
    {
        [Required]
        public int EvaluacionesId { get; set; }        

        //Obtener personal que labora en el proyecto
        [Required]
        public int CalifPer { get; set; }

        [ForeignKey("PersonalProyecto")]
        public long PersonalProyectoId { get; set; }
        public PersonalProyecto PersonalProyecto { get; set;}

        [ForeignKey("InformeTecnicoFinal")]
        [Required]
        public String IdInformeTecnicoFinal { get; set; }
        public InformeTecnicoFinal InformeTecnicoFinal { get; set; }

    }
}
