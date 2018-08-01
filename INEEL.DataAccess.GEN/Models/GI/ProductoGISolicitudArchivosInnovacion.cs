using INEEL.DataAccess.CR.Models;
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
    [Table("GI.tab_ProductoGISolicitudArchivosInnovacion")]
    public class ProductoGISolicitudArchivosInnovacion
    {
        [Key]
        public int Id { get; set; }
        public DateTime Fecha { get; set; }
        public long AdjuntoId { get; set; }
        public Adjunto Adjunto { get; set; }
        [ForeignKey("ProductoGISolicitud")]
        public int ProductoGISolicitudId { get; set; }
        public ProductoGISolicitud ProductoGISolicitud { get; set; }

    }
}
