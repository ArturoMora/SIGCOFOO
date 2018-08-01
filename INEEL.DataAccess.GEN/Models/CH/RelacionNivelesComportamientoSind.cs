using System;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace INEEL.DataAccess.GEN.Models.CH
{
    [Table("CH.cat_RelacionNivelesComportamientoSind")]
    public class RelacionNivelesComportamientoSind
    {
        [Key]
        public int id { get; set; }
                                
        [ForeignKey("niveles")]
        public int idNivel { get; set; }
        public NivelesCompetencias niveles { get; set; }
     
        [ForeignKey("comportamientos")]
        public int idComportamiento { get; set; }
        public ComportamientosSind comportamientos { get; set; }
              
       
      
    }
}
