using System;
using System.Collections.Generic;
using System.ComponentModel;
using System.ComponentModel.DataAnnotations.Schema;
using System.Linq;
using System.Web;

namespace INEEL.DataAccess.MT.Models.ITF.catalogos
{
    
    [Table("MT.cat_TipoAcceso")]
    public class TipoAcceso
    {
        public int TipoAccesoId { get; set; }
        public string Nombre { get; set; }
        public Boolean EstadoDisponible { get; set; }
    }
}