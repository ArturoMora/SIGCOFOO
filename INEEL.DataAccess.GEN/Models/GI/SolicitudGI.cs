using INEEL.DataAccess.CH.Models;
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
    [Table("GI.tab_SolicitudGI")]
    public class SolicitudGI
    {
        [Key]
        public int SolicitudId { get; set; }

        [NotMapped]
        public int SolicitudCPId { get; set; }

        public string ClavePersona { get; set; }

        [NotMapped]
        public string NombreCompleto { get; set; }

        public int TipoInformacionId { get; set; }
        public TipoInformacion TipoInformacion { get; set; }

        public string InformacionId { get; set; }

        public DateTime FechaSolicitud { get; set; }

        public int EstadoFlujoId { get; set; }
        public EstadoFlujo EstadoFlujo { get; set; }

        public int? IdRol { get; set; }

        public string ClaveUnidadAut { get; set; }


        public String TipoPersonal_Id { get; set; }

        [NotMapped]
        public bool AsignadaEval { get; set; }


    }
    public class ComparerIdInformacionTipo : IEqualityComparer<SolicitudGI>
    {
        #region IEqualityComparer
        public bool Equals(SolicitudGI x, SolicitudGI y)
        {
            if ((x.TipoInformacionId == y.TipoInformacionId) && (x.InformacionId == y.InformacionId))
            {
                return true;
            }
            else { return false; }

        }

        public int GetHashCode(SolicitudGI obj)
        {
            return obj.InformacionId.GetHashCode();
        }
        #endregion

    }
}