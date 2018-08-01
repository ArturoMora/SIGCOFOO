using INEEL.DataAccess.CR.Models;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace INEEL.DataAccess.GEN.Util
{
    public class EmpresaSigProy
    {
        public string NombreEmpresa { get; set; }
        public string Puesto { get; set; }
        public string Telefono { get; set; }
        public string Correo { get; set; }
        public string Direccion { get; set; }
        public DateTime Fecha { get; set; }
        public string ClaveEmpresa { get; set; }
        public string NombreTitular { get; set; }
        public int EmpresaId { get; set; }
        
        //public List<UnidadOrganizacionalEmpresas> unidades { get; set; }
        public List<UnidadOrganizacionalEmpresasExposed> unidadesExposed { get; set; }
        
    }
}
