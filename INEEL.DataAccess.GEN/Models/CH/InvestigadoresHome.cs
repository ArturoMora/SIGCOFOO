
using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using System.Data.Entity.Spatial;

namespace INEEL.DataAccess.CH.Models
{
    [Table("CH.temp_InvestigadoresHome")]
    public class InvestigadoresHome
    {
        [Key]
        public long InvestigadoresHomeId { get; set; }
        [Required]
        public DateTime Fecha { get; set; }        
        public string GraficaJson { get; set; }        
    }
}
