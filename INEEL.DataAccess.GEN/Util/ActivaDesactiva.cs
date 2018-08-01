using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace INEEL.DataAccess.GEN.Util
{
    public static class ActivaDesactiva
    {
        public static string activacion { get { return "activacion"; } }
        public static string desactivacion { get { return "desactivacion"; } } // 1
        public static string habilitacion { get { return "habilitacion"; } } // 2
        public static string deshabilitacion { get { return "deshabilitacion"; } }
        //public static string otro { get { return "tipoCambio"; } }OTRO//si se requieren más, se deben agregar al final: NO SE DEBE MODIFICAR EL ORDEN QUE YA EXISTE
    }
}
