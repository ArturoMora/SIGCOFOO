using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations.Schema;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace INEEL.DataAccess.GEN.Models.MT.ITF
{
    [Table("MT.BitacoraITFSolicitudDescarga")]
    public class BitacoraITFSolicitudDescarga
    {
        public int id { get; set; }
        public string iditf { get; set; }
        public int idsolicitud { get; set; }
        public string claveSolicitante { get; set; }
        public string claveAutorizador { get; set; }
        public string permisoDescarga { get; set; }
        //public Boolean permisoDescarga { get; set; }
        public DateTime fechaRegistro { get; set; }
    }
}
