using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using System.Data.Entity.Spatial;

namespace INEEL.DataAccess.GEN.Models.GEN
{
    [Table("GEN.cat_EstadoFlujo")]
    public class EstadoFlujo
    {
        
        [Key]
        [DatabaseGenerated(DatabaseGeneratedOption.Identity)]
        public int EstadoFlujoId { get; set; }

        //public DateTime FechaEfectiva { get; set; }//se elimina ya que no se usa

        [StringLength(200)]
        public string Descripcion { get; set; }

        [StringLength(50)]
        public string DescripcionCorta { get; set; }

        public int? Estado { get; set; }
        
    }
}
