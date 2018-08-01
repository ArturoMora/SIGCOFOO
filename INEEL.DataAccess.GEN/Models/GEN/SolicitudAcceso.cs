using INEEL.DataAccess.CH.Models;
using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace INEEL.DataAccess.GEN.Models.GEN
{
   [Table("GEN.tab_SolicitudAcceso")]
   public  class SolicitudAcceso
    {
        [Key]
        public long SolicitudAccesoId { get; set; }
        public string ClavePersonaSolicitante { get; set; }

        [NotMapped]
        public string NombreCompletoSolicitante { get; set; }
        public int TipoInformacionId { get; set; }
        public TipoInformacion TipoInformacion { get; set; } //agregar el registro si no existe (en la tabla)
        /// <summary>  
        /// Clave del registro del OC especifico
        /// </summary>  
        public string InformacionOCId { get; set; }

        /// <summary>
        /// Existen ocs que pueden tener diferentes tipos de acceso para multiples archivos, con esto se resuelve ese problema
        /// </summary>
        public string idAdicional { get; set; }

        /// <summary>  
        /// Fecha en la que se genera la solicitud, no debe actualizarse (las actualizaciones para solicitudes de varios pasos se realizarán en las tablas de bitacora)
        /// </summary>  
        public DateTime FechaSolicitud { get; set; }

        public String unidadAutorizadoraId { get; set; }
        [NotMapped]
        public Personas responsableUnidad { get; set; }

        public int EstadoFlujoId { get; set; }
        public EstadoFlujo EstadoFlujo { get; set; }

        [ForeignKey("Modulo")]
        [StringLength(3)]
        public string ModuloId { get; set; }
        public Modulo Modulo { get; set; }

        [NotMapped]
        public string justificacion{get;set;}
    }
}
