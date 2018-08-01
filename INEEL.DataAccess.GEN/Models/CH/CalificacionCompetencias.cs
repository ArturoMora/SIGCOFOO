using System;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace INEEL.DataAccess.GEN.Models.CH
{

    [Table("CH.cat_CalificacionCompetencias")]
    public  class CalificacionCompetencias
    {
        [Key]
        public int CalificacionId { get; set; }
        public string calificacion { get; set; }
        public int estado { get; set; }                     
        
    }
}
