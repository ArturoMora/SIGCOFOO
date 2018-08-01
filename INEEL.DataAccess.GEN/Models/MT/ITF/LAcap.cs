using INEEL.DataAccess.CH.Models;
using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace INEEL.DataAccess.MT.Models.ITF
{
    [Table("MT.ITFLeccionesAprendidasCapacidad")]
    public class LAcap
    {
        [Required]
        public int LAcapId { get; set; }

        
        [StringLength(500)]
        public string Instalaciones { get; set; }

        [StringLength(500)]
        public string Servicios { get; set; }


    }
}
