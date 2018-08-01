using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations.Schema;
using System.Linq;
using System.Web;

namespace INEEL.DataAccess.MT.Models.ITF.catalogos
{
    [Table("MT.cat_CalificacionPersonal")]
    public class CalificacionPersonal
    {
        public int CalificacionPersonalId { get; set; }
        public string Nombre { get; set; }
        public string NombreCorto { get; set; }
        public int Estado { get; set; }
        public DateTime FechaAlta { get; set; }
    }
}