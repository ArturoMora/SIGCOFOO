using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace INEEL.DataAccess.GEN.Models.GEN
{
    [Table("GEN.tab_DetallePersona")]
    public class DetallePersona
    {
        [Key]
        public String ClaveEmpleado { get; set; }
        
        public string Calle { get; set; }
        
        public string Colonia { get; set; }
        
        public string Ciudad { get; set; }
        
        public string EstadoCivil { get; set; }

        [StringLength(20)]
        public string Celular { get; set; }

        [StringLength(5)]
        public string Extension { get; set; }

        [StringLength(20)]
        public string OrigenDatos { get; set; }
        
        public long? AdjuntoId { get; set; }
        public Adjunto Adjunto { get; set; }


        
        public string Ubicacion { get; set; }
    }
}
