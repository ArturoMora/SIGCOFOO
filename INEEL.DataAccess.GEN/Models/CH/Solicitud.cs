using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using INEEL.DataAccess.GEN.Models.GEN;

namespace INEEL.DataAccess.CH.Models
{
    [Table("CH.tab_Solicitud")]
    public class Solicitud
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

        public DateTime FechaSolicitud { get; set;}

        public int EstadoFlujoId { get; set; }
        public EstadoFlujo EstadoFlujo { get; set; }

        public int? ClavePersonaAut { get; set; }

        public string ClaveUnidadAut { get; set; }

        public string titulo { get; set; }

        public String tipoPersonal_Id { get; set; }

        [NotMapped]
        public DateTime fechaBitacora { get; set; }

        
    }
    public class ComparerIdInformacionTipo : IEqualityComparer<Solicitud>
    {
        #region IEqualityComparer
        public bool Equals(Solicitud x, Solicitud y)
        {
            if ((x.TipoInformacionId == y.TipoInformacionId) && (x.InformacionId == y.InformacionId))
            {
                return true;
            }
            else { return false; }
            
        }

        public int GetHashCode(Solicitud obj)
        {
            return obj.InformacionId.GetHashCode();
        }
        #endregion

    }
}
