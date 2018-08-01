using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace INEEL.DataAccess.GEN.Util.ModelOld
{
    public class ItfV2
    {
        public int id { get; set; }

        public byte[] archivo { get; set; }
        
        
        public string capturista { get; set; }
        
        
        public string clasificacion { get; set; }
        
        
        public string descriptores { get; set; }
        
        
        public string distribucion { get; set; }
        
        
        public int? ejemplar { get; set; }
        
        
        public int? estadoOC { get; set; }
        
        
        public DateTime? fechaCaptura { get; set; }
        
        
        public DateTime? fechaEdicion { get; set; }
        
        
        public DateTime? fechaRecepcion { get; set; }
        
        
      
        
        
        public string idDivision { get; set; }
        
        
        public string idGerencia { get; set; }
        
        
        public int? idInforme { get; set; }
        
        
        public int? idTipoFormato { get; set; }
        
        
        public int? idTipoOC { get; set; }
        
        
        public string nombreArchivo { get; set; }
        
        
        public string notas { get; set; }
        
        
        public string numAdquisicion { get; set; }
        
        
        public string numInforme { get; set; }
        
        
        public string numProyecto { get; set; }
        
        
        public string proceso { get; set; }
        
        
        public string resumen { get; set; }
        
        
        public string supervisor { get; set; }
        
        //[EdmRelationshipNavigationProperty("SIGCOModel", "FK_tAutorOC_tOC", "tAutorOC")]               
        //public EntityCollection<tAutorOC> tAutorOC { get; set; }
        
        
        public string tipoArchivo { get; set; }
        
        
        public string tipoColeccion { get; set; }
        
        
        public string tituloOC { get; set; }
        /*[XmlIgnore]
        [SoapIgnore]
        [EdmRelationshipNavigationProperty("SIGCOModel", "FK_tOCArchivo_tOC", "tOCArchivo")]
        
        public tOCArchivo tOCArchivo { get; set; }
        [Browsable(false)]
        
        public EntityReference<tOCArchivo> tOCArchivoReference { get; set; }
        [XmlIgnore]
        [EdmRelationshipNavigationProperty("SIGCOModel", "FK_tOC_tTipoFormato1", "tTipoFormato")]
        [SoapIgnore]
        
        public tTipoFormato tTipoFormato { get; set; }
        [Browsable(false)]

        public EntityReference<tTipoFormato> tTipoFormatoReference { get; set; }
        [SoapIgnore]
        [XmlIgnore]
        [EdmRelationshipNavigationProperty("SIGCOModel", "FK_tOC_tTipoOC1", "tTipoOC")]
        
        public tTipoOC tTipoOC { get; set; }
        [Browsable(false)]
        
        public EntityReference<tTipoOC> tTipoOCReference { get; set; }*/


        public bool? ultraConfidencial { get; set; }
        
        
        public int? volumen { get; set; }
        
    }
}
